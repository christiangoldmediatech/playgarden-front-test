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
    <div
      :class="[
        'pg-w-full',
        'pg-flex',
        'pg-justify-center'
      ]"
    >
      <img
        src="@/assets/png/login-card-child.png"
        class="child-login pg-mt-8 lg:pg-mt-10 pg-z-[4] pg-h-[150px] lg:pg-h-[250px]"
      >
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CardInfo'
})
</script>

<style lang="scss" scoped>
.child-login {
  -webkit-border-radius:  50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #b2e68d;
  border: 7px solid #b2e68d;
  outline: 7px solid #68c453;
}
</style>
