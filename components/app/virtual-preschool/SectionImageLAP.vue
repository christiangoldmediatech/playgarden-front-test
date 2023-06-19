<template>
  <v-hover v-slot="{ hover }">
    <div class="pg-max-h-[540px] pg-relative">
      <v-img
        :src="section.imageUrl"
        gradient="rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)"
        class="pg-rounded-md image-sizer"
        cover
        tile
        :height="small && $vuetify.breakpoint.smAndDown ? '300px' : small && $vuetify.breakpoint.smAndUp ? '300px' : '100%'"
        position="top center"
        @click="$emit('click', section)"
      >
        <!-- Section Button -->
        <div
          class="section-btn"
          :class="{
            translucent: hover
          }"
          :style="{
            backgroundColor: section.color
          }"
        >
          <div
            :style="{ color: `${section.textColor}` }"
            :class="{
              '!pg-text-[14px]': small && $vuetify.breakpoint.mdAndDown || $vuetify.breakpoint.width < 1350,
            }"
          >
            {{ section.title }}
          </div>
        </div>

        <div class="section-content" :class="{'pg-hidden': small && blocked || small && miniBlocked}">
          <!-- Start Playing Button -->
          <div class="pg-absolute pg-w-full pg-h-full">
            <v-img
              :data-test-id="`vp-section-${section.title}`"
              :style="
                small && $vuetify.breakpoint.mdAndDown
                  ? `top: 60%; height: 45%;`
                  : small && $vuetify.breakpoint.mdAndUp
                    ? `top: 30%; height: 50%;`
                    : `top: 35%; height: 35%;`
              "
              :width="small ? 150 : 200"
              contain
              class="section-start-playing pg-relative"
              :src="require('@/assets/svg/virtual-preschool/rainbow-circle.svg')"
            >
              <div
                class="pg-absolute pg-inset-0 pg-m-auto pg-text-center pg-font-bold pg-font-quick translate-text"
                :class="[small ? 'pg-text-[12px]' : $vuetify.breakpoint.width <= 1600 ? 'pg-text-[14px]' : 'pg-text-[22px]']"
                :style="{ color: small ? section.textColor : section.color }"
              >
                Start <br />
                Learning
              </div>
            </v-img>
          </div>

          <!-- Lady -->
          <img
            class="section-lady"
            :class="{ 'section-lady-medium': $vuetify.breakpoint.width < 1350 && $vuetify.breakpoint.width > 1000 , 'section-lady-small': small}"
            :src="section.teacherUrl"
          />

          <!-- Bubble -->
          <div class="section-bubble" />

          <!-- Bubble Text -->
          <div
            v-if="section.message"
            class="section-bubble-text pg-font-quick"
            :class="{
              'section-bubble-text-small':
                (small || medium) && $vuetify.breakpoint.mdAndUp,
              'section-bubble-text-mobile':
                (small || medium) && $vuetify.breakpoint.mdAndDown
            }"
            :style="{ color: small ? section.textColor : section.color }"
          >
            <v-btn icon class="my-n3 mx-n2">
              <v-icon
                :color="small ? section.textColor : section.color"
                :size="small ? 15 : 20"
                @click.stop="$emit('click:play', section)"
              >
                mdi-volume-high
              </v-icon>
            </v-btn>
            <span>
              {{ section.message }}
            </span>
            <img
              src="@/assets/svg/bubble-chat-arrow.svg"
              class="pg-absolute pg-right-10"
              :style="bubbleStyles"
              :class="[
                small && $vuetify.breakpoint.mdAndUp
                  ? 'pg-top-[-30px]'
                  : 'pg-bottom-[-30px]',
              ]"
            />
          </div>
        </div>

        <div
          v-if="miniBlocked"
          :class="[
            'pg-absolute',
            'pg-top-0',
            'pg-left-0',
            'pg-w-fit',
            'pg-h-fit',
            'pg-bg-[#000000]',
            'pg-bg-opacity-50',
          ]"
          class="pg-flex pg-items-center pg-gap-2 pg-py-4 pg-px-1 pg-rounded-br-lg"
        >
          <img src="@/assets/svg/lock.svg" width="30" height="30">
          <div class="pg-mt-[-8px]">
            <v-btn
              text
              color="accent"
              class="text-decoration-underline !pg-p-0 !pg-m-0"
              nuxt
              link
              small
              to="/app/payment/plan"
            >
              Upgrade your Plan
            </v-btn>
            <div class="pg-text-white pg-font-light pg-text-[10px]">
              Unlock the full section with
              <span class="pg-text-primary">Online Preschool Plan</span>
            </div>
          </div>
        </div>

        <div
          v-if="blocked"
          :class="[
            'pg-absolute',
            'pg-top-0',
            'pg-left-0',
            'pg-right-0',
            'pg-bottom-0',
            'pg-w-full',
            'pg-h-full',
            'd-flex',
            'flex-column',
            'align-center',
            'justify-center',
            'pg-bg-[#000000]',
            'pg-bg-opacity-50'
          ]"
        >
          <img src="@/assets/svg/lock.svg" width="40" height="40" class="mb-2">
          <span class="pg-text-white font-weight-bold">
            To unlock
          </span>
          <v-btn
            text
            color="accent"
            class="text-decoration-underline"
            nuxt
            link
            to="/app/payment/plan"
          >
            Upgrade your Plan
          </v-btn>
          <div class="pg-text-center pg-text-white pg-font-bold pg-text-sm">
            Unlock this section with <br>
            <span class="pg-text-primary">Play and Learn Live or Online Preschool</span>
          </div>
        </div>
      </v-img>
    </div>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import vuetify from '@gold-media-tech/pg-video-player/src/plugins/vuetify'

