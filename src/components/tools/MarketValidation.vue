<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Interviewee {
  id: number;
  currentSolution: string;
  willingToPay: 'yes' | 'no' | 'maybe';
  priceWilling: string;
  notes: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  interviewees: Interviewee[];
  createdAt: string;
}

let nextPid = 1;
let nextIid = 1;
const projects = ref<Project[]>([]);
const newProjectName = ref('');
const newProjectDesc = ref('');
const expandedProject = ref<number | null>(null);

// New interviewee form
const newIntCurrent = ref('');
const newIntPay = ref<'yes' | 'no' | 'maybe'>('yes');
const newIntPrice = ref('');
const newIntNotes = ref('');

onMounted(() => {
  const saved = localStorage.getItem('lf_market_validation');
  if (saved) {
    try {
      projects.value = JSON.parse(saved);
      nextPid = projects.value.reduce((m, p) => Math.max(m, p.id), 0) + 1;
      for (const p of projects.value) {
        for (const iv of p.interviewees) {
          nextIid = Math.max(nextIid, iv.id + 1);
        }
      }
    } catch { /* ignore */ }
  }
});

function save() { localStorage.setItem('lf_market_validation', JSON.stringify(projects.value)); }
watch(projects, save, { deep: true });

function addProject() {
  if (!newProjectName.value.trim()) return;
  projects.value.unshift({
    id: nextPid++,
    name: newProjectName.value.trim(),
    description: newProjectDesc.value.trim(),
    interviewees: [],
    createdAt: new Date().toISOString(),
  });
  newProjectName.value = '';
  newProjectDesc.value = '';
}

function addInterviewee(pid: number) {
  const proj = projects.value.find(p => p.id === pid);
  if (!proj) return;
  proj.interviewees.push({
    id: nextIid++,
    currentSolution: newIntCurrent.value.trim(),
    willingToPay: newIntPay.value,
    priceWilling: newIntPrice.value.trim(),
    notes: newIntNotes.value.trim(),
  });
  newIntCurrent.value = '';
  newIntPay.value = 'yes';
  newIntPrice.value = '';
  newIntNotes.value = '';
}

function payRatio(proj: Project): number {
  if (proj.interviewees.length === 0) return 0;
  const willing = proj.interviewees.filter(iv => iv.willingToPay === 'yes').length;
  return Math.round((willing / proj.interviewees.length) * 100);
}

function deleteProject(id: number) { projects.value = projects.value.filter(p => p.id !== id); }
function deleteInterviewee(proj: Project, iid: number) {
  proj.interviewees = proj.interviewees.filter(iv => iv.id !== iid);
}
</script>

