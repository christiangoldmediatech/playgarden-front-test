<template>
  <large-image-content-dialog
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
      <nuxt-link
        class="accent--text font-weight-bold text-decoration-underline"
        :to="{ name: 'app-account-index' }"
      >
        HERE
      </nuxt-link>.
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
import { mapState } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'

export default {
  name: 'ShippingAddressModal',

  components: {
    LargeImageContentDialog
  },

  data: () => ({
    girlFamilyTreeImg: require('@/assets/png/girl-family-tree.png')
  }),

  computed: {
    ...mapState('notifications', ['isShippingModalVisible']),

    isMobile(): boolean {
      return this.$vuetify.breakpoint.smAndDown
    }
  },

  methods: {
    dontShowAgain(): void {
      this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', false)
      this.$store.dispatch('notifications/showShippingAddressModalAgain', false)
    },

    closeModal(): void {
      this.$store.commit('notifications/SET_IS_SHIPPING_MODAL_VISIBLE', false)
      this.$store.dispatch('notifications/showShippingAddressModalAgain', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-text-\[17px\] {
  font-size: 17px;
}

@media(min-width: $breakpoint-md) {
  .md\:pg-text-\[26px\] {
    font-size: 26px;
  }
}
</style>
