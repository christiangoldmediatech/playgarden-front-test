<template>
  <v-main>
    <UpdatePlanDialog />

    <v-row justify="center" no-gutters>
      <!-- Page Title -->
      <v-col
        v-if="selectedCubbyItem"
        cols="12"
        class="text-center mt-16 mb-12 px-3"
      >
        <underlined-title
          data-test-id="student-cubby-title"
          :text="selectedCubbyItem && selectedCubbyItem.title"
          font-size="65px"
        />
      </v-col>

      <!-- Child Select And Cubby Item Select -->
      <v-col cols="12" class="mb-0 mb-md-8 px-3">
        <v-row no-gutters justify="center">
          <v-col cols="12" lg="3" xl="2" class="px-10">
            <ChildSelect
              v-model="ChildRoute.childId"
              @input="ChildRoute.setCurrentChildToRoute"
            />
          </v-col>
          <v-col cols="12" lg="auto" class="px-10 px-lg-0">
            <StudentCubbyItems
              :is-mobile="isMobile"
              :items="studentCubbyItems"
              :selected-child-id="ChildRoute.childId.value || 0"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <!-- Student Cubby Content -->
        <template v-if="ChildRoute.childId">
          <v-container class="pt-0 pt-md-3">
            <nuxt-child />
          </v-container>
        </template>
        <!-- Select Child Placeholder -->
        <template v-else>
          <v-container fill-height>
            <v-row align="center" justify="center">
              <v-col class="text-center">
                <div>
                  <img class="logo-img" src="@/assets/svg/logo.svg" />
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
import {
  defineComponent,
  onMounted,
  useRoute,
  computed,
  useRouter,
  useStore
} from '@nuxtjs/composition-api'
import StudentCubbyItems from '@/components/app/student-cubby/StudentCubbyItems.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import UpdatePlanDialog from '@/components/app/student-cubby/UpdatePlanDialog.vue'
import { TypedStore } from '@/models'
import { useChildRoute, useLanguageHelper, useVuetifyHelper } from '@/composables'

export default defineComponent({
  name: 'StudentCubby',

  components: {
    ChildSelect,
    StudentCubbyItems,
    UpdatePlanDialog
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const vuetify = useVuetifyHelper()
    const language = useLanguageHelper()
    const ChildRoute = useChildRoute({
      store,
      route,
      router,
      shouldRedirect: true
    })

    const studentCubbyItems = [
      {
        text: language.t('studentCubby.puzzle.text'),
        title: language.t('studentCubby.puzzle.title'),
        imgName: 'puzzle-piece.png',
        routeName: 'app-student-cubby-puzzle'
      },
      {
        text: language.t('studentCubby.patches.text'),
        title: language.t('studentCubby.patches.title'),
        imgName: 'patches.svg',
        routeName: 'app-student-cubby-patches'
      },
      {
        text: language.t('studentCubby.curriculum.text'),
        title: language.t('studentCubby.curriculum.title'),
        imgName: 'abc.png',
        routeName: 'app-student-cubby-course-progress'
      },
      {
        text: language.t('studentCubby.portfolio.text'),
        title: language.t('studentCubby.portfolio.title'),
        imgName: 'group.png',
        routeName: 'app-student-cubby-student-portfolio'
      },
      {
        text: language.t('studentCubby.progressReport.text'),
        title: language.t('studentCubby.progressReport.title'),
        imgName: 'progress.png',
        routeName: 'app-student-cubby-progress-report'
      }
    ]

    const isRegistrationComplete = computed(() => {
      return store.getters['auth/isRegistrationComplete']
    })

    const selectedCubbyItem = computed(() => {
      return studentCubbyItems.find(item =>
        route.value.name?.includes(item.routeName)
      )
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    onMounted(() => {
      if (!isRegistrationComplete.value) {
        router.push({ name: 'app-index' })
      }
    })

    return {
      ChildRoute,
      isMobile,
      selectedCubbyItem,
      studentCubbyItems
    }
  }
})
</script>
