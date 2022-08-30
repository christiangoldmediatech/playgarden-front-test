<template>
  <div class="pg-flex pg-justify-start pg-items-start pg-mb-3">
    <v-img
      :src="require(`@/assets/svg/plans/check-${index}.svg`)"
      alt="Bullet point"
      max-width="20"
      class="pg-mr-2"
    />

    <span class="pg-leading-5 pg-text-sm">
      {{ benefit }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PlanBenefit',
  props: {
    index: {
      type: Number,
      required: true
    },
    benefit: {
      type: String,
      required: true
    }
  }
})
</script>
