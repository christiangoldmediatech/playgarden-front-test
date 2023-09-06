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
          :src="viewForm ? require('@/assets/png/happy.png') : require('@/assets/png/triste.png')"
          :alt="viewForm ? 'happy icon' : 'sad icon'"
        />
      </v-row>
      <v-row no-gutters justify="center">
        <h1
          v-if="!viewForm"
          class="wrong-library-font-family pg-text-[#F89838] pg-text-[25px] pg-font-[700] px-16 pg-text-center"
        >
          We are sorry but it seems that your library is not yet part of our community.
        </h1>
        <h1
          v-else
          class="wrong-library-font-family pg-text-[#EC85B3] pg-text-[25px] pg-font-[700] px-16 pg-text-center"
        >
          Add Library
        </h1>
      </v-row>
    </v-col>

    <v-col v-if="!viewForm" cols="12" class="px-10 py-0">
      <p class="wrong-library-font-family pg-text-[#707070] pg-text-[20px] pg-font-[700] pg-text-center">
        We are constantly adding new libraries. <br />
        Please confirm your library information and we'll put them at the top of the list so you can get <span class="pg-text-[#F89838]">FREE</span> access.
      </p>
    </v-col>

    <v-col v-else cols="12" class="pg-px-0 sm:pg-px-16 pg-py-0">
      <validation-observer v-slot="{ invalid, passes }">
        <v-form @submit.prevent="passes(onSubmit)">
          <v-col cols="12" class="py-0">
            <validation-provider v-slot="{ errors }" name="Name of Library" rules="required">
              <pg-text-field
                v-model="draft.libraryName"
                clearable
                class="custom-text-field"
                :error-messages="errors"
                color="#606060"
                placeholder="Name of Library"
                solo
                dense
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" class="py-0">
            <validation-provider v-slot="{ errors }" name="Library Address" rules="required">
              <pg-text-field
                v-model="draft.libraryAddress"
                clearable
                class="custom-text-field"
                :error-messages="errors"
                color="#606060"
                placeholder="Library Address"
                solo
                dense
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" class="py-0">
            <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
              <pg-text-field
                v-model="draft.userEmail"
                clearable
                class="custom-text-field"
                :error-messages="errors"
                color="#606060"
                placeholder="Your Email"
                solo
                dense
              />
            </validation-provider>
          </v-col>

          <v-col cols="12" class="mt-2">
            <v-row justify="center">
              <v-btn
                class="wrong-library-secondary-font-family white--text"
                color="#B2E68D"
                elevation="0"
                large
                :disabled="invalid"
                :loading="loading"
                type="submit"
              >
                ADD MY LIBRARY
              </v-btn>
            </v-row>
          </v-col>
        </v-form>
      </validation-observer>
    </v-col>

    <v-col cols="12">
      <v-row justify="center">
        <v-btn
          v-if="!viewForm"
          class="wrong-library-secondary-font-family white--text"
          color="#B2E68D"
          elevation="0"
          large
          @click="viewForm = true"
        >
          ADD MY LIBRARY
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
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import { useAccessorHelper, useToastHelper } from '@/composables'

const draftDefault = {
  libraryName: null,
  libraryAddress: null,
  userEmail: null
}

export default defineComponent({
  name: 'WrongLibraryIdDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const store = useAccessorHelper().auth.signup
    const toast = useToastHelper()
    const viewForm = ref(false)
    const loading = ref(false)
    const dialog = computed({
      get(): boolean {
        return props.value
      },
      set(value: boolean) {
        emit('input', value)
      }
    })

    const draft = ref({ ...draftDefault })

    const closeDialog = () => {
      dialog.value = false
      viewForm.value = false
      draft.value = { ...draftDefault }
    }

    const onSubmit = async () => {
      loading.value = true

      try {
        await store.requestToAddLibrary(draft.value as any)
      } catch (error) {
        toast.error('Could not send request to add library')
      } finally {
        loading.value = false
      }

      closeDialog()
    }

    return {
      dialog,
      loading,
      viewForm,
      draft,
      closeDialog,
      onSubmit
    }
  }
})

</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.wrong-library-font-family {
  font-family: 'Quicksand';
}

.wrong-library-secondary-font-family {
  font-family: 'Poppins';
}
</style>
