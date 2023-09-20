<template>
  <v-dialog
    v-model="dialog"
    class="!pg-z-[10000]"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl"
    persistent
    max-width="700px"
    @click:outside="closeDialog"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="closeDialog"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="pa-0 mb-7">
      <v-row no-gutters justify="center">
        <img
          class="pg-h-[120px] pg-object-contain"
          src="@/assets/png/happy.png"
          alt="happy icon"
        />
      </v-row>
    </v-col>

    <v-col cols="12" class="px-10 py-0">
      <p class="pg-font-quick pg-text-[#707070] pg-text-[20px] pg-font-[500] pg-text-center">
        We need your address in order to send you the Playgarden backpack and work books.
      </p>
    </v-col>

    <v-col cols="12">
      <v-row justify="center">
        <v-btn
          class="white--text"
          color="#B2E68D"
          elevation="0"
          large
          @click="closeDialog"
        >
          {{ btnText }}
        </v-btn>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-row justify="center">
        <v-btn
          class="mb-6 !pg-underline"
          color="#FFAB37"
          text
          large
          @click="skipStep"
        >
          REMIND ME LATER
        </v-btn>
      </v-row>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-16"
    />
  </v-dialog>
</template>

<script lang="ts">
import { useVuetifyHelper } from '@/composables'
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'SkipAddressModal',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  emits: ['input', 'click:skip'],

  setup(props, { emit }) {
    const vuetify = useVuetifyHelper()
    const dialog = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('input', val)
      }
    })

    const btnText = computed(() => {
      return vuetify.breakpoint.mobile ? 'GO BACK' : 'GO BACK AND ADD MY ADDRESS'
    })

    const closeDialog = () => {
      dialog.value = false
    }

    const skipStep = () => {
      emit('click:skip')
      closeDialog()
    }

    return {
      dialog,
      btnText,
      skipStep,
      closeDialog
    }
  }
})
</script>
