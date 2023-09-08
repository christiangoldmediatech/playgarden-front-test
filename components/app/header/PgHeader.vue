<template>
  <v-app-bar
    flat
    :height="appBarHeight"
    :class="{ 'd-none mt-n16': scrollDown }"
    class="pg-header"
    app
  >
    <v-row no-gutters>
      <!-- Hamburguer Menu -->
      <v-btn
        class="d-inline d-md-none pg-header-menu-btn"
        icon
        :ripple="false"
        @click="handleSidebarToggle"
      >
        <v-icon large class="primary--text">
          mdi-menu
        </v-icon>
      </v-btn>

      <!-- Children Select  -->
      <v-col
        cols="12"
        sm="6"
        md="3"
        order="2"
        order-md="1"
        class="d-flex align-center justify-center"
      >
        <!-- <div>

      </div> -->
        <v-btn
          v-if="isCurrentChildsBirthday"
          class="childBirthdayBtn mr-3"
          color="white"
          @click="handleClickOnBirthdayIcon"
        >
          <img
            :src="require('@/assets/svg/Contexts/Birthday/birthday-hat.svg')"
            width="60"
          />
        </v-btn>
        <div class="child-select mt-4 mt-md-0">
          <child-select
            v-if="childId"
            v-model="childId"
            class="mb-n3 mb-md-n7"
          />
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="6"
        md="6"
        order="1"
        order-md="2"
        class="d-flex flex-column justify-center align-center"
      >
        <v-row no-gutters class="text-center">
          <!-- PlaygardenPrep Logo -->
          <v-col cols="12">
            <img
              v-if="!hasPlayAndLearnPlan && !hasPlayAndLearnPlanLivePlan"
              alt="Playarden Prep Online Logo"
              :height="appBarLogoSize"
              :src="require('@/assets/svg/rainbow.svg')"
            />
            <img
              v-else-if="hasPlayAndLearnPlan && !hasPlayAndLearnPlanLivePlan"
              alt="Playarden Prep Online Logo"
              :height="appBarLogoSizeLearnPlay"
              :src="require('@/assets/png/logo-PlayandLearn.svg')"
            />
            <img
              v-else-if="hasPlayAndLearnPlanLivePlan"
              alt="Playarden Prep Online Logo"
              :height="appBarLogoSizeLearnPlay"
              :src="require('@/assets/png/logo-PG-PAL-live.svg')"
            />
          </v-col>

          <!-- Toolbar Title -->
          <v-col v-if="!hasPlayAndLearnPlan" cols="12">
            <normal-title
              text="Welcome to School"
              :font-size="appBarTitleSize"
              :font-size-mobile="appBarTitleSize"
              font-family="'Quicksand', sans-serif"
              color="#606060"
            />
          </v-col>

          <!-- Toolbar Description -->
          <v-col>
            <div class="text-body-1 text-md-h6 !pg-font-light">
              Thank you for learning with us today!
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col md="3" order="3" class="d-none d-md-flex justify-end align-center">
        <!-- Profile Button -->
        <div class="text-center mx-4">
          <img
            v-if="isUserLoggedIn && !isUserInSignupProcess"
            height="45"
            class="clickable"
            :src="require('@/assets/svg/account-profile.svg')"
            @click="$router.push({ name: 'app-account-index' })"
          />
          <div class="text-caption">
            Profile
          </div>
        </div>

        <!-- Help Button -->
        <template v-if="isUserLoggedIn && !isUserInSignupProcess">
          <v-menu open-on-hover offset-y offset-overflow>
            <template v-slot:activator="{ on }">
              <div
                data-test-id="help-button"
                class="text-center clickable mx-4"
                v-on="on"
              >
                <img :src="require('@/assets/png/Help.png')" height="45" />
                <div class="text-caption">
                  Help
                </div>
              </div>
            </template>

            <v-card>
              <v-list dense>
                <!--Hidden by ticket: https://app.shortcut.com/gold-media-tech/story/4106/hide-video-tutorial-option -->

                <!--<v-list-item>
                  <v-btn
                    class="btn-register text--disabled"
                    :ripple="false"
                    x-small
                    text
                    nuxt
                    :to="{ name: 'app-onboarding' }"
                  >
                    <img
                      class="mr-2"
                      height="30"
                      :src="require('@/assets/png/Tutorial-icon.png')"
                    >
                    Tutorial
                  </v-btn>
                </v-list-item>

                <div class="px-2 py-3">
                  <v-divider />
                </div> -->

                <v-list-item>
                  <v-btn
                    class="btn-register text--disabled"
                    :ripple="false"
                    x-small
                    text
                    nuxt
                    :to="{ name: 'help' }"
                    data-test-id="faq-button"
                  >
                    <img
                      class="mr-2"
                      height="30"
                      :src="require('@/assets/png/FAQ.png')"
                    />
                    FAQ
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'

