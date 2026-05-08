<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface DesireItem {
  id: number;
  name: string;
  price: number | null;
  reason: string;
  quarter: string; // "2025-Q1"
  status: 'want' | 'dont_want' | 'pending';
  addedAt: string;
}

let nextId = 1;
const items = ref<DesireItem[]>([]);
const newName = ref('');
const newPrice = ref<number | null>(null);
const newReason = ref('');

onMounted(() => {
  const saved = localStorage.getItem('lf_desire_list');
  if (saved) {
    try {
      items.value = JSON.parse(saved);
      nextId = items.value.reduce((max, h) => Math.max(max, h.id), 0) + 1;
    } catch { /* ignore */ }
  }
});

function save() { localStorage.setItem('lf_desire_list', JSON.stringify(items.value)); }
watch(items, save, { deep: true });

function currentQuarter(): string {
  const d = new Date();
  return `${d.getFullYear()}-Q${Math.ceil((d.getMonth() + 1) / 3)}`;
}

function addItem() {
  if (!newName.value.trim()) return;
  items.value.unshift({
    id: nextId++,
    name: newName.value.trim(),
    price: newPrice.value,
    reason: newReason.value.trim(),
    quarter: currentQuarter(),
    status: 'pending',
    addedAt: new Date().toISOString(),
  });
  newName.value = '';
  newPrice.value = null;
  newReason.value = '';
}

function markStatus(id: number, status: 'want' | 'dont_want') {
  const item = items.value.find(i => i.id === id);
  if (item) item.status = status;
}

function deleteItem(id: number) {
  items.value = items.value.filter(i => i.id !== id);
}

// Group by quarter
const grouped = computed(() => {
  const map = new Map<string, DesireItem[]>();
  for (const item of items.value) {
    const arr = map.get(item.quarter) || [];
    arr.push(item);
    map.set(item.quarter, arr);
  }
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
});

const stats = computed(() => {
  const total = items.value.filter(i => i.status !== 'dont_want' && i.price);
  const unwanted = items.value.filter(i => i.status === 'dont_want' && i.price);
  const totalPrice = total.reduce((s, i) => s + (i.price || 0), 0);
  const unwantedPrice = unwanted.reduce((s, i) => s + (i.price || 0), 0);
  return {
    totalPrice,
    unwantedPrice,
    totalCount: items.value.length,
    unwantedCount: unwanted.length,
    impulseRate: totalPrice + unwantedPrice > 0 ? Math.round(unwantedPrice / (totalPrice + unwantedPrice) * 100) : 0,
  };
});

function fmt(n: number): string {
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 });
}
</script>

<template>
  <div class="space-y-6">
    <!-- 统计 -->
    <div class="grid gap-3 sm:grid-cols-3 text-center">
      <div class="p-3 rounded-xl bg-bg-card border border-zinc-700">
        <div class="text-xs text-zinc-500 mb-1">历史想买总额</div>
        <div class="text-lg font-bold text-zinc-200">{{ fmt(stats.totalPrice + stats.unwantedPrice) }}</div>
      </div>
      <div class="p-3 rounded-xl bg-bg-card border border-zinc-700">
        <div class="text-xs text-zinc-500 mb-1">冲动消费总额</div>
        <div class="text-lg font-bold text-red-400">{{ fmt(stats.unwantedPrice) }}</div>
      </div>
      <div class="p-3 rounded-xl bg-bg-card border border-zinc-700">
        <div class="text-xs text-zinc-500 mb-1">冲动率</div>
        <div class="text-lg font-bold" :class="stats.impulseRate > 50 ? 'text-red-400' : 'text-green-400'">{{ stats.impulseRate }}%</div>
        <div class="text-xs text-zinc-600">{{ stats.unwantedCount }}/{{ stats.totalCount }} 件</div>
      </div>
    </div>

    <!-- 添加 -->
    <div class="p-4 rounded-2xl bg-bg-card border border-zinc-700 flex gap-2 flex-wrap">
      <input v-model="newName" placeholder="想要什么..."
        class="flex-1 min-w-[120px] rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
      <input v-model.number="newPrice" type="number" placeholder="价格"
        class="w-28 rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
      <input v-model="newReason" placeholder="理由（可选）"
        class="flex-1 min-w-[120px] rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
      <button @click="addItem" class="px-6 py-2.5 rounded-xl bg-primary text-black font-medium text-sm hover:bg-primary-dark transition-colors">
        添加
      </button>
    </div>

    <!-- 按季度分组 -->
    <div v-if="grouped.length === 0" class="text-center p-8 rounded-2xl bg-bg-card border border-zinc-800 text-zinc-500 text-sm">
      还没有记录。添加第一个"想要"吧。
    </div>
    <div v-for="[q, qItems] in grouped" :key="q" class="space-y-2">
      <h3 class="text-sm font-semibold text-zinc-400">{{ q }}</h3>
      <div v-for="item in qItems" :key="item.id"
        class="p-3 rounded-xl bg-bg-card border transition-colors"
        :class="item.status === 'dont_want' ? 'border-zinc-800 opacity-50' : item.status === 'want' ? 'border-green-400/30' : 'border-zinc-700'">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <span class="text-sm font-medium text-zinc-200">{{ item.name }}</span>
            <span v-if="item.price" class="text-sm font-mono text-zinc-400 ml-2">{{ fmt(item.price) }}</span>
            <div v-if="item.reason" class="text-xs text-zinc-500 mt-0.5">{{ item.reason }}</div>
          </div>
          <div class="flex gap-1 items-center shrink-0">
            <button v-if="item.status !== 'want'" @click="markStatus(item.id, 'want')"
              class="px-2 py-1 rounded text-xs text-green-400 hover:bg-green-400/10">
              还想要
            </button>
            <button v-if="item.status !== 'dont_want'" @click="markStatus(item.id, 'dont_want')"
              class="px-2 py-1 rounded text-xs text-zinc-500 hover:bg-zinc-700">
              不想要了
            </button>
            <button @click="deleteItem(item.id)" class="px-2 py-1 rounded text-xs text-zinc-600 hover:text-red-400">&times;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
