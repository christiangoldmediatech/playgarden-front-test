<template>
  <PgDialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    width="1025"
    persistent
  >
    <div
      :class="[
        'pg-bg-white',
        'md:pg-flex',
        'md:pg-rounded-[56px]',
        'pg-relative',
        'pg-h-full',
        'pg-px-8',
        'md:pg-px-0',
        'md:pg-min-h-[435px]'
      ]"
    >
      <!-- Side image -->
      <img
        v-if="$vuetify.breakpoint.mdAndUp"
        :src="require('assets/png/promo-code-dialog.png')"
        alt="Kids playing while watching a Playgarden Online video"
        class="pg-rounded-[0_56px_56px_0] pg-w-[400px]"
      />

      <!-- Close button -->
      <img
        :src="require('assets/svg/pink-close-button.svg')"
        alt="Close button"
        class="pg-absolute pg-w-10 pg-right-6 pg-top-5 pg-cursor-pointer"
        @click.stop="close"
        @touchend="close"
      />

      <!-- Content -->
      <div
        :class="[
          'pg-relative',
          'pg-flex',
          'pg-flex-col',
          'pg-gap-2',
          'pg-justify-center',
          'pg-items-center',
          'pg-h-full',
          'md:pg-h-auto',
          'md:pg-w-1/2',
          'pg-mx-auto',
          'md:pg-mx-0',
          'md:pg-ml-10'
        ]"
      >
        <p class="pg-font-semibold pg-text-center pg-leading-6">
          Families love learning with Playgarden Online! With your PG
          membership, you will not only receive an elite NYC preschool
          experience, but parenting tips and well-being content for the whole
          family as well! Early childhood well-being is often overlooked, and we
          want to help. Enter this coupon code with your card information to
          receive your first 2 months after your 15 trial for FREE! That's 75+
          days of free learning!
        </p>

        <!-- Promo code -->
        <div
          :class="[
            'v2-font',
            'pg-bg-[#F7F7F7]',
            'pg-text-[#C399ED]',
            'pg-border',
            'pg-border-dashed',
            'pg-border-[#707070]',
            'pg-py-2',
            'pg-px-12',
            'pg-font-semibold',
            'pg-text-2xl',
            'md:pg-text-3xl',
            'pg-rounded-xl'
          ]"
        >
          EARLYLEARNING3
        </div>

        <!-- Actions -->
        <div class="pg-flex pg-flex-col pg-gap-3 pg-mt-4">
          <PgButton color="primary" @click="close">
            CONTINUE SIGNING UP
          </PgButton>

          <UnderlinedLink
            text="No thanks, I don't want a discount"
            @click="rejectOffer"
          />
        </div>

        <!-- Colored dashes -->
        <img
          src="@/assets/svg/gift-of-learning/bottom-color-dashes.svg"
          class="pg-absolute pg-bottom-0 md:pg-right-6 md:pg-mx-auto pg-w-full"
        />
      </div>
    </div>
  </PgDialog>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import PgButton from '@/components/pg/components/PgBtn.vue'
import UnderlinedLink from '@/components/shared/UnderlinedLink/UnderlinedLink.vue'

export default defineComponent({
  name: 'PromoCodeDialog',
  components: {
    UnderlinedLink,
    PgButton
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  emits: ['input', 'reject'],
  setup(props, { emit }) {
    const dialog = computed({
      get(): boolean {
        return props.value
      },
      set(value: boolean) {
        emit('input', value)
      }
    })

    function close() {
      dialog.value = false
    }

    function rejectOffer() {
      emit('reject')
      close()
    }

    return { dialog, close, rejectOffer }
  }
})
</script>
