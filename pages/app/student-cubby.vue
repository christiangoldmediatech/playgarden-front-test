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
  useRoute,
  computed,
  useRouter,
  useStore
} from '@nuxtjs/composition-api'
import StudentCubbyItems from '@/components/app/student-cubby/StudentCubbyItems.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import UpdatePlanDialog from '@/components/app/student-cubby/UpdatePlanDialog.vue'
import { TypedStore } from '@/models'
import { useChildRoute, useVuetifyHelper } from '@/composables'

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
    const ChildRoute = useChildRoute({
      store,
      route,
      router,
      shouldRedirect: true
    })

    const studentCubbyItems = [
      {
        text: 'PUZZLE',
        title: 'STUDENT CUBBY',
        imgName: 'puzzle-piece.png',
        routeName: 'app-student-cubby-puzzle'
      },
      {
        text: 'PATCHES',
        title: 'Earn Activity Patches for learning',
        imgName: 'patches.svg',
        routeName: 'app-student-cubby-patches'
      },
      {
        text: 'CURRICULUM',
        title: 'Review all Curriculum',
        imgName: 'abc.png',
        routeName: 'app-student-cubby-course-progress'
      },
      {
        text: 'PORTFOLIO',
        title: 'PORTFOLIO',
        imgName: 'group.png',
        routeName: 'app-student-cubby-student-portfolio'
      },
      {
        text: 'PROGRESS REPORT',
        title: 'Student progress report',
        imgName: 'progress.png',
        routeName: 'app-student-cubby-progress-report'
      }
    ]

    const selectedCubbyItem = computed(() => {
      return studentCubbyItems.find(item =>
        route.value.name?.includes(item.routeName)
      )
    })

    const isMobile = computed(() => vuetify.breakpoint.mobile)

    return {
      ChildRoute,
      isMobile,
      selectedCubbyItem,
      studentCubbyItems
    }
  }
})
</script>
