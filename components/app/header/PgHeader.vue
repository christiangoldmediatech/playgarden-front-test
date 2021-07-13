<template>
  <v-app-bar flat height="175" app>
    <v-row no-gutters>
      <v-col md="3" align-self="center">
        <child-select v-if="childId" v-model="childId" />
      </v-col>

      <v-col md="6" class="d-flex flex-column justify-center align-center">
        <img
          alt="Playarden Prep Online Logo"
          height="45"
          :src="require('@/assets/svg/logo.svg')"
        >

        <underlined-title text="Virtual Preschool" />

        <div class="text-subtitle-1">
          We are excited for a new day full of learning.
        </div>
      </v-col>

      <v-col md="3" class="d-flex justify-end align-center">
        <img
          v-if="isUserLoggedIn && !isUserInSignupProcess"
          height="50"
          :src="require('@/assets/svg/account-profile.svg')"
          @click="$router.push({ name: 'app-account-index' })"
        >

        <template v-if="isUserLoggedIn && !isUserInSignupProcess">
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on }">
              <img
                :src="require('@/assets/png/Help.png')"
                height="50"
                v-on="on"
              >
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
                      class="clickable account-btn"
                      height="50"
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
                  >
                    <img
                      class="clickable account-btn"
                      height="50"
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
import { useAuth, useChildRoute, useVuetifyHelper } from '@/composables'
import { TypedStore } from '@/models'
import { onMounted } from '@vue/composition-api'

export default defineComponent({
  components: {
    ChildSelect
  },

  setup () {
    const vuetify = useVuetifyHelper()
    const isMobile = computed(() => vuetify.breakpoint.mobile)

    const store = useStore<TypedStore>()
    const { isUserLoggedIn, isUserInSignupProcess } = useAuth({ store })

    const route = useRoute()
    const router = useRouter()
    const { childId, resolveChildId } = useChildRoute({ store, route, router })

    onMounted(() => {
      resolveChildId()
    })

    return {
      isMobile,
      isUserLoggedIn,
      isUserInSignupProcess,
      childId
    }
  }
})
</script>
