<template>
  <v-dialog v-model="dialog" persistent width="580">
    <v-card class="pg-relative pg-p-6">
      <div class="pg-flex pg-justify-end">
        <v-btn icon @click="dialog = false">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </div>

      <v-card-title class="pg-mb-3 text-center">
        <p>
          Going to the previous page will prompt you to re-enter your payment
          information
        </p>
      </v-card-title>

      <v-card-subtitle class="pg-mb-2 text-center">
        <underlined-title
          text="ARE YOU SURE DO YOU WANT TO GO BACK?"
          font-size="18px"
        />
      </v-card-subtitle>

      <v-card-actions>
        <v-col cols="9" class="pg-m-auto">
          <v-row>
            <v-btn
              block
              color="primary"
              class="pg-mb-4"
              nuxt
              @click="goBack"
            >
              Yes, take me back
            </v-btn>
          </v-row>
          <v-row>
            <a
              class="!pg-text-accent !pg-underline pg-uppercase pg-font-semibold pg-m-auto"
              @click="dialog = false"
            >
              No, stay on this page
            </a>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = computed({
      get(): boolean {
        return props.value
      },
      set(value: boolean) {
        emit('input', value)
      }
    })

    const router = useRouter()
    const goBack = () => {
      router.push({
        name: 'app-payment',
        query: { process: 'signup', step: '2' }
      })

      dialog.value = false
    }

    return { dialog, goBack }
  }
})
</script>
