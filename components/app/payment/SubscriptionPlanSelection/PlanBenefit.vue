<template>
  <div class="pg-flex pg-items-center pg-mb-3">
    <!-- Check -->
    <div class="pg-mr-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="20"
        fill="none"
      >
        <path
          :fill="color"
          d="M2.842 14.439c1.065 1.104 2.337 1.826 3.66 2.358.274.106.755.382.944.02.19-.424-.567-.552-.756-.636-3.332-1.445-4.724-3.866-4.655-6.224.12-4.418 4.5-6.84 8.52-6.882 5.945-.042 9.175 4.227 9.192 8.284.017 4.97-5.188 7.03-9.191 7.137-3.144.085-6.253-.999-7.714-4.057Zm7.697 4.63c4.552-.148 9.792-2.612 10.428-7.731.652-5.31-3.144-10.79-10.428-10.472C5.78 1.08.695 4.137.66 9.978c-.051 4.758 3.385 9.304 9.879 9.091Z"
        />
        <path
          :fill="color"
          d="M21.98 1.249c-5.343.127-9.311 5.182-11.562 11.193-1.116-1.975-1.872-3.207-2.474-3.823-.6-.616-1.116-.701-1.597-.17-.602.68-.275 1.317.137 1.805 2.629 3.165 2.766 4.503 3.333 4.992 1.185 1.02 1.855-1.827 2.027-2.273 1.718-4.29 4.501-8.368 8.298-9.26.945-.213 2.457.148 2.783-1.317.137-.808-.378-1.169-.945-1.147Z"
        />
      </svg>
    </div>

    <!-- Benefit -->
    <span
      :class="{ 'pg-text-sm': !large, 'pg-text-base': large }"
      v-html="benefit"
    ></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PlanBenefit',
  props: {
    benefit: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    large: {
      type: Boolean,
      default: false
    }
  }
})
</script>
