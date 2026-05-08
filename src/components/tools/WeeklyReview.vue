<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Review {
  id: string;
  weekLabel: string;
  wentWell: string;
  wentWrong: string;
  changeNext: string;
  createdAt: string;
}

const reviews = ref<Review[]>([]);
const wentWell = ref('');
const wentWrong = ref('');
const changeNext = ref('');

onMounted(() => {
  const saved = localStorage.getItem('lf_weekly_review');
  if (saved) {
    try { reviews.value = JSON.parse(saved); } catch { /* ignore */ }
  }
});

function save() { localStorage.setItem('lf_weekly_review', JSON.stringify(reviews.value)); }

function getWeekLabel(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

function submit() {
  if (!wentWell.value.trim() && !wentWrong.value.trim() && !changeNext.value.trim()) return;
  reviews.value.unshift({
    id: Date.now().toString(),
    weekLabel: getWeekLabel(),
    wentWell: wentWell.value.trim(),
    wentWrong: wentWrong.value.trim(),
    changeNext: changeNext.value.trim(),
    createdAt: new Date().toISOString(),
  });
  wentWell.value = '';
  wentWrong.value = '';
  changeNext.value = '';
  save();
}

function deleteReview(id: string) {
  reviews.value = reviews.value.filter(r => r.id !== id);
  save();
}

function exportMarkdown() {
  const lines = reviews.value.map((r, i) => {
    return `## 复盘 #${reviews.value.length - i}\n**日期：${r.weekLabel}**\n\n### ✅ 做对了什么\n${r.wentWell || '—'}\n\n### ❌ 做错了什么\n${r.wentWrong || '—'}\n\n### 🔧 下周改一件事\n${r.changeNext || '—'}\n`;
  });
  const md = `# 周复盘记录\n\n${lines.join('\n---\n\n')}`;
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `weekly-review-${new Date().toISOString().slice(0, 10)}.md`; a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="space-y-6">
    <!-- 当前复盘表单 -->
    <div class="p-5 rounded-2xl bg-bg-card border border-zinc-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-zinc-100">本周复盘：{{ getWeekLabel() }}</h3>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs text-green-400 mb-1 font-medium uppercase tracking-wider">做对了什么</label>
          <textarea v-model="wentWell" placeholder="这周哪些事情做得好？保留什么？"
            class="w-full h-24 rounded-xl bg-bg-dark border border-zinc-700 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-400/50 resize-y"></textarea>
        </div>
        <div>
          <label class="block text-xs text-red-400 mb-1 font-medium uppercase tracking-wider">做错了什么</label>
          <textarea v-model="wentWrong" placeholder="这周哪里做得不好？复盘什么原因？"
            class="w-full h-24 rounded-xl bg-bg-dark border border-zinc-700 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-400/50 resize-y"></textarea>
        </div>
        <div>
          <label class="block text-xs text-primary mb-1 font-medium uppercase tracking-wider">下周改一件事</label>
          <textarea v-model="changeNext" placeholder="只写一件事，下周严格执行。"
            class="w-full h-20 rounded-xl bg-bg-dark border border-zinc-700 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 resize-y"></textarea>
        </div>
      </div>

      <button @click="submit"
        class="mt-4 px-6 py-3 rounded-xl bg-primary text-black font-medium text-sm hover:bg-primary-dark transition-colors">
        提交本周复盘
      </button>
    </div>

    <!-- 历史列表 -->
    <div v-if="reviews.length > 0" class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-zinc-400">历史复盘（{{ reviews.length }} 周）</h3>
        <button @click="exportMarkdown" class="px-3 py-1.5 rounded-lg bg-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-600">
          导出 Markdown
        </button>
      </div>
      <div v-for="r in reviews" :key="r.id" class="p-4 rounded-xl bg-bg-card border border-zinc-800">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-zinc-300">{{ r.weekLabel }}</span>
          <button @click="deleteReview(r.id)" class="text-zinc-600 hover:text-red-400 text-sm">&times; 删除</button>
        </div>
        <div class="grid gap-2 text-sm">
          <div v-if="r.wentWell" class="flex gap-2">
            <span class="text-green-400 shrink-0">✅</span>
            <span class="text-zinc-400">{{ r.wentWell }}</span>
          </div>
          <div v-if="r.wentWrong" class="flex gap-2">
            <span class="text-red-400 shrink-0">❌</span>
            <span class="text-zinc-400">{{ r.wentWrong }}</span>
          </div>
          <div v-if="r.changeNext" class="flex gap-2">
            <span class="text-primary shrink-0">🔧</span>
            <span class="text-zinc-400">{{ r.changeNext }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-8 rounded-2xl bg-bg-card border border-zinc-800 text-zinc-500 text-sm">
      还没有复盘记录。完成第一份周复盘吧。
    </div>
  </div>
</template>
