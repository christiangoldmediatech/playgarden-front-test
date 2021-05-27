<template>
  <v-main>
    <v-container fluid>
      <v-row justify="center" no-gutters>
        <!-- Page Title -->
        <v-col cols="12" class="text-center mt-16 mb-12">
          <underlined-title
            :text="selectedCubbyItem.title"
            font-size="65px"
          />
        </v-col>
        <!-- Child Select And Cubby Item Select -->
        <v-col cols="12" class="mb-0 mb-md-8">
          <v-row no-gutters justify="center">
            <v-col cols="12" lg="3" xl="2" class="px-10">
              <child-select v-model="selectedChildId" />
            </v-col>
            <v-col cols="12" lg="auto" class="px-10 px-lg-0">
              <student-cubby-items
                :items="studentCubbyItems"
                :selected-child-id="selectedChildId"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <!-- Student Cubby Content -->
          <template v-if="selectedChildId">
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
                    <img class="logo-img" src="@/assets/svg/logo.svg">
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
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, useRoute, computed, watch, useRouter, onMounted, ref } from '@nuxtjs/composition-api'
import StudentCubbyItems from '@/components/app/student-cubby/StudentCubbyItems.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'

export default defineComponent({
  name: 'StudentCubby',

  components: {
    ChildSelect,
    StudentCubbyItems
  },

  setup (_, ctx) {
    const route = useRoute()
    const router = useRouter()

    const studentCubbyItems = [
      {
        text: 'PUZZLE',
        title: 'STUDENTS CUBBY',
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
        title: 'PROGRESS REPORT',
        imgName: 'progress.png',
        routeName: 'app-progress-report'
      }
    ]
    const selectedCubbyItem = computed(() => {
      return studentCubbyItems.find(item => route.value.name?.includes(item.routeName)) || {}
    })

    const routeChildId = computed<number | null>(() => {
      if (typeof route.value.query.id !== 'string') {
        return null
      }

      return parseInt(route.value.query.id)
    })

    watch(routeChildId, () => {
      router.push({
        name: 'app-student-cubby-puzzle',
        query: { id: `${routeChildId.value}` }
      })
    })

    const selectedChildId = ref<number>(routeChildId.value || 0)

    watch(selectedChildId, (id) => {
      if (id) {
        router.push({
          name: route.value.name || 'app-student-cubby-puzzle',
          query: { id: `${id}` }
        })
      }
    })

    const currentChildren = ctx.root.$store.getters.getCurrentChild

    onMounted(() => {
      if (routeChildId.value) {
        selectedChildId.value = routeChildId.value
      } else if (currentChildren?.length) {
        selectedChildId.value = currentChildren[0].id
      }
    })

    return {
      studentCubbyItems,
      selectedCubbyItem,
      selectedChildId
    }
  }
})
</script>