<template>
  <div class="space-y-6">
    <!-- 新建项目 -->
    <div class="p-4 rounded-2xl bg-bg-card border border-zinc-700 flex gap-2 flex-wrap">
      <input v-model="newProjectName" placeholder="想法/项目名"
        class="flex-1 min-w-[150px] rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
      <input v-model="newProjectDesc" placeholder="简短描述"
        class="flex-1 min-w-[150px] rounded-xl bg-bg-dark border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
      <button @click="addProject" class="px-6 py-2.5 rounded-xl bg-primary text-black font-medium text-sm hover:bg-primary-dark transition-colors">
        新建验证项目
      </button>
    </div>

    <!-- 项目列表 -->
    <div v-if="projects.length === 0" class="text-center p-8 rounded-2xl bg-bg-card border border-zinc-800 text-zinc-500 text-sm">
      还没有验证项目。记住：先验证需求，再写代码。
    </div>

    <div v-for="proj in projects" :key="proj.id" class="rounded-2xl bg-bg-card border border-zinc-700 overflow-hidden">
      <!-- 项目头部 -->
      <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-bg-card-hover transition-colors"
        @click="expandedProject = expandedProject === proj.id ? null : proj.id">
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-zinc-100">{{ proj.name }}</h3>
            <span class="text-xs text-zinc-500">{{ proj.description }}</span>
          </div>
          <div class="flex gap-4 mt-1 text-xs">
            <span class="text-zinc-500">访谈 {{ proj.interviewees.length }} 人</span>
            <span :class="payRatio(proj) >= 70 ? 'text-green-400 font-semibold' : 'text-zinc-500'">
              愿意付费 {{ payRatio(proj) }}%
            </span>
            <span v-if="payRatio(proj) >= 70 && proj.interviewees.length >= 7" class="text-green-400 font-semibold">
              → 可以考虑做 MVP
            </span>
          </div>
        </div>
        <button @click.stop="deleteProject(proj.id)" class="text-zinc-600 hover:text-red-400 text-sm px-2">&times;</button>
      </div>

      <!-- 展开详情 -->
      <div v-if="expandedProject === proj.id" class="border-t border-zinc-700 p-4 space-y-4">
        <!-- 进度条 -->
        <div>
          <div class="flex justify-between text-xs text-zinc-500 mb-1">
            <span>访谈进度：{{ proj.interviewees.length }}/10+</span>
            <span>目标：7/10 愿意付费</span>
          </div>
          <div class="h-2 rounded-full bg-bg-dark overflow-hidden">
            <div class="h-full rounded-full transition-all" :class="payRatio(proj) >= 70 ? 'bg-green-400' : 'bg-primary'"
              :style="{ width: Math.min(100, Math.max(payRatio(proj), proj.interviewees.length * 10)) + '%' }"></div>
          </div>
        </div>

        <!-- 已有访谈 -->
        <div v-if="proj.interviewees.length > 0" class="space-y-2">
          <h4 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">访谈记录</h4>
          <div v-for="iv in proj.interviewees" :key="iv.id" class="p-3 rounded-lg bg-bg-dark text-sm">
            <div class="flex items-center justify-between mb-1">
              <span :class="iv.willingToPay === 'yes' ? 'text-green-400' : iv.willingToPay === 'maybe' ? 'text-yellow-400' : 'text-red-400'">
                {{ iv.willingToPay === 'yes' ? '愿意付费' : iv.willingToPay === 'maybe' ? '可能愿意' : '不愿付费' }}
                <span v-if="iv.priceWilling" class="text-zinc-500 ml-1">· {{ iv.priceWilling }}</span>
              </span>
              <button @click="deleteInterviewee(proj, iv.id)" class="text-zinc-600 hover:text-red-400 text-xs">&times;</button>
            </div>
            <div v-if="iv.currentSolution" class="text-zinc-500">当前方案：{{ iv.currentSolution }}</div>
            <div v-if="iv.notes" class="text-zinc-600 text-xs mt-1">{{ iv.notes }}</div>
          </div>
        </div>

        <!-- 添加访谈 -->
        <div class="p-3 rounded-xl bg-bg-dark border border-zinc-700 space-y-3">
          <h4 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">添加访谈对象</h4>
          <input v-model="newIntCurrent" placeholder="ta现在怎么解决这个问题？"
            class="w-full rounded-lg bg-bg-card border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
          <div class="flex gap-2">
            <select v-model="newIntPay" class="rounded-lg bg-bg-card border border-zinc-700 px-3 py-2 text-sm text-zinc-200">
              <option value="yes">愿意付钱</option>
              <option value="maybe">可能愿意</option>
              <option value="no">不愿付钱</option>
            </select>
            <input v-model="newIntPrice" placeholder="愿意付多少？"
              class="flex-1 rounded-lg bg-bg-card border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
          </div>
          <input v-model="newIntNotes" placeholder="备注（可选）"
            class="w-full rounded-lg bg-bg-card border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
          <button @click="addInterviewee(proj.id)" class="px-4 py-2 rounded-lg bg-primary text-black font-medium text-sm hover:bg-primary-dark">
            添加记录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
