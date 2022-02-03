<template>
  <div>
    <large-image-content-dialog
      :fullscreen="false"
      :value="isEmailConflictModalVisible"
      :img="img"
      :is-closeable="true"
      :image-width="25"
      @close="closeModal"
    >
      <div class="md:pg-px-14">
        <div class="pg-text-center">
          <underlined-title
            text="UH-OH! LOOKS LIKE THIS EMAIL IS ALREADY IN USE."
            font-size="46px"
            font-size-mobile="24px"
            letter-spacing="4.8px"
            class="pg-text-pg-grey"
          />
        </div>

        <p class="pg-text-center pg-text-xl md:pg-text-3xl pg-text-pg-grey pg-mt-6">
          It appears that you have Register previously, please <span class="pg-text-accent pg-underline pg-font-bold pg-cursor-pointer" @click="handleHereClick">LOGIN</span> to continue the onboarding process, if you don't remember your Password you can get a new one <span class="pg-text-accent pg-underline pg-font-bold pg-cursor-pointer" @click="handleResetPasswordClick">HERE</span>.
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
    const { isEmailConflictModalVisible, setIsEmailConflictModalVisible } = useNotification({ store })
    const img = require('@/assets/png/child-magnifying-glass.png')

    function closeModal() {
      setIsEmailConflictModalVisible(false)
    }

    function handleHereClick() {
      setIsEmailConflictModalVisible(false)

      router.push({
        name: 'auth-login'
      })
    }

    function handleResetPasswordClick() {
      setIsEmailConflictModalVisible(false)

      router.push({
        name: 'auth-paasword-reset'
      })
    }

    return {
      img,
      isEmailConflictModalVisible,
      closeModal,
      handleHereClick,
      handleResetPasswordClick
    }
  }
})
</script>
