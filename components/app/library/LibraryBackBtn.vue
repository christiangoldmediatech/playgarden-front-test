<template>
  <v-btn
    class="library-back-btn"
    color="white"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <img class="mr-1 mr-lg-2" src="@/assets/svg/library/back-button-arrow.svg">
    {{ $t('commonWords.backButton') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LibraryBackBtn'
})
</script>

<style lang="scss" scoped>
.v-btn.library-back-btn {
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  letter-spacing: -0.28px;
  text-transform: none;
  color: #F89838;
  height: 20px;

  img {
    height: 10px;
    @media screen and (min-width: 1264px) {
      height: 24px;
    }
  }

  @media screen and (min-width: 1264px) {
    width: 170px !important;
    height: 48px !important;
    font-size: 28px !important;
    line-height: 42px !important;
    letter-spacing: -0.85px !important;
    border-radius: 8px !important;
  }
}
</style>
