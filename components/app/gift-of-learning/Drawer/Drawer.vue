<template>
  <v-navigation-drawer :value="true" app width="315" temporary>
    <div class="pg-p-4">
      <!-- COLOR DASHES -->
      <img
        src="@/assets/svg/gift-of-learning/color-dashes.svg"
        class="pg-w-full pg-mt-4"
      >

      <!-- PG LOGO & CLOSE BUTTON -->
      <div class="pg-flex pg-items-center pg-justify-center pg-relative">
        <img
          src="@/assets/svg/gift-of-learning/playgarden-prep.svg"
          height="110"
        >

        <button class="pg-absolute pg-right-12">
          <v-icon color="green">
            mdi-close
          </v-icon>
        </button>
      </div>

      <!-- MENU ITEMS -->
      <div class="pg-mt-4">
        <div v-for="item in menuItems" :key="item.name">
          <a :href="item.href">
            <span
              :class="[
                'pg-inline-block',
                'pg-text-base',
                'pg-text-[#707070]',
                'pg-font-medium',
                'pg-py-2'
              ]"
            >
              {{ item.name }}
            </span>

            <div class="pg-h-[1px] pg-bg-pg-grey" />
          </a>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const menuItems = ref<{ name: string, href: string }[]>([
      { name: 'Online School', href: 'https://playgardenonline.com/' },
      { name: 'Kids Corner', href: '#' },
      { name: 'Play & Learn', href: '#' },
      { name: 'Learning Tools', href: '#' },
      { name: 'Well-being', href: '#' },
      { name: 'About us', href: 'https://playgardenonline.com/about-us-2/' },
      { name: 'Group Solutions', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Gifts', href: 'https://playgardenonline.com/gift-of-learning/' },
      { name: 'Contact', href: 'https://calendly.com/playgardenprep/playgarden-prep-online-phone-call' },
      { name: 'Email Us', href: 'mailto:hello@playgardenprep.com' }
    ])

    return { menuItems }
  }
})
</script>
