<template>
  <div class="mt-2">
    <h2 class="text-2xl font-semibold">{{ i18n.t("optionItemPrefix") }}</h2>
    <p class="text-base-content/70 text-sm mt-2">{{ i18n.t("optionDescriptionPrefix") }}</p>

    <div class="form-control w-full max-w-ws mt-4">
      <div class="label">
        <span class="label-text">{{ i18n.t("optionLabelEnablePrefix") }}</span>
        <input type="checkbox" class="toggle toggle-success" v-model="enablePrefix" />
      </div>
    </div>

    <Transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0">
      <div v-if="enablePrefix">
        <label class="label w-full max-w-ws mt-2">
          <span class="label-text">{{ i18n.t("optionLabelPrefixWord") }}</span>
          <input type="text" class="input input-bordered max-w-72 grow" v-model.lazy="prefixWord"
            :disabled="!enablePrefix" />
        </label>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useOptionsStore } from "@/utils/store";
import { storeToRefs } from "pinia";

const store = useOptionsStore()
const { enablePrefix, prefixWord } = storeToRefs(store)

watch(enablePrefix, async (value, oldValue) => {
  if (value !== oldValue) {
    await store.updateEnablePrefix(value)
  }
})

watch(prefixWord, async (value, oldValue) => {
  if (value !== oldValue) {
    await store.updatePrefixWord(value)
  }
})
</script>

<style scoped></style>
