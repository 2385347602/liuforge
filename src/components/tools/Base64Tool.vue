<script setup lang="ts">
import { ref, computed } from 'vue';

const mode = ref<'encode' | 'decode'>('encode');
const input = ref('');
const error = ref('');

const output = computed(() => {
  error.value = '';
  if (!input.value.trim()) return '';
  try {
    if (mode.value === 'encode') {
      // 编码：字符串 → Base64
      return btoa(unescape(encodeURIComponent(input.value)));
    } else {
      // 解码：Base64 → 字符串
      return decodeURIComponent(escape(atob(input.value.trim())));
    }
  } catch (e) {
    error.value = `解码失败：${(e as Error).message}`;
    return '';
  }
});

function toggleMode() {
  mode.value = mode.value === 'encode' ? 'decode' : 'encode';
  error.value = '';
}

function handleCopy() {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value);
}

function handleSwap() {
  // 把结果放到输入框，方便连续操作
  if (output.value) {
    input.value = output.value;
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 模式切换 + 操作按钮 -->
    <div class="flex flex-wrap gap-2 items-center">
      <button
        @click="toggleMode"
        class="px-4 py-2 rounded-lg bg-primary text-black font-medium text-sm hover:bg-primary-dark transition-colors"
      >
        当前模式：{{ mode === 'encode' ? '编码' : '解码' }}
      </button>
      <button
        @click="handleSwap"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 font-medium text-sm hover:bg-zinc-600 transition-colors"
      >
        交换输入输出
      </button>
      <button
        @click="handleCopy"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-200 font-medium text-sm hover:bg-zinc-600 transition-colors"
      >
        复制结果
      </button>
    </div>

    <!-- 输入 -->
    <div>
      <label class="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
        {{ mode === 'encode' ? '输入文本' : '输入 Base64' }}
      </label>
      <textarea
        v-model="input"
        :placeholder="mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'"
        class="w-full h-32 rounded-xl bg-bg-card border border-zinc-700 p-4 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 resize-y"
      ></textarea>
    </div>

    <!-- 输出 -->
    <div>
      <label class="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
        {{ mode === 'encode' ? 'Base64 结果' : '解码结果' }}
      </label>
      <div
        class="w-full min-h-[3rem] rounded-xl bg-bg-card border border-zinc-700 p-4 text-sm font-mono text-zinc-200 break-all"
      >
        {{ output || '—' }}
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
      {{ error }}
    </div>
  </div>
</template>
