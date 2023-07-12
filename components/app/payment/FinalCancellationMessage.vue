<template>
  <v-col cols="12">
    <v-row no-gutters>
      <p class="final-message">
        {{ $t('modals.last.message1') }}
        <span class="text-decoration-underline pg-text-[#71B2FF]"> {{ $t('modals.last.kidsCorner') }}</span>,
        <span class="text-decoration-underline pg-text-[#FCBF29]"> {{ $t('modals.last.diy') }}</span>{{ $t('modals.last.message2') }}
        <span class="text-decoration-underline pg-text-[#F293BC]"> {{ $t('modals.last.community') }} </span>
        {{ $t('modals.last.message3') }} <br />
        <span class="pg-text-[#68C453]">{{ $t('modals.last.message4') }}</span>
      </p>
    </v-row>
    <v-row no-gutters class="mt-5 mb-10">
      <v-col cols="4" class="px-4">
        <v-btn
          color="#97D2F8"
          class="w-100 white--text elevation-0"
          @click="goToKidsCorner"
        >
          {{ $t('modals.last.kidsCorner').toUpperCase() }}
        </v-btn>
      </v-col>
      <v-col cols="4" class="px-4">
        <v-btn
          color="#FEC572"
          class="w-100 white--text elevation-0"
          @click="goToDyi"
        >
          {{ $t('modals.last.diy').toUpperCase() }}
        </v-btn>
      </v-col>
      <v-col cols="4" class="px-4">
        <v-btn
          color="#F6B7D2"
          class="w-100 white--text elevation-0"
          @click="goToCommunity"
        >
          {{ $t('modals.last.community').toUpperCase() }}
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
