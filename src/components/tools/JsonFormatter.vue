<script setup lang="ts">
import { ref, computed } from 'vue';

const input = ref('');
const error = ref('');

const formatted = computed(() => {
  error.value = '';
  if (!input.value.trim()) return '';
  try {
    const parsed = JSON.parse(input.value);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    error.value = (e as Error).message;
    return '';
  }
});

function handleFormat() {
  // 触发 computed 重新计算（对 input 做格式化）
  if (!input.value.trim()) return;
  try {
    const parsed = JSON.parse(input.value);
    input.value = JSON.stringify(parsed, null, 2);
    error.value = '';
  } catch (e) {
    error.value = (e as Error).message;
  }
}

function handleMinify() {
  if (!input.value.trim()) return;
  try {
    const parsed = JSON.parse(input.value);
    input.value = JSON.stringify(parsed);
    error.value = '';
  } catch (e) {
    error.value = (e as Error).message;
  }
}

function handleCopy() {
  const text = formatted.value || input.value;
  if (!text) return;
  navigator.clipboard.writeText(text);
}

function handleClear() {
  input.value = '';
  error.value = '';
}
</script>

<template>
  <div class="space-y-4">
    <!-- 操作按钮 -->
    <div class="flex flex-wrap gap-2">
      <button
        @click="handleFormat"
        class="px-4 py-2 rounded-lg bg-primary text-black font-medium text-sm hover:bg-primary-dark transition-colors"
      >
        格式化
      </button>
      <button
        @click="handleMinify"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 font-medium text-sm hover:bg-zinc-600 transition-colors"
      >
        压缩
      </button>
      <button
        @click="handleCopy"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 font-medium text-sm hover:bg-zinc-600 transition-colors"
      >
        复制结果
      </button>
      <button
        @click="handleClear"
        class="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 font-medium text-sm hover:bg-zinc-700 transition-colors"
      >
        清空
      </button>
    </div>

    <!-- 输入区域 -->
    <textarea
      v-model="input"
      placeholder='粘贴 JSON 到这里，例如：{"name": "LiuForge"}'
      class="w-full h-64 rounded-xl bg-bg-card border border-zinc-700 p-4 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 resize-y"
    ></textarea>

    <!-- 错误提示 -->
    <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
      {{ error }}
    </div>

    <!-- 格式化结果 -->
    <pre v-if="formatted && !error" class="text-sm text-zinc-300 max-h-96 overflow-auto">{{ formatted }}</pre>
  </div>
</template>
