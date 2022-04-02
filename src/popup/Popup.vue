<script setup lang="ts">
import { storageDemo } from '~/logic/storage'
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <div>Popup</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>
