<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const annualExpense = ref<number | null>(null);
const currentAge = ref<number | null>(null);
const retireAge = ref<number | null>(60);
const currentSavings = ref<number | null>(null);
const returnRate = ref<number | null>(5);

onMounted(() => {
  const saved = localStorage.getItem('lf_retirement_calc');
  if (saved) {
    try {
      const d = JSON.parse(saved);
      annualExpense.value = d.annualExpense;
      currentAge.value = d.currentAge;
      retireAge.value = d.retireAge ?? 60;
      currentSavings.value = d.currentSavings;
      returnRate.value = d.returnRate ?? 5;
    } catch { /* ignore */ }
  }
});

function save() {
  localStorage.setItem('lf_retirement_calc', JSON.stringify({
    annualExpense: annualExpense.value,
    currentAge: currentAge.value,
    retireAge: retireAge.value,
    currentSavings: currentSavings.value,
    returnRate: returnRate.value,
  }));
}
watch([annualExpense, currentAge, retireAge, currentSavings, returnRate], save, { deep: true });

const targetAssets = computed(() =>
  annualExpense.value ? annualExpense.value * 25 : null
);
const yearsLeft = computed(() =>
  currentAge.value != null && retireAge.value != null ? Math.max(0, retireAge.value - currentAge.value) : null
);
const annualNeeded = computed(() => {
  if (targetAssets.value == null || yearsLeft.value == null || yearsLeft.value === 0) return null;
  const needed = (targetAssets.value - (currentSavings.value || 0)) / yearsLeft.value;
  return Math.max(0, Math.round(needed));
});
const gap = computed(() => {
  if (targetAssets.value == null || currentSavings.value == null) return null;
  return targetAssets.value - currentSavings.value;
});
const futureValue = computed(() => {
  if (currentSavings.value == null || returnRate.value == null || yearsLeft.value == null) return null;
  const r = returnRate.value / 100;
  return Math.round(currentSavings.value * Math.pow(1 + r, yearsLeft.value));
});

function fmt(n: number): string {
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 });
}
</script>

<template>
  <div class="space-y-6">
    <!-- 输入 -->
    <div class="p-5 rounded-2xl bg-bg-card border border-zinc-700 grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-xs text-zinc-500 mb-1 font-medium">年支出 (元)</label>
        <input v-model.number="annualExpense" type="number" placeholder="例如 120000"
          class="w-full rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label class="block text-xs text-zinc-500 mb-1 font-medium">已有储蓄 (元)</label>
        <input v-model.number="currentSavings" type="number" placeholder="例如 500000"
          class="w-full rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label class="block text-xs text-zinc-500 mb-1 font-medium">当前年龄</label>
        <input v-model.number="currentAge" type="number" placeholder="例如 28"
          class="w-full rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
      </div>
      <div>
        <label class="block text-xs text-zinc-500 mb-1 font-medium">目标退休年龄</label>
        <input v-model.number="retireAge" type="number" placeholder="例如 60"
          class="w-full rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
      </div>
    </div>

    <!-- 结果 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <div class="text-xs text-zinc-500 mb-1">退休目标资产</div>
        <div class="text-xl font-bold text-primary">{{ targetAssets ? fmt(targetAssets) : '—' }}</div>
        <div class="text-xs text-zinc-600">年支出 × 25（4%法则）</div>
      </div>
      <div class="p-4 rounded-xl bg-bg-card border border-zinc-700 text-center">
        <div class="text-xs text-zinc-500 mb-1">退休缺口</div>
        <div class="text-xl font-bold" :class="gap != null && gap > 0 ? 'text-yellow-400' : 'text-green-400'">{{ gap != null ? fmt(gap) : '—' }}</div>
        <div class="text-xs text-zinc-600">目标 - 已有储蓄</div>
      </div>
      <div class="p-4 rounded-xl bg-bg-card border border-zinc-700 text-center">
        <div class="text-xs text-zinc-500 mb-1">每年需净积累</div>
        <div class="text-xl font-bold text-zinc-200">{{ annualNeeded ? fmt(annualNeeded) : '—' }}</div>
        <div class="text-xs text-zinc-600">剩余 {{ yearsLeft ?? '?' }} 年</div>
      </div>
      <div class="p-4 rounded-xl bg-bg-card border border-zinc-700 text-center">
        <div class="text-xs text-zinc-500 mb-1">已有储蓄未来值</div>
        <div class="text-xl font-bold text-zinc-200">{{ futureValue ? fmt(futureValue) : '—' }}</div>
        <div class="text-xs text-zinc-600">按 {{ returnRate }}% 年化复利</div>
      </div>
    </div>

    <!-- 投资回报率 -->
    <div class="p-4 rounded-2xl bg-bg-card border border-zinc-700">
      <label class="block text-xs text-zinc-500 mb-2 font-medium">假设年化投资回报率：{{ returnRate }}%</label>
      <input v-model.number="returnRate" type="range" min="1" max="12" step="0.5"
        class="w-full accent-primary" />
      <div class="flex justify-between text-xs text-zinc-600">
        <span>1% 保守</span><span>12% 乐观</span>
      </div>
    </div>

    <!-- 情景分析 -->
    <div class="p-4 rounded-2xl bg-bg-card border border-zinc-700">
      <h3 class="text-sm font-semibold text-zinc-300 mb-3">不同回报率情景</h3>
      <div class="grid gap-2 sm:grid-cols-4 text-center">
        <template v-for="r in [3, 5, 7, 10]" :key="r">
          <div class="p-3 rounded-lg bg-bg-dark">
            <div class="text-xs text-zinc-500">{{ r }}%</div>
            <div class="text-sm font-mono text-zinc-200 font-semibold">
              {{ currentSavings && yearsLeft ? fmt(Math.round(currentSavings * Math.pow(1 + r / 100, yearsLeft))) : '—' }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
