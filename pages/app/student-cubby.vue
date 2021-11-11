<template>
  <v-main>
    <v-row
      justify="center"
      no-gutters
    >
      <!-- Page Title -->
      <v-col
        v-if="selectedCubbyItem"
        cols="12"
        class="text-center mt-16 mb-12 px-3"
      >
        <underlined-title
          data-test-id="student-cubby-title"
          :text="selectedCubbyItem.title"
          font-size="65px"
        />
      </v-col>
      <!-- Child Select And Cubby Item Select -->
      <v-col
        cols="12"
        class="mb-0 mb-md-8 px-3"
      >
        <v-row
          no-gutters
          justify="center"
        >
          <v-col
            cols="12"
            lg="3"
            xl="2"
            class="px-10"
          >
            <child-select v-model="childId" />
          </v-col>
          <v-col
            cols="12"
            lg="auto"
            class="px-10 px-lg-0"
          >
            <student-cubby-items
              :is-mobile="isMobile"
              :items="studentCubbyItems"
              :selected-child-id="childId || 0"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        class="pos-relative"
      >
        <!-- Student Cubby Content -->
        <UnlockPrompt
          v-if="unlockPromptProps"
          v-bind="unlockPromptProps"
        />
        <template v-if="childId">
          <v-container class="pt-0 pt-md-3">
            <nuxt-child />
          </v-container>
        </template>
        <!-- Select Child Placeholder -->
        <template v-else>
          <v-container fill-height>
            <v-row
              align="center"
              justify="center"
            >
              <v-col class="text-center">
                <div>
                  <img
                    class="logo-img"
                    src="@/assets/svg/logo.svg"
                  >
                </div>

                <span class="primary--text text-h5 font-weight-bold">
                  Select your child
                </span>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, useRoute, computed, watch, useRouter, onMounted, ref, useStore } from '@nuxtjs/composition-api'
import StudentCubbyItems from '@/components/app/student-cubby/StudentCubbyItems.vue'
import UnlockPrompt, { UnlockPromptProps } from '@/components/app/student-cubby/UnlockPrompt.vue'
import { studentCubbyItems } from '@/components/app/student-cubby/constants'
import ChildSelect from '@/components/app/ChildSelect.vue'
import { TypedStore } from '@/models'
import { useChildRoute, useVuetifyHelper } from '@/composables'
import { usePlanAccessHelpers } from '~/composables'

export default defineComponent({
  name: 'StudentCubby',

  components: {
    ChildSelect,
    StudentCubbyItems,
    UnlockPrompt
  },

  setup (_, ctx) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const vuetify = useVuetifyHelper()
    const { childId } = useChildRoute({ store, route, router, shouldRedirect: true })
    const { isItemUnAvailableForCurrentUser } = usePlanAccessHelpers()

    const selectedCubbyItem = computed(() => {
      return studentCubbyItems.find(item => route.value.name?.includes(item.routeName)) || null
    })

    const unlockPromptProps = computed((): UnlockPromptProps | null => {
      if (isCurrentItemUnAvailableForUserPlan.value && selectedCubbyItem.value) {
        return {
          blockedItem: selectedCubbyItem.value
        }
      }
      return null
    })

    const isCurrentItemUnAvailableForUserPlan = computed(() => {
      if (!selectedCubbyItem.value) { return false }
      return isItemUnAvailableForCurrentUser(selectedCubbyItem.value.text)
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    return {
      childId,
      isMobile,
      selectedCubbyItem,
      studentCubbyItems,
      isCurrentItemUnAvailableForUserPlan,
      unlockPromptProps
    }
  }
})
</script>
