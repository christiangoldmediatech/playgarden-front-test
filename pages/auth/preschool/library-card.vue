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
            Go Back
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
            <underlined-title text="Register with your library card number" />
          </div>

          <!-- CARD VALIDATION FORM -->
          <v-form
            ref="cardValidationForm"
            v-model="isValidForm"
            @submit.prevent="onSubmit"
          >
            <pg-text-field
              v-model="libraryCardNumber"
              label="Library card number"
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
              :disabled="loading"
              :loading="loading"
              type="submit"
              x-large
            >
              SUBMIT
            </v-btn>

            <p class="pg-mt-6 mt-md-4 pg-text-center md:pg-text-left">
              Your library card number (also called patron ID or account number) is the 14-digit number found on the library card, near the barcode.
            </p>

            <!-- Hidden until link is provided -->
            <p class="pg-hidden pg-mt-6 mt-md-4 pg-text-center md:pg-text-left">
              What is a library card number? <a class="!pg-text-[#F89838] pg-font-[800] !pg-underline" href="#">CLICK HERE</a>
            </p>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, useRouter } from '@nuxtjs/composition-api'
import { useAccessorHelper } from '@/composables'
import WrongLibraryIdDialog from '@/components/app/library/WrongLibraryIdDialog.vue'

export default defineComponent({
  name: 'LibraryCard',

  components: { WrongLibraryIdDialog },

  head() {
    return {
      title: 'Check your Library Card'
    }
  },

  setup() {
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
        'You must enter a valid 14 digit library card number'
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
        errorMessages.value = ['The library card number is not valid or does not exist']
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
