<template>
  <v-main class="main">
    <v-container class="pt-0" :class="{ 'fill-height': loading }" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <pg-loading v-if="loading" />

          <template v-else>
            <v-row
              class="px-5 py-12"
              :class="{
                'flex-column-reverse flex-md-column': $vuetify.breakpoint.xs,
              }"
              no-gutters
            >
              <v-col cols="12" md="5">
                <underlined-title
                  class="hidden-sm-and-down"
                  :text="pageTitle"
                />

                <p class="mt-6 text-md-left text-sm-center">
                  {{ pageDescription }}
                </p>

                <v-row justify="center" no-gutters>
                  <v-btn
                    href="https://playgardenprep.com/online/"
                    color="accent"
                    width="250"
                    tile
                    x-large
                  >
                    Learn more
                  </v-btn>
                </v-row>
              </v-col>

              <v-col cols="12" md="7">
                <v-row justify="center" no-gutters>
                  <p class="hidden-md-and-up text-center">
                    <underlined-title :text="pageTitle" />
                  </p>

                  <v-dialog
                    v-model="dialog"
                    content-class="elevation-0"
                    persistent
                    width="80vh"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-img
                        class="clickable"
                        contain
                        max-height="500"
                        max-width="500"
                        :src="pageImage"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>

                    <v-col>
                      <v-row justify="end">
                        <v-btn
                          color="white"
                          :disabled="loading"
                          icon
                          @click.stop="close"
                        >
                          <v-icon>
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </v-row>

                      <v-row class="white">
                        <p class="text-center">
                          <underlined-title :text="pageTitle" />
                        </p>
                      </v-row>

                      <v-row class="white" justify="center">
                        <v-img
                          contain
                          max-height="60vh"
                          max-width="60vh"
                          :src="pageImage"
                        />
                      </v-row>

                      <v-row class="py-6 white" justify="center">
                        <v-btn
                          href="https://playgardenprep.com/online/"
                          color="accent"
                          width="250"
                          tile
                          x-large
                        >
                          Learn more
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-dialog>
                </v-row>
              </v-col>
            </v-row>

            <v-row class="mb-12">
              <div class="curt" />

              <v-img
                max-height="500"
                :src="require('assets/png/banner-girl.png')"
              >
                <v-row align="center" class="my-6" justify="end" no-gutters>
                  <v-col
                    class="shrink text-center text-sm-left"
                    cols="12"
                    sm=""
                  >
                    <v-img
                      max-height="100"
                      :width="$vuetify.breakpoint.xs ? null : '65%'"
                      :src="require('assets/svg/logo.svg')"
                    />

                    <h1 class="white--text">
                      Premier Online <br>
                      Preschool
                    </h1>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="white--text">
                          Offering children 2-4 years a private <br>
                          preschool experience at home!<br>
                        </v-list-item-title>

                        <v-list-item-title class="white--text">
                          – Private preschool curriculum
                        </v-list-item-title>

                        <v-list-item-title class="white--text">
                          – Lessons with certified teachers
                        </v-list-item-title>

                        <v-list-item-title class="white--text">
                          – Hands-on learning tools
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-btn
                      href="https://playgardenprep.com/online/"
                      color="accent"
                      width="250"
                      tile
                      x-large
                    >
                      Learn more
                    </v-btn>
                  </v-col>
                </v-row>
              </v-img>
            </v-row>

            <v-row justify="center">
              <div class="curt" />

              <v-col class="fill-height" cols="12" sm="4">
                <v-card class="mt-n12 pa-3" elevation="12" height="120">
                  <v-list-item three-line>
                    <v-img
                      class="ml-2"
                      contain
                      max-height="100"
                      max-width="100"
                      :src="
                        require('assets/svg/shared/best-kids-play-areas.svg')
                      "
                    />

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold ml-2 text-h6">
                        BEST KIDS’ <br>
                        PLAY AREAS
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        - Time Out New York
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>

              <v-col class="fill-height" cols="12" sm="4">
                <v-card class="mt-sm-n12 pa-3" elevation="12" height="120">
                  <v-list-item three-line>
                    <v-img
                      class="ml-2"
                      contain
                      max-height="100"
                      max-width="100"
                      :src="
                        require('assets/svg/shared/best-kids-play-space-in-ny.svg')
                      "
                    />

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold ml-2 text-h6">
                        BEST KIDS'<br>
                        PLAY SPACE IN NY
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        - Grubstreet
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>

              <v-col class="fill-height" cols="12" sm="4">
                <v-card class="mt-sm-n12 pa-3" elevation="12" height="120">
                  <v-list-item three-line>
                    <v-img
                      class="ml-2"
                      contain
                      max-height="100"
                      max-width="100"
                      :src="
                        require('assets/svg/shared/over-a-decade-of-experience.svg')
                      "
                    />

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold ml-2 text-h6">
                        OVER A DECADE <br>
                        OF EXPERIENCES
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-md-12 mt-12" justify="center" no-gutters>
              <v-col cols="12" sm="4" class="px-3">
                <p>
                  <underlined-title text="Instill an early love for learning" />
                </p>

                <p class="text-md-left text-sm-center">
                  Early education is the foundation for all future learning.
                  with over a decade of educating children in Manhattan,
                  Playgarden Prep now offers our proven preschool curriculum at
                  home!
                </p>

                <v-row justify="center" no-gutters>
                  <v-btn
                    href="https://playgardenprep.com/online/"
                    color="accent"
                    width="250"
                    tile
                    x-large
                  >
                    Learn more
                  </v-btn>
                </v-row>
              </v-col>

              <v-col cols="12" sm="">
                <v-row class="mt-6" no-gutters>
                  <v-col class="mt-0" cols="6" md="3">
                    <v-img
                      contain
                      max-height="150"
                      :src="require('assets/svg/shared/backpack.svg')"
                    />

                    <h4 class="font-weight-bold text-center text-h6">
                      1000+
                    </h4>

                    <h6 class="text-center">
                      Satisfied students
                    </h6>
                  </v-col>

                  <v-col class="mt-md-16" cols="6" md="3">
                    <v-img
                      contain
                      max-height="150"
                      :src="require('assets/svg/shared/succes-rate.svg')"
                    />

                    <h4 class="font-weight-bold text-center text-h6">
                      99%
                    </h4>

                    <h6 class="text-center">
                      Success rate
                    </h6>
                  </v-col>

                  <v-col class="mt-3 mt-md-0" cols="6" md="3">
                    <v-img
                      contain
                      max-height="150"
                      :src="require('assets/svg/shared/parent-rating.svg')"
                    />

                    <h4 class="font-weight-bold text-center text-h6">
                      4.9
                    </h4>

                    <h6 class="text-center">
                      Parent rating
                    </h6>
                  </v-col>

                  <v-col class="mt-3 mt-md-16" cols="6" md="3">
                    <v-img
                      contain
                      max-height="150"
                      :src="require('assets/svg/shared/based-on-science.svg')"
                    />

                    <h6 class="text-center">
                      Based on
                    </h6>

                    <h4 class="font-weight-bold text-center text-h6">
                      Science
                    </h4>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Slug',

  async asyncData ({ query, $axios }) {
    const { imageUrl, text, description, link } = await $axios.$get(
      `/social-sharings/${query.link}`
    )

    return {
      pageImage: imageUrl || require('assets/svg/shared/parent-rating.svg'),
      pageTitle: text,
      pageDescription: description,
      link
    }
  },

  data: vm => ({
    childName: 'Sophie',
    dialog: false,
    loading: false,
    slug: (vm.$route.params.slug || '').toLowerCase()
  }),

  computed: {
    isValidSlug () {
      switch (this.slug) {
        case 'puzzle':
        case 'worksheet':
        case 'patch':
          return true
      }

      return false
    }
  },

  created () {
    if (!this.isValidSlug) {
      return this.$router.push({ name: 'index' })
    }

    this.loading = false
  },

  methods: {
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    }
  },

  head () {
    return {
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.pageTitle
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.pageDescription
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.pageImage
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.pageTitle
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.link
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.pageTitle
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.pageDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.pageImage
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.pageImage
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.pageTitle
        },
        {
          hid: 'fb:app_id',
          property: 'fb:app_id',
          content: '639126580353169'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.main::v-deep {
  min-height: 500px;
}

.curt {
  width: 100%;
  height: 100px;
  background-color: #c2daa5;
}
</style>
