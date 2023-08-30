<template>
  <div
    :class="[
      'pg-flex',
      'pg-flex-col',
      'pg-py-6',
      'pg-px-8',
      'pg-text-center',
      'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]',
      'pg-rounded-lg',
      'pg-bg-white',
      'pg-max-w-[500px]',
      'lg:pg-px-10',
      'lg:pg-w-[500px]',
      'lg:pg-h-[500px]'
    ]"
  >
    <!-- TITLE -->
    <div>
      <template>
        <NormalTitle
          :text="$t('register.cardInfo.title')"
          font-size="20px"
          font-size-mobile="17px"
        />
      </template>
    </div>

    <!-- CONTENT -->
    <div class="pg-text-base lg:pg-text-lg pg-text-black pg-mt-4">
      {{ $t('register.cardInfo.subtitle') }}
    </div>

    <!-- IMAGE -->
    <v-img :src="require('@/assets/png/register-child.png')" width="350" height="350" contain class="pg-block pg-mx-auto" />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CardInfo'
})
</script>

<style lang="scss" scoped>
$outerCircleSize: 250px;
$circleSizeDifference: 20px;

$ring2Size: calc(#{$outerCircleSize} - #{$circleSizeDifference});
$coreSize: calc(#{$outerCircleSize} - 2 * #{$circleSizeDifference});

.img-icon {
  max-height: 210px;
  max-width:  210px;
}
</style>
