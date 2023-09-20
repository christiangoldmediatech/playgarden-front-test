<template>
  <div
    :class="[
      'pg-flex',
      'sm:pg-flex-col',
      'pg-flex-row',
      'pg-py-6',
      'sm:pg-px-8',
      'pg-px-4',
      'pg-text-center',
      'pg-shadow-[0px_8px_24px_rgba(0,0,0,0.15)]',
      'pg-rounded-lg',
      'pg-bg-white',
      'pg-max-w-[500px]',
      'lg:pg-px-10',
      'lg:pg-w-[500px]',
    ]"
  >
    <div class="pg-flex pg-flex-col">
      <!-- TITLE -->
      <div>
        <template>
          <NormalTitle
            :text="title"
            font-size="20px"
            font-size-mobile="17px"
          />
        </template>
      </div>
      <!-- CONTENT -->
      <div class="pg-text-base lg:pg-text-lg pg-text-black pg-mt-4">
        Engaged children and proven outcomes!
      </div>
    </div>

    <!-- IMAGE -->
    <v-img
      :src="require('@/assets/png/register-child.png')"
      :width="$vuetify.breakpoint.xs ? 150 : 350"
      :height="$vuetify.breakpoint.xs ? 150 : 350"
      contain
      class="pg-block pg-mx-auto"
    />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CardInfo',
  props: {
    title: {
      type: String,
      default: 'The easiest and most effective way to give your child an immersive education outside of school!'
    }
  }
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
