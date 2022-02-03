<template>
  <div>
    <large-image-content-dialog
      :fullscreen="false"
      :value="isAccountInactiveModalVisible"
      :img="img"
      :is-closeable="true"
      :image-width="25"
      @close="closeModal"
    >
      <div class="md:pg-px-16">
        <div class="pg-text-center">
          <underlined-title
            text="UH-OH! LOOKS LIKE YOUR ACCOUNT IS INACTIVE."
            font-size="46px"
            font-size-mobile="24px"
            letter-spacing="4.8px"
            class="pg-text-pg-grey"
          />
        </div>

        <p class="pg-text-center pg-text-xl md:pg-text-4xl pg-text-pg-grey pg-mt-6">
          Please click <span class="pg-text-accent pg-underline pg-font-bold" @click="handleHereClick">HERE</span> to Activate your account
        </p>
      </div>
    </large-image-content-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore, useRouter } from '@nuxtjs/composition-api'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { TypedStore } from '@/models'
import { useNotification } from '@/composables'

export default defineComponent({
  name: 'EmailConflictModal',

  components: {
    LargeImageContentDialog
  },

  setup() {
    const store = useStore<TypedStore>()
    const router = useRouter()
    const { isAccountInactiveModalVisible, setIsAccountInactiveModalVisible } = useNotification({ store })
    const img = require('@/assets/png/child-magnifying-glass.png')

    function closeModal() {
      setIsAccountInactiveModalVisible(false)
    }

    function handleHereClick() {
      setIsAccountInactiveModalVisible(false)

      router.push({
        name: 'auth-login'
      })
    }

    return {
      img,
      isAccountInactiveModalVisible,
      closeModal,
      handleHereClick
    }
  }
})
</script>
