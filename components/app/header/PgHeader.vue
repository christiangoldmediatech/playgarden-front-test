<template>
  <v-app-bar flat :height="appBarHeight" class="pg-header" app>
    <v-row no-gutters>
      <!-- Hamburguer Menu -->
      <v-btn class="d-inline d-md-none pg-header-menu-btn" icon :ripple="false" @click="handleSidebarToggle">
        <v-icon large class="primary--text">
          mdi-menu
        </v-icon>
      </v-btn>

      <!-- Children Select  -->
      <v-col cols="12" md="3" order="2" order-md="1" class="d-flex align-center justify-center">
        <button @click="showModalBirthday">
          <img :src="require('@/assets/png/birthday/partyHat.png')">
        </button>
        <div class="child-select mt-2 mt-md-0">
          <child-select v-if="childId" v-model="childId" class="mb-n4" />
        </div>
      </v-col>

      <v-col cols="12" md="6" order="1" order-md="2" class="d-flex flex-column justify-center align-center">
        <v-row no-gutters class="text-center">
          <!-- PlaygardenPrep Logo -->
          <v-col cols="12">
            <img
              alt="Playarden Prep Online Logo"
              :height="appBarLogoSize"
              :src="require('@/assets/svg/logo.svg')"
            >
          </v-col>

          <!-- Toolbar Title -->
          <v-col cols="12">
            <underlined-title text="Virtual Preschool!" :font-size="appBarTitleSize" :font-size-mobile="appBarTitleSize" />
          </v-col>

          <!-- Toolbar Description -->
          <v-col>
            <div class="text-body-1 text-md-h6">
              We are excited for a new day full of learning.
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
            :src="require('@/assets/png/Profile.png')"
            @click="$router.push({ name: 'app-account-index' })"
          >
          <div class="text-caption">
            Profile
          </div>
        </div>

        <!-- Help Button -->
        <template v-if="isUserLoggedIn && !isUserInSignupProcess">
          <v-menu open-on-hover offset-y offset-overflow>
            <template v-slot:activator="{ on }">
              <div data-test-id="help-button" class="text-center clickable mx-4" v-on="on">
                <img
                  :src="require('@/assets/png/Help.png')"
                  height="45"
                >
                <div class="text-caption">
                  Help
                </div>
              </div>
            </template>

            <v-card>
              <v-list dense>
                <v-list-item>
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
                </div>
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
                    >
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
import { defineComponent, computed, useStore, useRoute, useRouter } from '@nuxtjs/composition-api'

import ChildSelect from '@/components/app/ChildSelect.vue'
import { useAuth, useChildRoute, useNuxtHelper, useVuetifyHelper, useAppEventBusHelper } from '@/composables'
import { TypedStore, APP_EVENTS } from '@/models'
import { onMounted } from '@vue/composition-api'

export default defineComponent({
  components: {
    ChildSelect
  },

  setup () {
    const vuetify = useVuetifyHelper()
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const appBarHeight = computed(() => isMobile.value ? '220px' : '175px')
    const appBarTitleSize = computed(() => isMobile.value ? '28px' : '60px')
    const appBarLogoSize = computed(() => isMobile.value ? '25px' : '45px')

    const store = useStore<TypedStore>()
    const { isUserLoggedIn, isUserInSignupProcess } = useAuth({ store })

    const route = useRoute()
    const router = useRouter()
    const { childId, resolveChildId } = useChildRoute({ store, route, router })
    const eventBus = useAppEventBusHelper()
    onMounted(() => {
      resolveChildId()
    })

    const nuxt = useNuxtHelper()
    const handleSidebarToggle = () => {
      nuxt.$emit('toggle-nav-drawer')
    }

    const showModalBirthday = () => {
      eventBus.$emit(APP_EVENTS.BIRTHDAY_SHOW_MODAL, true)
    }

    return {
      isMobile,
      isUserLoggedIn,
      isUserInSignupProcess,
      childId,
      appBarTitleSize,
      appBarLogoSize,
      appBarHeight,
      handleSidebarToggle,
      showModalBirthday
    }
  }
})
</script>

<style lang="scss" scoped>
.clickable {
  cursor: pointer;
}
.child-select {
  width: 250px;
}
.pg-header {
  background: #FFFFFF !important;
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
