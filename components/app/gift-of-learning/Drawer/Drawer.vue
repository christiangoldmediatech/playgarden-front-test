<template>
  <v-navigation-drawer :value="value" app width="315" temporary @input="handleDrawer">
    <div>
      <!-- COLOR DASHES -->
      <img
        src="@/assets/svg/gift-of-learning/top-color-dashes.svg"
        class="pg-w-full pg-mt-4"
      >

      <!-- PG LOGO & CLOSE BUTTON -->
      <div class="pg-flex pg-items-center pg-justify-center pg-relative">
        <img
          src="@/assets/png/rainbow-logo.png"
          height="110"
        >

        <button class="pg-absolute pg-right-12" @click="handleDrawer(false)">
          <v-icon color="green">
            mdi-close
          </v-icon>
        </button>
      </div>

      <!-- MENU ITEMS -->
      <div class="pg-mt-4 pg-px-8">
        <div v-for="item in menuItems" :key="item.name">
          <a :href="item.href">
            <span
              :class="[
                'pg-inline-block',
                'pg-text-base',
                'pg-text-black',
                'pg-font-semibold',
                'pg-py-3'
              ]"
            >
              {{ item.name }}
            </span>

            <div class="pg-h-[1px] pg-bg-[#DDDDDD]" />
          </a>
        </div>
      </div>

      <div class="pg-flex pg-flex-col pg-items-center pg-w-full pg-my-12">
        <nuxt-link :to="{ name: 'auth-login' }">
          <button class="pg-text-base pg-font-semibold pg-text-[#707070]">
            Log In
          </button>
        </nuxt-link>

        <nuxt-link :to="{ name: 'auth-parent' }">
          <button
            :class="[
              'pg-mt-8',
              'pg-text-base',
              'pg-font-bold',
              'pg-text-white',
              'pg-h-10',
              'pg-w-[146px]',
              'pg-bg-accent',
              'pg-rounded-[4px]',
              'pg-shadow-[0px_5px_14px_rgba(0,0,0,0.25)]',
              'hover:pg-brightness-110',
              'md:pg-shadow-none'
            ]"
          >
            SIGN UP
          </button>
        </nuxt-link>

        <div class="pg-mt-8 pg-max-w-[200px] pg-text-center pg-font-medium">
          <span class="pg-font-bold pg-text-black">{{ $t('login.callNowTextPart1') }}</span> {{ $t('login.callNowTextPart2') }}
        </div>

        <div class="pg-mt-4 pg-font-medium">
          <img src="@/assets/svg/gift-of-learning/phone-call.svg" class="pg-mb-[-4px]"> <a href="tel:646-504-4716" class="!pg-text-[#707070]">646 504 4716</a>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const menuItems = ref<{ name: string, href: string }[]>([
      { name: 'Online School', href: 'https://playgardenonline.com/' },
      { name: 'Kids Corner', href: '#' },
      { name: 'Play & Learn', href: 'https://playgardenonline.com/play-and-learn/' },
      { name: 'Learning Tools', href: '#' },
      { name: 'Well-being', href: '#' },
      { name: 'About us', href: 'https://playgardenonline.com/about-us-2/' },
      { name: 'Group Solutions', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Gifts', href: 'https://playgardenonline.com/gift-of-learning/' },
      { name: 'Contact', href: 'https://calendly.com/playgardenprep/playgarden-prep-online-phone-call' },
      { name: 'Email Us', href: 'mailto:hello@playgardenprep.com' }
    ])

    function handleDrawer (state: boolean) {
      emit('input', state)
    }

    return { menuItems, handleDrawer }
  }
})
</script>
