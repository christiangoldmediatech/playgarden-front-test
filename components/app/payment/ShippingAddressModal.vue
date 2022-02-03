<template>
  <large-image-content-dialog
    :image-height="$vuetify.breakpoint.md ? '608px' : '510px'"
    :value="isShippingModalVisible"
    :img="girlFamilyTreeImg"
    :fullscreen="false"
    @close="dontShowAgain"
  >
    <div class="text-center">
      <underlined-title
        text="We want to send you a Playgarden Prep workbook!"
        font-size="46px"
        font-size-mobile="20px"
        letter-spacing="4.8px"
      />
    </div>

    <div class="grey--text text--darken-2 mt-4 mb-3 my-md-6 text-center pg-text-[17px] md:pg-text-[26px]">
      In order to receive your FREE A-D workbook, please provide your shipping
      address by going to your Accounts Page
      <span class="accent--text text-decoration-underline pg-cursor-pointer" @click="goToProfile">HERE</span>
    </div>

    <div class="d-flex flex-column justify-center align-center">
      <v-btn
        color="secondary"
        class="my-3"
        :x-large="!isMobile"
        :width="isMobile ? '90%' : '500px'"
        @click="closeModal"
      >
        REMIND ME LATER
      </v-btn>

      <v-btn
        color="accent"
        text
        class="mb-3 text-decoration-underline"
        :x-large="!isMobile"
        :width="isMobile ? '90%' : '500px'"
        @click="dontShowAgain"
      >
        DON'T SHOW ME THIS AGAIN
      </v-btn>

      <div class="grey--text text--darken-2 caption text-md-body-1 text-center">
        *Limited to 1 introductory learning package per family, in the
        territorial US and Canada only.
      </div>
    </div>
  </large-image-content-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, useStore, useRouter } from '@nuxtjs/composition-api'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { useNotification, useVuetifyHelper } from '@/composables'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'ShippingAddressModal',

  components: {
    LargeImageContentDialog
  },

  data: () => ({
    girlFamilyTreeImg: require('@/assets/png/girl-family-tree.png')
  }),

  setup() {
    const router = useRouter()
    const store = useStore<TypedStore>()
    const vuetify = useVuetifyHelper()
    const Notification = useNotification({ store })
    const isMobile = computed(() => vuetify.breakpoint.smAndDown)
    const isShippingModalVisible = computed(() => store.state.notifications.isShippingModalVisible)

    function goToProfile() {
      router.push({ name: 'app-account-index' })
      closeModal()
    }

    function closeModal() {
      Notification.setIsShippingModalVisible(false)
      Notification.showShippinAddressModalAgain(true)
    }

    function dontShowAgain() {
      Notification.setIsShippingModalVisible(false)
      Notification.showShippinAddressModalAgain(false)
    }

    return {
      isMobile,
      isShippingModalVisible,
      goToProfile,
      closeModal,
      dontShowAgain
    }
  }
})
</script>

<style lang="scss" scoped>
.pg-cursor-pointer {
  cursor: pointer;
}

.pg-text-\[17px\] {
  font-size: 17px;
}

@media(min-width: $breakpoint-sm) {
  .md\:pg-text-\[26px\] {
    font-size: 26px;
  }
}
</style>
