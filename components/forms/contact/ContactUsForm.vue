<template>
  <large-image-content-dialog :value="value" :img="childFace" @close="$emit('close-modal')">
    <underlined-title
      text="Contact Us"
      font-size="46px"
      font-size-mobile="22px"
      letter-spacing="4.8px"
    />

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
import { defineComponent, ref } from '@nuxtjs/composition-api'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { axios } from '@/utils'

export default defineComponent({
  name: 'ContactUsForm',

  components: {
    LargeImageContentDialog
  },

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  setup (_, ctx) {
    const childFace = require('@/assets/webp/child-face.webp')
    const loading = ref(false)

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      help: ''
    })

    const handleSubmit = async () => {
      try {
        loading.value = true

        const formData = new FormData()
        formData.append('vbout_EmbedForm[field][224784]', form.value.firstName)
        formData.append('vbout_EmbedForm[field][224785]', form.value.lastName)
        formData.append('vbout_EmbedForm[field][224786]', form.value.email)
        formData.append('vbout_EmbedForm[field][268014]', form.value.help)

        await axios({
          method: 'post',
          url: 'https://www.vbt.io/embedcode/submit/32765/?_format=page',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // @ts-ignore
        ctx.root.$snotify.success(
          'Export is complete and will be sent to your email.'
        )

        ctx.emit('close-modal')
      } catch {
        // @ts-ignore
        ctx.root.$snotify.error(
          'Could not sent form information. Please, try again later.'
        )
      } finally {
        loading.value = false
      }
    }

    return {
      childFace,
      form,
      handleSubmit,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
