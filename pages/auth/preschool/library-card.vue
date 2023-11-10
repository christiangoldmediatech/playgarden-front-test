<template>
  <v-container :class="{ 'mt-n14': !$vuetify.breakpoint.mdAndUp }">
    <wrong-library-id-dialog v-model="viewDialog" />

    <v-row
      :class="{ 'mt-n4': !$vuetify.breakpoint.mdAndUp }"
      align="center"
      justify="center"
      no-gutters
      class="py-0 py-md-16"
    >
      <v-col cols="12" md="6">
        <!-- BACK BUTTON -->
        <v-row>
          <v-btn
            class="text-none mt-4 pl-md-n16 pg-top-[60px] pg-left-[10px]"
            color="accent"
            :href="frontendUrl"
            text
            exact
            :absolute="$vuetify.breakpoint.mdAndUp"
          >
            <v-icon class="mr-2" small left color="accent">
              mdi-less-than
            </v-icon>
            {{ $t('commonWords.return2') }}
          </v-btn>
        </v-row>

        <!-- CHILD IMAGE -->
        <div class="image">
          <v-img
            contain
            alt="Smiling Girl Picture"
            :src="require('@/assets/png/welcome-back.png')"
          />
        </div>
      </v-col>

      <v-col cols="12" md="6" class="px-0 px-md-4">
        <div class="pg-max-w-[544px] pg-mx-auto">
          <!-- FORM TITLE -->
          <div
            class="text-center text-md-left pg-my-5 mt-md-0 pg-mb-9 md:pg-mb-12"
          >
            <underlined-title :text="$t('register.libraryCard.header')" />
          </div>

          <!-- CARD VALIDATION FORM -->
          <v-form
            ref="cardValidationForm"
            v-model="isValidForm"
            @submit.prevent="onSubmit"
          >
            <pg-text-field
              v-model="libraryCardNumber"
              :label="$t('register.libraryCard.label')"
              clearable
              :disabled="loading"
              :loading="loading"
              :rules="[isValidLibraryCard]"
              :error-messages="errorMessages"
              maxlength="14"
              max
              solo
              type="text"
              class="custom-text-field"
            />

            <v-btn
              block
              color="#B2E68D"
              min-height="60"
              class="main-btn !pg-text-white !pg-normal-case"
              :disabled="loading || !isValidForm"
              :loading="loading"
              type="submit"
              x-large
            >
              {{ $t('register.libraryCard.submit') }}
            </v-btn>

            <p class="pg-mt-6 mt-md-4 pg-text-center md:pg-text-left">
              {{ $t('register.libraryCard.info') }}
            </p>

            <!-- Hidden until link is provided -->
            <p class="pg-hidden pg-mt-6 mt-md-4 pg-text-center md:pg-text-left">
              {{ $t('register.libraryCard.whatIsALibraryCard') }} <a class="!pg-text-[#F89838] pg-font-[800] !pg-underline" href="#">{{ $t('register.libraryCard.clickHere') }}</a>
            </p>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useMeta, useRouter } from '@nuxtjs/composition-api'
import { useAccessorHelper, useLanguageHelper } from '@/composables'
import WrongLibraryIdDialog from '@/components/app/library/WrongLibraryIdDialog.vue'

export default defineComponent({
  name: 'LibraryCard',

  components: { WrongLibraryIdDialog },

  head() {
    return {}
  },

  setup() {
    const language = useLanguageHelper()
    useMeta({
      title: `${language.t('register.libraryCard.title')}`
    })

    const store = useAccessorHelper().auth.signup
    const router = useRouter()
    const cardValidationForm = ref()
    const loading = ref(false)
    const isValidForm = ref(true)
    const libraryCardNumber = ref('')
    const viewDialog = ref(false)
    const errorMessages = ref<string[]>([])

    const isValidLibraryCard = (value: string) => {
      return (
        (!!value && value.length === 14) ||
        `${language.t('register.libraryCard.invalidCard')}`
      )
    }

    const onSubmit = async () => {
      try {
        if (!cardValidationForm.value) {
          return
        }
        loading.value = true
        cardValidationForm.value.validate()
        const result = await store.setLibraryCardNumber(libraryCardNumber.value)
        if (result) {
          return router.push({ name: 'auth-preschool-normal' })
        }
        errorMessages.value = [`${language.t('register.libraryCard.badCard')}` || '']
        setTimeout(() => { viewDialog.value = true }, 1000)
      } finally {
        loading.value = false
      }
    }

    return {
      viewDialog,
      frontendUrl: process.env.frontendUrl,
      cardValidationForm,
      loading,
      libraryCardNumber,
      isValidLibraryCard,
      isValidForm,
      errorMessages,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.image {
  margin-top: 48px;
  max-height: 500px;
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100%;
}

@media (max-width: $breakpoint-md) {
  .image {
    margin-top: 80px;
  }
}
@media (max-width: $breakpoint-sm) {
  .image {
    max-height: 250px;
  }
}
</style>
