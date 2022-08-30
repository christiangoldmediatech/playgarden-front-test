<template>
  <v-main class="bkg fit-page d-flex">
    <v-container fluid class="my-auto">
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6" class="pick-child" :class="{mobile: $vuetify.breakpoint.smAndDown}">
          <v-card>
            <div class="green-line green-line-1" />
            <div class="green-line green-line-2" />

            <v-card-text>
              <div class="text-center my-6">
                <underlined-title
                  class="text-h4 text-md-h3"
                  text="Who is at school today?"
                />
              </div>

              <v-row justify="center">
                <v-col
                  v-for="(child, childIndex) in children"
                  :key="`child-${child.id}`"
                  class="selected-child text-center"
                  cols="6"
                  lg="3"
                  :data-test-id="`pick-child-${childIndex}`"
                  @click.stop="selectChild(child)"
                >
                  <v-hover v-slot:default="{ hover }">
                    <div :class="['child-option', { scaled: hover }]">
                      <v-img
                        :src="
                          child.everyone
                            ? require('@/assets/svg/everyone.svg')
                            : child.backpack.image
                        "
                        aspect-ratio="1"
                        contain
                      />
                      <span class="font-weight-bold">
                        {{ child.firstName }}
                      </span>
                    </div>
                  </v-hover>
                </v-col>
              </v-row>

              <v-btn
                color="primary"
                active-class="custom-active"
                text
                block
                x-large
                :to="{ name: 'app-account-index-student-profile' }"
              >
                MANAGE STUDENT PROFILES
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'PickChild',

  data: () => {
    return {
      selected: null
    }
  },

  computed: {
    ...mapGetters('children', ['rows']),

    children () {
      const result = jsonCopy(this.rows)

      /* result.push({
        id: null,
        firstName: 'Everyone',
        everyone: true
      }) */

      return result
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  destroyed() {
    document.body.style.overflow = 'scroll'
  },
  async created () {
    await this.getChildren()

    // NOTE: "everyone" count as one child here
    if (this.children.length === 1) {
      this.selectChild(this.children[0])
    }
  },

  methods: {
    ...mapActions('children', { getChildren: 'get' }),

    ...mapActions(['setChild']),

    selectChild (child) {
      if (!this.selected) {
        this.selected = child

        if (child.id) {
          this.setChild({ value: [child], save: true })
        } else {
          this.setChild({ value: this.rows, save: true })
        }

        if (this.$route.query.redirect) {
          this.$router.push(decodeURIComponent(this.$route.query.redirect))
        } else {
          this.$router.push({
            name: 'app-virtual-preschool',
            query: {
              _time: new Date().getTime() // <- just in order to avoid infinite loading bar
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-main__wrap {
  margin-top: auto;
  margin-bottom: auto;
}

.fit-page{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 101%;
  z-index: 2000;
  padding: 0 0 0 0 !important;
  overflow-y: auto;
}

.child-option {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.15);
}

.min-col {
  min-height: 125px !important;
}

.bkg {
  background-color: rgba(0, 0, 0, 0.68);
}

.v-btn--active.custom-active {
  &::before {
    opacity: 0 !important;
  }
}

.pick-child {
  margin-top: 90px;
  margin-bottom: 90px;
  &.mobile {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}

.name-child {
  text-align: center;
}

.selected-child {
  cursor: pointer;
}

.everyone-img {
  margin-top: 17px;
}

.image-child-max {
  height: 148px;
}
</style>
