<template>
  <div class="w-[500px]" :data-theme="store.theme">
    <div class="card pb-3">
      <div class="card-body gap-0">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Settings class="w-8 h-8" />
            <h1 class="text-4xl font-bold">{{ i18n.t("optionTitle") }}</h1>
          </div>
          <ThemeSwitcher />
        </div>

        <ModeSection />
        <div class="divider" />
        <PrefixSection />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Settings } from "lucide-vue-next";
import ModeSection from "@/components/ModeSection.vue";
import PrefixSection from "@/components/PrefixSection.vue";
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";

const store = useOptionsStore();
</script>
