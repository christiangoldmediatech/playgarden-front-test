<template>
  <v-main class="bkg">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card>
            <div class="green-line green-line-1" />
            <div class="green-line green-line-2" />

            <v-card-text>
              <div class="text-center my-6">
                <span class="underlined-title">
                  Who is at school today?
                </span>
              </div>

              <v-row class="text-center" justify="center">
                <v-hover
                  v-for="child in children"
                  :key="`child-${child.id}`"
                  v-slot:default="{ hover }"
                  open-delay="100"
                  close-delay="100"
                >
                  <v-col
                    class="clickable"
                    cols="6"
                    sm="3"
                    lg="2"
                    @click.stop="selectChild(child)"
                  >
                    <div class="align-center min-col">
                      <v-img
                        v-if="child.everyone"
                        class="mb-3"
                        :src="require('@/assets/svg/everyone.svg')"
                        :max-height="hover ? 114 : 100"
                        contain
                      />

                      <v-avatar
                        v-else
                        class="mb-3"
                        :color="hover ? 'primary' : 'accent'"
                        :size="hover ? 112 : 96"
                      >
                        <v-img
                          :src="child.backpack.image"
                          max-height="70%"
                          contain
                        />
                      </v-avatar>
                    </div>

                    <p class="font-weight-bold">
                      {{ child.firstName }}
                    </p>
                  </v-col>
                </v-hover>
              </v-row>

              <v-btn
                color="primary"
                active-class="custom-active"
                text
                block
                x-large
                :to="{ name: 'app-account' }"
              >
                MANAGE PROFILES
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

      result.push({
        id: null,
        firstName: 'Everyone',
        everyone: true
      })

      return result
    }
  },

  async created () {
    await this.getChildren()

    // NOTE: "everyone" count as one child here
    if (this.children.length === 2) {
      this.selectChild(this.children[0])
    }
  },

  methods: {
    ...mapActions('children', { getChildren: 'get' }),

    ...mapActions({ setChild: 'setChild' }),

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
          this.$router.push({ name: 'app-dashboard' })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.min-col {
  min-height: 125px !important;
}

.bkg {
  background-color: rgba(0, 0, 0, 0.5);
}

.v-btn--active.custom-active {
  &::before {
    opacity: 0 !important;
  }
}

.underlined-title {
  font-size: 2rem;
  font-weight: bold;
  position: relative;
  z-index: 1;
  &::after {
    width: 102%;
    position: absolute;
    bottom: 0.15rem;
    left: -1%;
    content: "";
    z-index: -1;
    border-bottom: 0.8rem solid $pg-main;
    border-radius: 0.2rem;
  }
}
</style>
