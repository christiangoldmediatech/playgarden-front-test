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
          cols="3"
          md="6"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              class="clickable square"
              :class="{ primary: i === selected }"
              :disabled="!selectedChildId"
              :elevation="hover || i === selected ? 9 : 3"
              nuxt
              :to="{
                name: `app-student-cubby-${link.route}`,
                query: { id: selectedChildId }
              }"
              @click.native="$scrollTo('body')"
            >
              <div
                class="content align-center d-flex flex-column justify-center"
              >
                <v-img
                  class="flex-shrink-1 flex-grow-0 pa-0"
                  contain
                  height="200"
                  :src="require(`@/assets/png/student-cubby/${link.img}`)"
                  width="200"
                />

                <span
                  class="font-weight-bold d-block text-center text-body-2 text-md-subtitle-2 text-xl-h6 text-kerning menu-link"
                  :class="{mobile: $vuetify.breakpoint.xs}"
                >
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
          route: 'puzzle'
        },
        {
          text: 'PROGRESS',
          img: 'abc.png',
          route: 'course-progress'
        },
        {
          text: 'PORTFOLIO',
          img: 'group.png',
          route: 'student-portfolio'
        },
        {
          text: 'PATCHES',
          img: 'patches.svg',
          route: 'patches'
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
      const routes = this.links.map(
        ({ route }) => `app-student-cubby-${route}`
      )
      return routes.findIndex(route => route === this.$route.name)
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

.text-kerning {
  letter-spacing: 1.5px !important;
}

.square {
  padding: 5%;
  position: relative;
  width: 100%;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.content {
  background-color: #ffffff;
  height: 90%;
  padding: 5%;
  position: absolute;
  width: 90%;
}

.menu-link {
  &.mobile {
    display: none !important;
  }
}
</style>
