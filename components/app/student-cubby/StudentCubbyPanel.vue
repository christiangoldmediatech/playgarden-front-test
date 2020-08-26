<template>
  <v-card
    min-width="290"
    max-width="426"
  >
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-img
      :src="require('@/assets/png/student-cubby/butterfly-lesson.png')"
      contain
    />

    <v-card-text>
      <span class="d-block text-center text-h6 font-weight-bold">
        STUDENTS CUBBY
      </span>

      <v-row no-gutters justify="center">
        <v-col cols="8">
          <child-select v-model="selectedChildId" hide-details />
        </v-col>
      </v-row>

      <span class="d-block text-center text-h6">
        {{ selectedChildLevel }}
      </span>

      <v-row>
        <v-col
          v-for="(link, i) in links"
          :key="`link-route-${link.route}`"
          cols="6"
        >
          <v-hover v-slot="{ hover }">
            <v-card
              class="clickable"
              :disabled="!selectedChildId"
              :elevation="hover ? 9 : 3"
              @click.stop="$router.push({ name: `app-student-cubby-${link.route}`, query: { id: selectedChildId } })"
            >
              <v-card-text :class="{ 'selected': i === selected }">
                <div class="d-flex flex-column fixed-height">
                  <v-img class="flex-shrink-1 flex-grow-0" :src="require(`@/assets/png/student-cubby/${link.img}`)" contain />
                  <span class="d-block text-h6 text-center">
                    {{ link.text }}
                  </span>
                </div>
              </v-card-text>
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
          text: 'COURSE PROGRESS',
          img: 'abc.png',
          route: 'course-progress'
        },
        {
          text: 'STUDENT PORTFOLIO',
          img: 'group.png',
          route: 'student-portfolio'
        },
        {
          text: 'BADGES',
          img: 'trophy.png',
          route: 'badges'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('children', { children: 'rows' }),

    id () {
      return this.$route.query.id ? parseInt(this.$route.query.id) : null
    },

    selected () {
      const routes = this.links.map(({ route }) => `app-student-cubby-${route}`)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-height {
  height: 164px;
}

.selected {
  box-shadow: inset 0px 0px 0px 10px var(--v-primary-base);
}
</style>
