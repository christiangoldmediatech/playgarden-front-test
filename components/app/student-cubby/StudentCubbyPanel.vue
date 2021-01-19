<template>
  <v-card class="sticky" min-width="275">
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-img
      class="hidden-sm-and-down"
      contain
      :src="require('@/assets/png/student-cubby/butterfly-lesson.png')"
    />

    <v-card-text>
      <span class="d-block text-center text-h6 font-weight-bold">
        STUDENTS CUBBY
      </span>

      <v-row no-gutters justify="center" class="mb-8">
        <v-col>
          <child-select v-model="selectedChildId" hide-details />
        </v-col>
      </v-row>

      <span class="d-none text-center text-h6">
        {{ selectedChildLevel }}
      </span>

      <v-row dense>
        <v-col
          v-for="(link, i) in links"
          :key="`link-route-${link.route}`"
          cols="12"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              class="clickable cubby-card"
              :class="{ 'cubby-card-selected': i === selected }"
              :disabled="!selectedChildId"
              :elevation="hover || i === selected ? 9 : 3"
              nuxt
              :to="{
                name: link.route,
                query: { id: selectedChildId }
              }"
            >
              <div class="cubby-item">
                <img class="cubby-icon" :src="require(`@/assets/png/student-cubby/${link.img}`)">
                <span class="cubby-text">
                  {{ link.text }}
                </span>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import ChildSelect from '@/components/app/ChildSelect.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'StudentCubbyPanel',

  components: {
    ChildSelect
  },

  data () {
    return {
      selectedChildId: null,
      links: [
        {
          text: 'PUZZLE',
          img: 'puzzle-piece.png',
          route: 'app-student-cubby-puzzle'
        },
        {
          text: 'PATCHES',
          img: 'patches.svg',
          route: 'app-student-cubby-patches'
        },
        {
          text: 'CURRICULUM',
          img: 'abc.png',
          route: 'app-student-cubby-course-progress'
        },
        {
          text: 'PORTFOLIO',
          img: 'group.png',
          route: 'app-student-cubby-student-portfolio'
        },
        {
          text: 'PROGRESS REPORT',
          img: 'progress.png',
          route: 'app-progress-report'
        }
      ]
    }
  },

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),

    ...mapGetters('children', { children: 'rows' }),

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    selected () {
      const routes = this.links.map(({ route }) =>
        RegExp(`${route}*`)
      )
      return routes.findIndex(route => route.test(this.$route.name))
    },

    selectedChildLevel () {
      const child = this.children.find(({ id }) => id === this.selectedChildId)
      return child ? child.level : 'LEVEL'
    }
  },

  watch: {
    selectedChildId (id) {
      if (id) {
        this.$router.push({ name: this.$route.name, query: { id } })
      }
    }
  },

  created () {
    if (this.id) {
      this.selectedChildId = parseInt(this.id)
    } else if (this.currentChild.length) {
      this.selectedChildId = this.currentChild[0].id
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-height {
  height: 125px;
}

.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 75px;
}

.cubby {
  &-card {
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 24px;
    &-selected {
      border: 3px solid #DCE7B5;
    }
  }
  &-item {
    background-color: white;
    display: flex;
    align-items: center;
  }
  &-icon {
    width: 38px;
    height: 38px;
    max-width: 38px;
    max-height: 38px;
    object-fit: contain;
    object-position: center;
  }
  &-text {
    font-size: 18px;
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: 3px;
    margin-left: 24px;
    color: #606060;
;
  }
}
</style>
