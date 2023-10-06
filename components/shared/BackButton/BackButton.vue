<template>
  <button
    :class="[
      'pg-text-accent',
      'pg-font-semibold',
      'pg-text-lg',
    ]"
    @click="$emit('click')"
  >
    <v-icon color="accent" size="32">
      mdi-chevron-left
    </v-icon>

    {{ $t('commonWords.backButton') }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BackButton',

  emits: ['click']
})
</script>