import ChildSelect from '@/components/app/ChildSelect.vue'
import {
  useAuth,
  useChildRoute,
  useNuxtHelper,
  useVuetifyHelper,
  useAppEventBusHelper
} from '@/composables'
import { TypedStore, APP_EVENTS } from '@/models'
import { useBirthdayHelpers } from '@/components/features/childBirthday/composables'

export default defineComponent({
  components: {
    ChildSelect
  },

  data() {
    return {
      scrollDown: false,
      currentScroll: 0
    }
  },

  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('scroll', this.toggleHeader)
  },

  destroyed() {
    window.removeEventListener('scroll', this.toggleHeader)
  },

  methods: {
    toggleHeader() {
      if (this.$vuetify.breakpoint.mdAndDown) {
        const scroll = window.scrollY
        if (scroll > this.currentScroll) {
          this.scrollDown = true
          this.currentScroll = scroll
        } else if (scroll < this.currentScroll) {
          this.scrollDown = false
          this.currentScroll = scroll
        }
      } else {
        this.scrollDown = false
      }
    }
  },

  setup() {
    const vuetify = useVuetifyHelper()
    const isMobile = computed(() => vuetify.breakpoint.mobile)
    const isMobileLandscape = computed(() => vuetify.breakpoint.smOnly)

    const appBarHeight = computed(() => {
      return isMobileLandscape.value
        ? '140px'
        : isMobile.value
          ? '250px'
          : '175px'
    })
    const appBarTitleSize = computed(() => (isMobile.value ? '28px' : '40px'))
    const appBarLogoSize = computed(() => (isMobile.value ? '25px' : '45px'))
    const appBarLogoSizeLearnPlay = computed(() =>
      isMobile.value ? '35px' : '75px'
    )
    const hasPlayAndLearnPlan = computed(
      () => store.getters['auth/hasPlayAndLearnPlan']
    )

    const hasPlayAndLearnPlanLivePlan = computed(
      () => store.getters['auth/hasPlayAndLearnLivePlan']
    )

    const store = useStore<TypedStore>()

    const { isUserLoggedIn, isUserInSignupProcess } = useAuth({ store })

    const route = useRoute()
    const router = useRouter()
    const { childId } = useChildRoute({ store, route, router })
    const eventBus = useAppEventBusHelper()
    const { isCurrentChildsBirthday } = useBirthdayHelpers()

    const nuxt = useNuxtHelper()
    const handleSidebarToggle = () => {
      nuxt.$emit('toggle-nav-drawer')
    }

    function handleClickOnBirthdayIcon() {
      eventBus.$emit(APP_EVENTS.SHOW_BIRTHDAY_MODAL)
    }

    return {
      isMobile,
      isUserLoggedIn,
      isUserInSignupProcess,
      childId,
      appBarTitleSize,
      appBarLogoSizeLearnPlay,
      appBarLogoSize,
      appBarHeight,
      handleSidebarToggle,
      handleClickOnBirthdayIcon,
      isCurrentChildsBirthday,
      hasPlayAndLearnPlan,
      hasPlayAndLearnPlanLivePlan
    }
  }
})
</script>

<style lang="scss" scoped>
.childBirthdayBtn {
  &.v-btn {
    height: 60px;
    width: 35px;
    display: grid;
    place-items: center;
  }
}

.clickable {
  cursor: pointer;
}
.child-select {
  width: 250px;
}
.pg-header {
  background: #ffffff !important;
  box-shadow: 0px 3px 46px rgba(0, 0, 0, 0.160784) !important;
  border-radius: 0px 0px 36px 36px !important;

  &-menu-btn {
    position: absolute;
    top: 5px;
    left: 5px;
  }
}
.btn-register:before {
  background-color: transparent !important;
}
</style>
