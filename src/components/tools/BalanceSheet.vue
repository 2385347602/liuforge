<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface AssetItem { name: string; amount: number | null; type: 'liquid' | 'fixed' }
interface LiabilityItem { name: string; amount: number | null }

const monthlyExpense = ref<number | null>(null);
const assets = ref<AssetItem[]>([
  { name: '现金/存款', amount: null, type: 'liquid' },
  { name: '投资理财', amount: null, type: 'liquid' },
  { name: '房产', amount: null, type: 'fixed' },
]);
const liabilities = ref<LiabilityItem[]>([
  { name: '房贷', amount: null },
  { name: '车贷', amount: null },
  { name: '消费贷', amount: null },
]);
const showImportBox = ref(false);
const importJson = ref('');

onMounted(() => {
  const saved = localStorage.getItem('lf_balance_sheet');
  if (saved) {
    try {
      const d = JSON.parse(saved);
      monthlyExpense.value = d.monthlyExpense;
      assets.value = d.assets;
      liabilities.value = d.liabilities;
    } catch { /* ignore */ }
  }
});

function save() {
  localStorage.setItem('lf_balance_sheet', JSON.stringify({
    monthlyExpense: monthlyExpense.value,
    assets: assets.value,
    liabilities: liabilities.value,
  }));
}

watch([monthlyExpense, assets, liabilities], save, { deep: true });

const totalAssets = computed(() =>
  assets.value.reduce((s, a) => s + (a.amount || 0), 0)
);
const totalLiabilities = computed(() =>
  liabilities.value.reduce((s, l) => s + (l.amount || 0), 0)
);
const netWorth = computed(() => totalAssets.value - totalLiabilities.value);
const liquidAssets = computed(() =>
  assets.value.filter(a => a.type === 'liquid').reduce((s, a) => s + (a.amount || 0), 0)
);
const emergencyCoverage = computed(() => {
  if (!monthlyExpense.value || monthlyExpense.value <= 0) return null;
  return Math.round(liquidAssets.value / (monthlyExpense.value * 6) * 100);
});

function addAsset() { assets.value.push({ name: '', amount: null, type: 'liquid' }); }
function removeAsset(i: number) { if (assets.value.length > 1) assets.value.splice(i, 1); }
function addLiability() { liabilities.value.push({ name: '', amount: null }); }
function removeLiability(i: number) { if (liabilities.value.length > 1) liabilities.value.splice(i, 1); }

function exportJson() {
  const data = JSON.stringify({ monthlyExpense: monthlyExpense.value, assets: assets.value, liabilities: liabilities.value }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'liuforge-balance-sheet.json'; a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  try {
    const d = JSON.parse(importJson.value);
    if (d.monthlyExpense != null) monthlyExpense.value = d.monthlyExpense;
    if (d.assets) assets.value = d.assets;
    if (d.liabilities) liabilities.value = d.liabilities;
    showImportBox.value = false;
    importJson.value = '';
  } catch { /* invalid */ }
}

function fmt(n: number | null): string {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 });
}
</script>

