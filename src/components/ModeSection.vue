<template>
  <div class="mt-8">
    <h2 class="text-2xl font-semibold">{{ i18n.t('optionItemMode') }}</h2>
    <p class="text-base-content/70 text-sm mt-2">{{ i18n.t("optionDescriptionMode") }}</p>

    <div class="label w-full max-w-ws mt-4">
      <span class="label-text">{{ i18n.t("optionLabelMode") }}</span>
      <select class="select select-bordered capitalize hover:bg-base-200/80 transition-colors w-32" v-model="mode">
        <option v-for="m in modes">
          {{ m }}
        </option>
      </select>
    </div>

    <div class="form-control mt-4">
      <div class="label">
        <span class="label-text">{{ i18n.t("optionLabelEnableAutoClose") }}</span>
        <input type="checkbox" class="toggle toggle-success" v-model="enableAutoClose" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Mode } from "@/utils/storage"
import { useOptionsStore } from "@/utils/store";
import { storeToRefs } from "pinia";

const store = useOptionsStore();
const { mode, enableAutoClose } = storeToRefs(store);

watch(mode, async (value, oldValue) => {
  if (value !== oldValue) {
    await store.updateMode(value)
  }
})

watch(enableAutoClose, async (value, oldValue) => {
  if (value !== oldValue) {
    await store.updateEnableAutoClose(value)
  }
})

const modes = ref([Mode.Tab, Mode.Window]);
</script>

<style scoped></style>
