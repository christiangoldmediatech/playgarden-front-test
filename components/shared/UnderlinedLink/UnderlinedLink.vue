<template>
  <a v-bind="$attrs" v-on="$listeners">
    <span
      :class="[
        'pg-text-accent',
        'pg-font-bold',
        'pg-underline',
        'pg-text-sm',
        'pg-leading-tight'
      ]"
    >
      {{ text }}
    </span>
  </a>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import PgButton from '@/components/pg/components/PgBtn.vue'

export default defineComponent({
  name: 'UnderlinedLink',
  components: { PgButton },
  emits: ['click'],
  props: {
    text: {
      type: String,
      required: true
    }
  }
})
</script>
