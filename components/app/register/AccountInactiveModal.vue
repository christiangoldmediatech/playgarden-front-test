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
            text="UH-OH! LOOKS LIKE YOU ALREADY HAVE AN ACCOUNT WITH US AND NOW IT IS INACTIVE."
            font-size="46px"
            font-size-mobile="24px"
            letter-spacing="4.8px"
            class="pg-text-pg-grey"
          />
        </div>

        <p class="pg-text-center pg-text-xl md:pg-text-4xl pg-text-pg-grey pg-mt-6">
          Please click <span class="pg-text-accent pg-underline pg-font-bold pg-cursor-pointer" @click="handleHereClick">HERE TO LOGIN</span> and Activate your account again.
        </p>
        <p class="pg-text-center pg-text-base md:pg-text-base pg-text-pg-grey pg-mt-6">
          If you have forgotten your Password you can always get a new one <span class="pg-text-accent pg-underline pg-font-bold pg-cursor-pointer" @click="handleResetPasswordClick">HERE</span>
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

    function handleResetPasswordClick() {
      setIsAccountInactiveModalVisible(false)

      router.push({
        name: 'auth-forgot-password'
      })
    }

    return {
      img,
      isAccountInactiveModalVisible,
      closeModal,
      handleHereClick,
      handleResetPasswordClick
    }
  }
})
</script>
