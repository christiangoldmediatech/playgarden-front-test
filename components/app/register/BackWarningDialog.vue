<template>
  <v-dialog v-model="dialog" persistent width="600">
    <!-- CLOSE BUTTON -->
    <div class="pg-relative pg-w-full pg-h-9">
      <img
        :style="{
          left: $vuetify.breakpoint.xs ? '1px' : undefined,
          right: $vuetify.breakpoint.xs ? undefined : '1px'
        }"
        src="@/assets/svg/close-icon.svg"
        alt="Close icon"
        width="22px"
        class="pg-absolute pg-cursor-pointer"
        @click="dialog = false"
      >
    </div>

    <v-card class="pg-py-14">
      <v-card-text class="pg-mb-3 text-center">
        <p class="pg-text-[21px] pg-leading-8 pg-font-semibold">
          Going to the previous page will prompt you <br>
          to re-enter your payment information.
        </p>

        <underlined-title
          text="ARE YOU SURE DO YOU WANT TO GO BACK?"
          font-size="22px"
          letter-spacing="0px"
          no-autoresize-font
        />
      </v-card-text>

      <v-card-actions>
        <v-col cols="8" class="pg-m-auto">
          <v-row>
            <v-btn
              block
              dark
              color="green2"
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
  name: 'BackWarningDialog',
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

<style scoped>
::v-deep .v-dialog {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  box-shadow: none;
}
</style>
