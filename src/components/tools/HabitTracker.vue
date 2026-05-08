<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface HabitRound {
  name: string;
  startDate: string;
  days: (boolean | null)[]; // true=done, false=missed, null=pending
  completed: boolean;
}

const rounds = ref<HabitRound[]>([]);
const newHabitName = ref('');
const editingRoundIdx = ref<number | null>(null);

onMounted(() => {
  const saved = localStorage.getItem('lf_habit_tracker');
  if (saved) {
    try { rounds.value = JSON.parse(saved); } catch { /* ignore */ }
  }
});

function save() { localStorage.setItem('lf_habit_tracker', JSON.stringify(rounds.value)); }
watch(rounds, save, { deep: true });

const activeRound = computed(() => rounds.value.find(r => !r.completed));

function startNewRound() {
  if (!newHabitName.value.trim()) return;
  rounds.value.push({
    name: newHabitName.value.trim(),
    startDate: new Date().toISOString(),
    days: new Array(21).fill(null),
    completed: false,
  });
  newHabitName.value = '';
}

function toggleDay(dayIdx: number) {
  const round = activeRound.value;
  if (!round) return;
  const current = round.days[dayIdx];
  // cycle: null → true → false → null
  if (current === null) round.days[dayIdx] = true;
  else if (current === true) round.days[dayIdx] = false;
  else round.days[dayIdx] = null;

  // auto-complete check
  const completedDays = round.days.filter(d => d === true).length;
  // check if all 21 days are either done or missed (not null)
  if (round.days.every(d => d !== null)) {
    round.completed = true;
  }
  save();
}

function getStreak(round: HabitRound): number {
  let streak = 0;
  for (let i = round.days.length - 1; i >= 0; i--) {
    if (round.days[i] === true) streak++;
    else break;
  }
  return streak;
}

function completedCount(round: HabitRound): number {
  return round.days.filter(d => d === true).length;
}

function startDateStr(round: HabitRound): string {
  return new Date(round.startDate).toLocaleDateString('zh-CN');
}

function endDateStr(round: HabitRound): string {
  const d = new Date(round.startDate);
  d.setDate(d.getDate() + 20);
  return d.toLocaleDateString('zh-CN');
}

function dayLabel(idx: number): string {
  const round = activeRound.value;
  if (!round) return `第${idx + 1}天`;
  const d = new Date(round.startDate);
  d.setDate(d.getDate() + idx);
  return `${idx + 1} (${d.getMonth() + 1}/${d.getDate()})`;
}

function deleteRound(idx: number) { rounds.value.splice(idx, 1); }
</script>

<template>
  <div class="space-y-6">
    <!-- 新建习惯 -->
    <div class="flex gap-2">
      <input v-model="newHabitName" placeholder="输入要培养的习惯，例如：每晚11点前睡觉"
        class="flex-1 rounded-xl bg-bg-card border border-zinc-700 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-primary/50" />
      <button @click="startNewRound" :disabled="!!activeRound"
        class="px-6 py-3 rounded-xl font-medium text-sm transition-colors shrink-0"
        :class="activeRound ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-primary text-black hover:bg-primary-dark'">
        开始 21 天
      </button>
    </div>
    <div v-if="activeRound" class="text-xs text-yellow-400 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
      当前进行中：完成后再开始新一轮。每天记录是否坚持。
    </div>

    <!-- 当前打卡网格 -->
    <div v-if="activeRound" class="p-5 rounded-2xl bg-bg-card border border-primary/20">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-semibold text-zinc-100">{{ activeRound.name }}</h3>
          <p class="text-xs text-zinc-500">{{ startDateStr(activeRound) }} ~ {{ endDateStr(activeRound) }}</p>
        </div>
        <div class="flex gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-primary">{{ getStreak(activeRound) }}</div>
            <div class="text-xs text-zinc-500">连续天数</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-zinc-200">{{ completedCount(activeRound) }} / 21</div>
            <div class="text-xs text-zinc-500">总计完成</div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1.5">
        <button v-for="(day, i) in activeRound.days" :key="i" @click="toggleDay(i)"
          class="aspect-square rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all"
          :class="day === true ? 'bg-primary text-black' : day === false ? 'bg-red-500/20 text-red-400' : 'bg-bg-dark text-zinc-600 hover:bg-zinc-700 hover:text-zinc-400'"
          :title="dayLabel(i)">
          <span>{{ i + 1 }}</span>
          <span class="text-[10px]">{{ day === true ? '✓' : day === false ? '✗' : '·' }}</span>
        </button>
      </div>
      <div class="mt-3 flex gap-3 text-xs text-zinc-600">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-primary inline-block"></span>完成</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-red-500/40 inline-block"></span>未完成</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-bg-dark inline-block"></span>待打卡</span>
        <span class="text-zinc-500 ml-auto">点击切换状态</span>
      </div>
    </div>

    <!-- 历史记录 -->
    <div v-if="rounds.filter(r => r.completed).length > 0" class="space-y-3">
      <h3 class="text-sm font-semibold text-zinc-400">历史记录</h3>
      <div v-for="(r, i) in rounds.filter(r => r.completed)" :key="i" class="p-4 rounded-xl bg-bg-card border border-zinc-800">
        <div class="flex items-center justify-between">
          <div>
            <span class="font-medium text-zinc-200">{{ r.name }}</span>
            <span class="text-xs text-zinc-500 ml-2">{{ startDateStr(r) }} ~ {{ endDateStr(r) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold" :class="completedCount(r) >= 18 ? 'text-green-400' : completedCount(r) >= 12 ? 'text-yellow-400' : 'text-zinc-400'">
              {{ completedCount(r) }}/21
            </span>
            <button @click="deleteRound(rounds.indexOf(r))" class="text-zinc-600 hover:text-red-400 text-sm">&times;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
