<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 当前时间戳（实时更新）
const now = ref(Math.floor(Date.now() / 1000));
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    now.value = Math.floor(Date.now() / 1000);
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// 时间戳 → 日期
const tsInput = ref('');
const tsResult = computed(() => {
  if (!tsInput.value.trim()) return '';
  const ts = parseInt(tsInput.value);
  if (isNaN(ts)) return '无效的时间戳';
  const d = new Date(ts < 1e12 ? ts * 1000 : ts); // 兼容秒和毫秒
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
});

// 日期 → 时间戳
const dateInput = ref('');
const dateResult = computed(() => {
  if (!dateInput.value.trim()) return '';
  const d = new Date(dateInput.value);
  if (isNaN(d.getTime())) return '无效的日期格式';
  return String(Math.floor(d.getTime() / 1000));
});

// 当前日期字符串
const nowStr = computed(() => {
  const d = new Date(now.value * 1000);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
});

function copyNow() {
  navigator.clipboard.writeText(String(now.value));
}

function copyTsResult() {
  if (tsResult.value) navigator.clipboard.writeText(tsResult.value);
}

function copyDateResult() {
  if (dateResult.value) navigator.clipboard.writeText(dateResult.value);
}
</script>

<template>
  <div class="space-y-6">
    <!-- 当前时间戳 -->
    <div class="p-5 rounded-2xl bg-primary/5 border border-primary/20">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-zinc-500 font-medium uppercase tracking-wider">当前 Unix 时间戳（实时）</span>
        <button
          @click="copyNow"
          class="px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors"
        >
          复制
        </button>
      </div>
      <div class="text-3xl font-mono font-bold text-primary">{{ now }}</div>
      <div class="text-sm text-zinc-400 mt-1">{{ nowStr }}</div>
    </div>

    <!-- 时间戳 → 日期 -->
    <div class="space-y-2">
      <label class="block text-xs text-zinc-500 font-medium uppercase tracking-wider">时间戳 → 日期</label>
      <div class="flex gap-2">
        <input
          v-model="tsInput"
          type="text"
          placeholder="输入 Unix 时间戳..."
          class="flex-1 rounded-xl bg-bg-card border border-zinc-700 px-4 py-3 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
        />
        <button
          @click="copyTsResult"
          class="px-4 py-3 rounded-xl bg-zinc-700 text-zinc-200 text-sm font-medium hover:bg-zinc-600 transition-colors shrink-0"
        >
          复制
        </button>
      </div>
      <div class="text-sm font-mono text-zinc-300 bg-bg-card rounded-xl border border-zinc-700 p-4 min-h-[2.5rem]">
        {{ tsResult || '—' }}
      </div>
    </div>

    <!-- 日期 → 时间戳 -->
    <div class="space-y-2">
      <label class="block text-xs text-zinc-500 font-medium uppercase tracking-wider">日期 → 时间戳</label>
      <div class="flex gap-2">
        <input
          v-model="dateInput"
          type="text"
          placeholder="例如：2025-01-15 14:30:00"
          class="flex-1 rounded-xl bg-bg-card border border-zinc-700 px-4 py-3 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50"
        />
        <button
          @click="copyDateResult"
          class="px-4 py-3 rounded-xl bg-zinc-700 text-zinc-200 text-sm font-medium hover:bg-zinc-600 transition-colors shrink-0"
        >
          复制
        </button>
      </div>
      <div class="text-sm font-mono text-zinc-300 bg-bg-card rounded-xl border border-zinc-700 p-4 min-h-[2.5rem]">
        {{ dateResult || '—' }}
      </div>
    </div>
  </div>
</template>
