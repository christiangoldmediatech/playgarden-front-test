<template>
  <pg-dialog
    v-model="viewModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="closeModal"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="closeModal"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="pa-0">
      <v-row no-gutters justify="center">
        <img
          class="cancellation-icon"
          src="@/assets/png/triste.png"
          alt="sad icon"
        />
      </v-row>
      <v-row no-gutters justify="center">
        <h1 class="cancellation-title pg-text-[#F89838]">
          Sorry to see you go!
        </h1>
      </v-row>
    </v-col>

    <v-col cols="12" class="px-10 py-0">
      <v-row no-gutters>
        <p class="final-message">
          Don't forget that the
          <span class="text-decoration-underline pg-text-[#71B2FF]"> Kids Corner</span>,
          <span class="text-decoration-underline pg-text-[#FCBF29]"> DIY</span>, and
          <span class="text-decoration-underline pg-text-[#F293BC]"> Community </span>
          sections are always free. <br />
          <span class="pg-text-[#68C453]">We hope you'll continue enjoying them!</span>
        </p>
      </v-row>
      <v-row no-gutters class="mt-4 mb-6">
        <p class="subtitle mb-0">
          <span class="subtitle-header">Tell us more: </span>
          We are sad to see you go, Before you go, can you share some feedback about your time with us?
        </p>
      </v-row>
    </v-col>

    <v-col cols="12" class="pa-0">
      <v-row no-gutters class="px-8">
        <v-textarea
          v-model="explanation"
          :required="explanationRequired"
          :placeholder="placeholder"
          solo
          dense
          no-resize
        ></v-textarea>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters class="">
        <v-col cols="4" class="px-4">
          <v-btn
            color="#97D2F8"
            class="w-100 white--text elevation-0"
            @click="goToKidsCorner"
          >
            KIDS CORNER
          </v-btn>
        </v-col>
        <v-col cols="4" class="px-4">
          <v-btn
            color="#FEC572"
            class="w-100 white--text elevation-0"
            @click="goToDyi"
          >
            DIY
          </v-btn>
        </v-col>
        <v-col cols="4" class="px-4">
          <v-btn
            color="#F6B7D2"
            class="w-100 white--text elevation-0"
            @click="goToCommunity"
          >
            COMMUNITY
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-center mt-4 pa-0 pb-5">
      <v-btn
        class="px-16 elevation-0 btn-text"
        color="#F89838"
        :loading="loading"
        text
        large
        :disabled="disabledBtn"
        @click="emitConfirmation(true, explanation)"
      >
        CANCEL ACCOUNT
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LastModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    explanationRequired: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input', 'confirmation'],
  setup(props, { emit }) {
    const explanation = ref('')
    const placeholder = computed(() => props.explanationRequired ? '(required field)' : '(Optional)')
    const disabledBtn = computed(() => {
      if (!props.explanationRequired) {
        return false
      }

      return !explanation.value
    })

    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const emitConfirmation = (confirmation: boolean, explanation: string) => {
      emit('confirmation', { confirmation, explanation })
    }

    const closeModal = () => {
      viewModal.value = false
    }

    const goToPage = (link: string) => {
      window.open(link, '_blanc')
    }

    const goToKidsCorner = () => {
      goToPage('https://kids.playgardenonline.com/')
    }

    const goToDyi = () => {
      goToPage('https://playgardenonline.com/do-it-yourself/')
    }

    const goToCommunity = () => {
      goToPage('https://community.playgardenprep.com/')
    }

    return {
      explanation,
      placeholder,
      disabledBtn,
      viewModal,
      closeModal,
      emitConfirmation,
      goToKidsCorner,
      goToDyi,
      goToCommunity
    }
  }
})

</script>

<style lang="scss" scoped>
@import '~/assets/scss/cancellation-flow.scss';
</style>