interface Section {
  imageUrl: string
  teacherUrl: string
  title: string
  message: string
  audio: string
  color: string
  textColor: string
}

export default defineComponent({
  name: 'SectionImage',
  methods: {
    vuetify() {
      return vuetify
    }
  },

  props: {
    section: {
      type: Object as PropType<Section>,
      default: () => ({})
    },
    small: {
      type: Boolean,
      default: false
    },
    medium: {
      type: Boolean,
      default: false
    },
    blocked: {
      type: Boolean,
      default: false
    },
    miniBlocked: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    bubbleStyles() {
      if (this.small && this.$vuetify.breakpoint.mdAndUp) {
        return 'transform: scaleY(-1)'
      }
      return ''
    }
  },

  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.section {
  padding: 0px;

  &-content {
    transition: 0.2s;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  &-bubble-text {
    font-weight: bold;
    font-size: 1rem;
    text-align: center;
    background-color: white;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    padding: 20px 10px;
    border-radius: 30px;
    width: 40%;
    position: absolute;
    bottom: 25%;
    right: 28%;
    z-index: 999;
  }

  &-bubble-text-small {
    padding: 10px;
    right: 30%;
    width: 60%;
    bottom: 4% !important;
    font-size: 0.7rem !important;
  }

  &-bubble-text-mobile {
    padding: 10px;
    right: 20%;
    width: 60%;
    bottom: 70% !important;
    font-size: 0.7rem !important;
  }

  &-bubble {
    width: 75%;
    background: red;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 15px;
    left: 30px;
    opacity: 0;
  }

  &-lady {
    height: 60%;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;

    &-small {
      height: 60% !important;
    }

    &-medium {
      right: -10px !important;
    }

  }

  &-start-playing {
    cursor: pointer;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &-btn {
    position: absolute;
    bottom: 10px;
    left: 10px;

    background: rgb(104, 196, 83);
    box-sizing: border-box;
    border-radius: 8px;
    cursor: pointer;

    & div {
      color: white;
      font-size: 18px;
      font-weight: 500;
      text-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);
      padding: 8px 12px;
    }
  }
}

.translucent {
  opacity: 0;
}

.translate-text {
  transform: translate(0%, 36%);
}

@media (max-width: 1300px) and (min-width: $breakpoint-sm) {
  .start-learning {
    font-size: 1rem !important;
    top: 1.2rem !important;
  }

  .section {
    &-bubble-text {
      bottom: 20%;
      right: 25%;
    }
    &-bubble-text-small {
      padding: 5px;
      right: 29%;
      width: 70% !important;
      bottom: 4% !important;
      font-size: 0.6rem !important;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .section {
    &-bubble-text {
      font-size: 1.3rem;
      width: 60%;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .section {
    padding: 12px;

    &-content {
      opacity: 1;
    }

    &-start-playing {
      bottom: 2rem;
    }
  }
}
</style>
