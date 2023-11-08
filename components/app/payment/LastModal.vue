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
          {{ $t('modals.last.title') }}
        </h1>
      </v-row>
    </v-col>

    <v-col cols="12" class="px-10 py-0">
      <v-row no-gutters>
        <p class="final-message">
          {{ $t('modals.last.message1') }}
          <span class="text-decoration-underline pg-text-[#71B2FF]"> {{ $t('modals.last.kidsCorner') }}</span>,
          <span class="text-decoration-underline pg-text-[#FCBF29]"> {{ $t('modals.last.diy') }}</span>{{ $t('modals.last.message2') }}
          <span class="text-decoration-underline pg-text-[#F293BC]"> {{ $t('modals.last.community') }} </span>
          {{ $t('modals.last.message3') }} <br />
          <span class="pg-text-[#68C453]">{{ $t('modals.last.message4') }}</span>
        </p>
      </v-row>
      <v-row no-gutters class="mt-4 mb-6">
        <p class="subtitle mb-0">
          <span class="subtitle-header">{{ $t('modals.last.secondMessage1') }} </span>
          {{ $t('modals.last.secondMessage2') }}
        </p>
      </v-row>
    </v-col>

    <v-col cols="12" class="pa-0">
      <v-row no-gutters class="px-8">
        <v-textarea
          v-model="explanation"
          class="custom-text-field"
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
        <v-col cols="12" sm="4" class="px-4 my-2">
          <v-btn
            color="#97D2F8"
            class="kids-corner-btn w-100 white--text elevation-0"
            @click="goToKidsCorner"
          >
            <template v-if="$i18n.locale === 'es'">
              <div class="pg-max-w-full pg-whitespace-normal">
                {{ $t('modals.last.kidsCorner').toUpperCase() }}
              </div>
            </template>
            <template v-else>
              {{ $t('modals.last.kidsCorner').toUpperCase() }}
            </template>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="4" class="px-4 my-2">
          <v-btn
            color="#FEC572"
            class="w-100 white--text elevation-0"
            @click="goToDyi"
          >
            {{ $t('modals.last.diy').toUpperCase() }}
          </v-btn>
        </v-col>
        <v-col cols="12" sm="4" class="px-4 my-2">
          <v-btn
            color="#F6B7D2"
            class="w-100 white--text elevation-0"
            @click="goToCommunity"
          >
            {{ $t('modals.last.community').toUpperCase() }}
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
        {{ $t('modals.last.cancel') }}
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { useLanguageHelper } from '@/composables'
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
    const language = useLanguageHelper()
    const explanation = ref('')
    const placeholder = computed(() => props.explanationRequired ? language.t('modals.textPlaceholder') : language.t('modals.textPlaceholderOptional'))
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
@import '~/assets/scss/app.scss';
@import '~/assets/scss/cancellation-flow.scss';

::v-deep {
  .v-btn.kids-corner-btn {
    .v-btn__content {
      max-width: 100%;
    }
  }
}
</style>
