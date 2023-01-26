<template>
  <v-card
    height="270"
    width="250"
    elevation="0"
  >
    <v-card
      @click.stop="
        $nuxt.$emit('open-portfolio-overlay', {
          child: child,
          entityId: worksheet.id,
          entityType: 'WORKSHEET',
          image: worksheet.url,
          created: worksheet.updatedAt
        })
      "
    >
      <v-img :src="worksheet.url" height="200" contain />
    </v-card>
    <div class="mt-3">
      <div class="subheading">
        <span
          class="d-block text-center primary--text font-bold mb-1"
        >
          {{ `WORKSHEET ${worksheet.id}` }}
        </span>
      </div>
      <div class="subheading">
        <span
          class="d-block text-center font-bold upload-label-card"
        >
          UPLOADED DATE:
          {{ worksheet.updatedAt | formattedCreatedDate }}
        </span>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'UploadedCard',
  props: {
    worksheet: {
      type: Object,
      default: () => {}
    },
    child: {
      type: Object,
      default: () => {}
    }
  },
  filters: {
    formattedCreatedDate(val: string) {
      return val ? dayjs(val).format('MM/DD/YYYY') : null
    }
  }
})
</script>
