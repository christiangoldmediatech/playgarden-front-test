<template>
  <v-row align="center" class="fill-height mb-4">
    <!-- CHILDREN IMAGE -->
    <v-col cols="12" md="5">
      <v-img
        :src="require('@/assets/png/playdates/willBeBackPlaydate.png')"
        contain
        alt="Smiling Girl Picture"
        class="pg-max-h-[450px]"
      />
    </v-col>

    <!-- INFORMATION PANEL -->
    <v-col cols="12" md="7">
      <underlined-title
        text="Playdates are back for Premium and Premium+ members!"
        font-size="36px"
      />

      <p class="mt-8 body-1">
        Play and learn with friends in our Playdate class! Come for fun activities such as spin-the-wheel, Play-doh art, stories and sharing time!
        Playdates are limited to 8 little ones per session, to promote social interaction.
        You can reserve a spot by signing up for one of our monthly plans!
        If you'd like to end your trial early to gain access to Playdates, email <a href="mailto:hello@playgardenprep.com">hello@playgardenprep.com</a>
      </p>

      <!-- CTA -->
      <v-row no-gutters class="text-center text-md-left">
        <!-- CONFIRM YOUR PLAN NOW -->
        <v-col v-if="canConfirmPlan" cols="12" md="auto" class="my-4">
          <v-btn color="accent" class="text-none" width="250" @click="handleUpgradeNow">
            Confirm Your Plan Now
          </v-btn>
        </v-col>

        <!-- CONTACT US -->
        <v-col cols="12" md="auto" class="mx-0 mx-md-4 align-self-center font-weight-bold">
          <span class="grey--text">Need help? </span>
          <span class="text-decoration-underline" @click="handleContactUs">
            <a class="accent--text">Contact us</a>
          </span>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'
import { defineComponent, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const router = useRouter()
    const store = useStore<TypedStore>()
    const { showContactUsModal, canConfirmPlan } = useGlobalModal({ store })

    const handleUpgradeNow = () => {
      router.push({ name: 'app-payment-plan' })
    }

    return {
      canConfirmPlan,
      handleUpgradeNow,
      handleContactUs: showContactUsModal
    }
  }
})
</script>

<style lang="scss" scoped>
.pg-max-h-\[450px\] {
  max-height: 450px;
}
</style>
