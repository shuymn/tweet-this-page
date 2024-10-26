<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <component :is="currentThemeIcon" class="w-5 h-5" />
    </label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-300 rounded-box">
      <li v-for="option in themeOptions" :key="option.value">
        <button class="flex items-center gap-2" @click="handleThemeChange">
          <component :is="option.icon" class="w-4 h-4" />
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Computer, Sun, Moon } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { Theme } from '@/utils/storage';

const store = useOptionsStore()
const { theme } = storeToRefs(store)

const themeOptions = [
  { value: Theme.System, label: 'System', icon: Computer },
  { value: Theme.Light, label: 'Light', icon: Sun },
  { value: Theme.Dark, label: 'Dark', icon: Moon }
];

const currentThemeIcon = computed(() => {
  switch (theme.value) {
    case Theme.Light: return Sun;
    case Theme.Dark: return Moon;
    default: return Computer;
  }
});

const handleThemeChange = (value: Event) => {
  const btn = value.currentTarget as HTMLButtonElement | null
  if (!btn) {
    return
  }
  const theme = btn.textContent?.trim().toLowerCase()
  if (theme) {
    store.updateTheme(theme as Theme)
  }
}
</script>
