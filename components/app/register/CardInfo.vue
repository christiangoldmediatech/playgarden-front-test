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
        <UnderlinedTitle
          text="Give your child an immersive educational experience at home!"
          font-size="24px"
          font-size-mobile="20px"
        />
      </template>
    </div>

    <!-- CONTENT -->
    <div class="pg-text-base lg:pg-text-xl pg-text-black pg-mt-4">
      Start learning now; cancel any time!
    </div>

    <!-- IMAGE -->
    <section class="position-circle mt-6">
      <div class="circle ring-1" />
      <div class="circle ring-2" />
      <div class="circle core d-flex flex-column align-center justify-center" />
    </section>
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

.position-circle {
  position: relative;
}

.img-icon {
  max-height: 210px;
  max-width:  210px;
}

.circle {
  width: $outerCircleSize;
  height: $outerCircleSize;
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.ring-1 {
  background-color: var(--v-primary-base);
}

.ring-2 {
  top: calc(#{$circleSizeDifference} / 2);
  width: $ring2Size;
  height: $ring2Size;
  background-color: var(--v-secondary-base);
}

.core {
  top: $circleSizeDifference;
  background:url(@/assets/png/login-card-child.png);
  width: $coreSize;
  height: $coreSize;
  background-color: white;
}
</style>
