<template>
  <v-col cols="12">
    <v-row no-gutters>
      <p class="final-message">
        Don't forget that the
        <span class="text-decoration-underline pg-text-[#71B2FF]"> Kids Corner</span>,
        <span class="text-decoration-underline pg-text-[#FCBF29]"> DIY</span>, and
        <span class="text-decoration-underline pg-text-[#F293BC]"> Community </span>
        sections are always free. <br />
        <span class="pg-text-[#68C453]">We hope you'll continue enjoying them!</span>
      </p>
    </v-row>
    <v-row no-gutters class="mt-5 mb-10">
      <v-col cols="4" class="px-4">
        <v-btn
          color="#97D2F8"
          class="w-100 white--text elevation-0"
          @click="goToKidsCorner"
        >
          KIDS CORNER
        </v-btn>
      </v-col>
      <v-col cols="4" class="px-4">
        <v-btn
          color="#FEC572"
          class="w-100 white--text elevation-0"
          @click="goToDyi"
        >
          DIY
        </v-btn>
      </v-col>
      <v-col cols="4" class="px-4">
        <v-btn
          color="#F6B7D2"
          class="w-100 white--text elevation-0"
          @click="goToCommunity"
        >
          COMMUNITY
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'FinalCancellationMessage',
  setup() {
    const goToPage = (link: string) => {
      window.open(link, '_blanc')
    }

    const goToKidsCorner = () => {
      goToPage('https://kids.playgardenonline.com/')
    }

    const goToDyi = () => {
      goToPage('https://playgardenonline.com/do-it-yourself/')
    }

    const goToCommunity = () => {
      goToPage('https://community.playgardenprep.com/')
    }

    return {
      goToKidsCorner,
      goToDyi,
      goToCommunity
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/cancellation-flow.scss';
</style>
