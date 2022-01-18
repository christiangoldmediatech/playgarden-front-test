<template>
  <large-image-content-dialog :value="true" :img="childFace" @close="hideContactUsModal">
    <div>
      <underlined-title
        text="Contact Us"
        font-size="46px"
        font-size-mobile="22px"
        letter-spacing="4.8px"
      />
    </div>

    <div class="grey--text text--darken-2 caption text-md-body-2 my-3 my-md-6">
      We will be happy to answer your questions. Fill out the form and we will get back to you shortly.
    </div>

    <div>
      <validation-observer v-slot="{ invalid, passes }">
        <validation-provider
          v-slot="{ errors }"
          name="First Name"
          rules="required"
        >
          <pg-text-field
            v-model="form.firstName"
            label="First Name"
            solo-labeled
            :error-messages="errors"
          />
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="Last Name"
          rules="required"
        >
          <pg-text-field
            v-model="form.lastName"
            label="Last Name"
            solo-labeled
            :error-messages="errors"
          />
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="Email"
          rules="required|email"
        >
          <pg-text-field
            v-model="form.email"
            label="Email"
            solo-labeled
            :error-messages="errors"
          />
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="How can we help you?"
          rules="required"
        >
          <pg-textarea
            v-model="form.help"
            label="How can we help you?"
            solo-labeled
            :error-messages="errors"
          />
        </validation-provider>

        <div class="d-flex justify-center">
          <v-btn
            color="primary"
            class="text-none"
            width="200"
            large
            :disabled="invalid"
            :loading="loading"
            @click.stop="passes(handleSubmit)"
          >
            Send
          </v-btn>
        </div>
      </validation-observer>
    </div>
  </large-image-content-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { axios } from '@/utils'
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'ContactUsFormModal',

  components: {
    LargeImageContentDialog
  },

  setup (_, ctx) {
    const store = useStore<TypedStore>()
    const { hideContactUsModal, isContactUsModalVisible } = useGlobalModal({ store })

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      help: ''
    })
    const loading = ref(false)

    const handleSubmit = async () => {
      try {
        loading.value = true

        const formData = {
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          email: form.value.email,
          message: form.value.help
        }

        await axios({
          method: 'post',
          url: '/vbout/contact-us',
          data: formData
        })

        // @ts-ignore
        ctx.root.$snotify.success(
          'Information sent!'
        )

        hideContactUsModal()
      } catch {
        // @ts-ignore
        ctx.root.$snotify.error(
          'Could not sent form information. Please, try again later.'
        )
      } finally {
        loading.value = false
      }
    }

    const childFace = require('@/assets/webp/child-face.webp')

    return {
      childFace,
      form,
      handleSubmit,
      loading,
      hideContactUsModal,
      isContactUsModalVisible
    }
  }
})
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
