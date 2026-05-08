<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Holding {
  id: number;
  name: string;
  amount: number | null;
  impactOnLife: 'mild' | 'bad' | 'terrible';
}

let nextId = 1;
const holdings = ref<Holding[]>([
  { id: nextId++, name: '', amount: null, impactOnLife: 'mild' },
]);

const rules = ref([
  '任何单一资产不超过总资产的30%',
  '看不懂的东西绝对不碰',
  '借钱投资等于自杀',
]);

onMounted(() => {
  const saved = localStorage.getItem('lf_investment_risk');
  if (saved) {
    try {
      const d = JSON.parse(saved);
      holdings.value = d.holdings;
      rules.value = d.rules ?? rules.value;
      nextId = holdings.value.reduce((max: number, h: Holding) => Math.max(max, h.id), 0) + 1;
    } catch { /* ignore */ }
  }
});

function save() {
  localStorage.setItem('lf_investment_risk', JSON.stringify({ holdings: holdings.value, rules: rules.value }));
}
watch([holdings, rules], save, { deep: true });

const totalAmount = computed(() =>
  holdings.value.reduce((s, h) => s + (h.amount || 0), 0)
);

function percentage(h: Holding): number {
  if (!h.amount || totalAmount.value === 0) return 0;
  return Math.round((h.amount / totalAmount.value) * 1000) / 10;
}

const warnings = computed(() => {
  return holdings.value.filter(h => h.amount && h.amount > 0 && percentage(h) > 30);
});

function addHolding() {
  holdings.value.push({ id: nextId++, name: '', amount: null, impactOnLife: 'mild' });
}

function removeHolding(idx: number) {
  if (holdings.value.length > 1) holdings.value.splice(idx, 1);
}

function impactLabel(impact: string): string {
  switch (impact) {
    case 'mild': return '还行，不影响生活';
    case 'bad': return '会很难受';
    case 'terrible': return '生活会崩塌';
    default: return '';
  }
}

function impactColor(impact: string): string {
  switch (impact) {
    case 'mild': return 'text-green-400 border-green-400/30';
    case 'bad': return 'text-yellow-400 border-yellow-400/30';
    case 'terrible': return 'text-red-400 border-red-400/30';
    default: return 'text-zinc-400 border-zinc-700';
  }
}

function fmt(n: number): string {
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 });
}

function addRule() { rules.value.push(''); }
function removeRule(idx: number) { if (rules.value.length > 1) rules.value.splice(idx, 1); }
</script>

<template>
  <div class="space-y-6">
    <!-- 铁律 -->
    <div class="p-5 rounded-2xl bg-bg-card border border-zinc-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-primary uppercase tracking-wider">投资铁律</h3>
        <button @click="addRule" class="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30">+ 添加</button>
      </div>
      <div class="space-y-2">
        <div v-for="(r, i) in rules" :key="i" class="flex gap-2 items-center">
          <span class="text-primary text-sm">{{ i + 1 }}.</span>
          <input v-model="rules[i]" class="flex-1 rounded-lg bg-bg-dark border border-zinc-700 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-primary/50" />
          <button @click="removeRule(i)" class="text-zinc-600 hover:text-red-400 text-sm">&times;</button>
        </div>
      </div>
    </div>

    <!-- 持仓列表 -->
    <div class="p-5 rounded-2xl bg-bg-card border border-zinc-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-zinc-300">持仓列表</h3>
        <button @click="addHolding" class="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30">+ 添加资产</button>
      </div>

      <div class="space-y-3">
        <div v-for="(h, i) in holdings" :key="h.id" class="p-3 rounded-xl bg-bg-dark border border-zinc-700">
          <div class="flex gap-2 items-center flex-wrap">
            <input v-model="h.name" placeholder="资产名"
              class="w-28 rounded-lg bg-bg-card border border-zinc-700 px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-primary/50" />
            <input v-model.number="h.amount" type="number" placeholder="金额"
              class="flex-1 min-w-[100px] rounded-lg bg-bg-card border border-zinc-700 px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
            <select v-model="h.impactOnLife" class="rounded-lg bg-bg-card border border-zinc-700 px-2 py-2 text-xs" :class="impactColor(h.impactOnLife)">
              <option value="mild">还行</option>
              <option value="bad">难受</option>
              <option value="terrible">崩塌</option>
            </select>
            <button @click="removeHolding(i)" class="text-zinc-600 hover:text-red-400 text-sm px-1">&times;</button>
          </div>

          <!-- 单项分析 -->
          <div v-if="h.amount && h.amount > 0" class="mt-2 flex gap-4 text-xs">
            <span :class="percentage(h) > 30 ? 'text-red-400' : 'text-zinc-500'">
              占比 {{ percentage(h) }}%
              <span v-if="percentage(h) > 30" class="ml-1">⚠ 超过30%警戒线</span>
            </span>
            <span :class="impactColor(h.impactOnLife)">全部亏损：{{ impactLabel(h.impactOnLife) }}</span>
          </div>
        </div>
      </div>

      <div class="mt-3 pt-3 border-t border-zinc-700 text-right text-sm text-zinc-400">
        总持仓：{{ fmt(totalAmount) }}
      </div>
    </div>

    <!-- 警告汇总 -->
    <div v-if="warnings.length > 0" class="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
      <h3 class="text-sm font-semibold text-red-400 mb-2">风险警告</h3>
      <ul class="space-y-1 text-sm text-red-300">
        <li v-for="w in warnings" :key="w.id">
          <strong>{{ w.name }}</strong>占比 {{ percentage(w) }}%，超过30%警戒线。
          若全部亏损：{{ impactLabel(w.impactOnLife) }}。
        </li>
      </ul>
    </div>
    <div v-else-if="totalAmount > 0" class="p-4 rounded-xl bg-green-400/5 border border-green-400/20 text-sm text-green-400">
      所有资产占比均在30%以内，风险分散良好。
    </div>
  </div>
</template>
