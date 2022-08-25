<template>
  <v-main class="bkg">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6" class="pick-child" :class="{mobile: $vuetify.breakpoint.smAndDown}">
          <v-card>
            <div v-if="!isPlayAndLearn" class="green-line green-line-1" />
            <div v-if="!isPlayAndLearn" class="green-line green-line-2" />

            <v-card-text>
              <div
                class="text-center"
                :class="{
                  'mb-8': isPlayAndLearn && !$vuetify.breakpoint.xs,
                  'my-6': !$vuetify.breakpoint.xs
                }"
              >
                <h1
                  v-if="isPlayAndLearn"
                  class="play-and-learn-title"
                >
                  Who’s at Play and Learn today?
                </h1>
                <underlined-title
                  v-else
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
                  md="4"
                  sm="4"
                  lg="4"
                  :data-test-id="`pick-child-${childIndex}`"
                  @click.stop="selectChild(child)"
                >
                  <v-hover v-slot:default="{ hover }">
                    <div
                      class="d-flex flex-column align-center"
                      :class="[
                        'child-option',
                        { scaled: hover },
                        { 'play-and-learn-option': isPlayAndLearn },
                        { 'px-6': isPlayAndLearn },
                        { 'pb-6': isPlayAndLearn }
                      ]"
                    >
                      <v-img
                        :src="
                          child.everyone
                            ? require('@/assets/svg/everyone.svg')
                            : child.backpack.image
                        "
                        aspect-ratio="1"
                        contain
                        :class="{ 'my-6': isPlayAndLearn }"
                        :width="isPlayAndLearn ? '100px' : '150px'"
                        :height="isPlayAndLearn ? '100px' : '150px'"
                      />
                      <span
                        class="font-weight-bold"
                        :class="[
                          { 'play-and-learn-option-text': isPlayAndLearn },
                        ]"
                      >
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
                :class="[{ 'my-8': isPlayAndLearn }, { 'play-and-learn-btn-text': isPlayAndLearn }]"
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
    ...mapGetters('auth', ['getUserInfo']),

    children () {
      const result = jsonCopy(this.rows)

      /* result.push({
        id: null,
        firstName: 'Everyone',
        everyone: true
      }) */

      return result
    },

    isPlayAndLearn() {
      return this.getUserInfo.planSelected.name === 'Learn and Play'
    }
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
.play-and-learn-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 52px;
  color: #F89838;

  @media (min-width: 600px) {
    font-size: 38px;
  }
}

.play-and-learn-option {
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.play-and-learn-option-text {
  font-size: 19px;
  line-height: 65px;
  color: #7852B5;

  @media (min-width: 600px) {
    font-size: 39px;
  }
}

.play-and-learn-btn-text {
  ::v-deep {
    .v-btn__content {
      font-size: 16px;
      word-break: break-word;

      @media (min-width: 600px) {
        font-size: 29px;
      }
    }
  }
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