<template>
  <div class="space-y-6">
    <!-- 月均支出 -->
    <div class="p-4 rounded-2xl bg-bg-card border border-zinc-700 flex items-center gap-4">
      <label class="text-sm text-zinc-400 shrink-0">月均生活支出</label>
      <input v-model.number="monthlyExpense" type="number" placeholder="例如 8000"
        class="flex-1 rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
    </div>

    <!-- 资产端 -->
    <div class="p-5 rounded-2xl bg-bg-card border border-zinc-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-green-400">资产</h3>
        <button @click="addAsset" class="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30">+ 添加</button>
      </div>
      <div class="space-y-2">
        <div v-for="(a, i) in assets" :key="i" class="flex gap-2 items-center">
          <input v-model="a.name" placeholder="资产名"
            class="w-32 rounded-lg bg-bg-dark border border-zinc-700 px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-primary/50" />
          <select v-model="a.type" class="rounded-lg bg-bg-dark border border-zinc-700 px-2 py-2 text-xs text-zinc-400">
            <option value="liquid">流动资产</option>
            <option value="fixed">固定资产</option>
          </select>
          <input v-model.number="a.amount" type="number" placeholder="金额"
            class="flex-1 rounded-lg bg-bg-dark border border-zinc-700 px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
          <span class="text-xs text-zinc-500 w-20 text-right">{{ fmt(a.amount) }}</span>
          <button @click="removeAsset(i)" class="text-zinc-600 hover:text-red-400 text-sm px-1">&times;</button>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-zinc-700 text-right text-sm font-semibold text-green-400">
        总资产：{{ fmt(totalAssets) }}
      </div>
    </div>

    <!-- 负债端 -->
    <div class="p-5 rounded-2xl bg-bg-card border border-zinc-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-red-400">负债</h3>
        <button @click="addLiability" class="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30">+ 添加</button>
      </div>
      <div class="space-y-2">
        <div v-for="(l, i) in liabilities" :key="i" class="flex gap-2 items-center">
          <input v-model="l.name" placeholder="负债名"
            class="flex-1 rounded-lg bg-bg-dark border border-zinc-700 px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-primary/50" />
          <input v-model.number="l.amount" type="number" placeholder="金额"
            class="w-40 rounded-lg bg-bg-dark border border-zinc-700 px-3 py-2 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50" />
          <span class="text-xs text-zinc-500 w-20 text-right">{{ fmt(l.amount) }}</span>
          <button @click="removeLiability(i)" class="text-zinc-600 hover:text-red-400 text-sm px-1">&times;</button>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-zinc-700 text-right text-sm font-semibold text-red-400">
        总负债：{{ fmt(totalLiabilities) }}
      </div>
    </div>

    <!-- 汇总 -->
    <div class="grid gap-3 sm:grid-cols-3">
      <div class="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <div class="text-xs text-zinc-500 mb-1">净资产</div>
        <div class="text-xl font-bold" :class="netWorth >= 0 ? 'text-primary' : 'text-red-400'">{{ fmt(netWorth) }}</div>
      </div>
      <div class="p-4 rounded-xl bg-bg-card border border-zinc-700 text-center">
        <div class="text-xs text-zinc-500 mb-1">流动资产</div>
        <div class="text-xl font-bold text-zinc-200">{{ fmt(liquidAssets) }}</div>
      </div>
      <div class="p-4 rounded-xl bg-bg-card border border-zinc-700 text-center">
        <div class="text-xs text-zinc-500 mb-1">应急金覆盖率</div>
        <div class="text-xl font-bold" :class="emergencyCoverage != null && emergencyCoverage >= 100 ? 'text-green-400' : 'text-yellow-400'">
          {{ emergencyCoverage != null ? emergencyCoverage + '%' : '—' }}
        </div>
        <div class="text-xs text-zinc-600">目标：6个月生活费</div>
      </div>
    </div>

    <!-- 导入导出 -->
    <div class="flex gap-2">
      <button @click="exportJson" class="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 text-sm font-medium hover:bg-zinc-600">导出 JSON</button>
      <button @click="showImportBox = !showImportBox" class="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 text-sm font-medium hover:bg-zinc-600">导入 JSON</button>
    </div>
    <div v-if="showImportBox" class="space-y-2">
      <textarea v-model="importJson" placeholder="粘贴导出的 JSON..." class="w-full h-24 rounded-xl bg-bg-card border border-zinc-700 p-4 text-sm font-mono text-zinc-200 focus:outline-none focus:border-primary/50"></textarea>
      <button @click="importData" class="px-4 py-2 rounded-lg bg-primary text-black font-medium text-sm hover:bg-primary-dark">确认导入</button>
    </div>
  </div>
</template>
