<template>
  <v-main class="main">
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />
    <v-container class="pt-0" :class="{ 'fill-height': loading }" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <pg-loading v-if="loading" />

          <template v-else>
            <v-row
              class="px-5 py-12 ml-md-16"
              :class="{
                'flex-column-reverse flex-md-column': $vuetify.breakpoint.xs
              }"
              no-gutters
            >
              <v-col cols="12" md="5" class="align-self-center">
                <v-row justify="center">
                  <v-col cols="12">
                    <underlined-title
                      class="hidden-sm-and-down text-sm-h4"
                      :text="pageTitle"
                    />

                    <p class="mt-6 text-md-left text-sm-center">
                      {{ pageDescription }}
                    </p>

                    <v-row justify="center" no-gutters justify-sm="end">
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
                </v-row>
              </v-col>

              <v-col cols="12" md="7">
                <v-row justify="center" no-gutters>
                  <v-col cols="12">
                    <p class="hidden-md-and-up text-center">
                      <underlined-title :text="pageTitle" class=" text-sm-h6" />
                    </p>
                  </v-col>

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
                        max-width="350"
                        :src="imageShared"
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
                          max-height="500"
                          max-width="500"
                          :src="imageShared"
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

            <v-row>
              <div class="green-line green-line-1" />
              <div class="green-line green-line-2" />

              <v-img
                max-height="500"
                :src="require('assets/png/banner-girl.png')"
              >
                <v-row align="center" class="my-10" justify="center" no-gutters>
                  <v-col cols="6" class="hidden-sm-and-down" />

                  <v-col class="shrink text-center" cols="12" sm="" xs="12">
                    <v-img
                      max-height="100"
                      :width="$vuetify.breakpoint.xs ? null : '75%'"
                      :src="require('assets/svg/logo.svg')"
                      class="ml-6 mr-6"
                    />

                    <v-row justify="center" no-gutters>
                      <v-col cols="12" sm="" xs="12" class="text-sm-center text-md-left">
                        <underlined-title
                          text="Premier Online Preschool"
                          class="white--text text-left"
                        />
                      </v-col>
                    </v-row>

                    <v-row justify="center" no-gutters justify-sm="start">
                      <h3 class="white--text font-weight-regular text-sm-center text-md-left">
                        Offering children 2-4 years a<br>
                        private preschool experience at home!<br>
                      </h3>

                      <v-row justify="center" no-gutters justify-sm="start">
                        <p class="white--text text-left mt-5">
                          – Private preschool curriculum<br>
                          – Lessons with certified teachers<br>
                          – Hands-on learning tools<br>
                        </p>

                        <v-row justify="center" no-gutters justify-sm="start">
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
                      </v-row>
                    </v-row>
                  </v-col>
                </v-row>
              </v-img>
            </v-row>

            <v-row justify="center">
              <div class="curt mb-n16" />

              <v-col class="fill-height shrink">
                <v-card class="pa-3" elevation="10" height="150" width="400">
                  <v-list-item class="fill-height" three-line>
                    <v-img
                      class="ml-2"
                      contain
                      max-height="96"
                      max-width="96"
                      :src="
                        require('assets/svg/shared/best-kids-play-areas.svg')
                      "
                    />

                    <v-list-item-content class="d-flex fill-height">
                      <v-list-item-title
                        class="align-self-start font-weight-bold ml-2 text-6"
                      >
                        BEST KIDS’ <br>
                        PLAY AREAS
                      </v-list-item-title>

                      <v-list-item-subtitle class="align-self-end text-right">
                        - Time Out New York
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>

              <v-col class="fill-height shrink">
                <v-card class="pa-3" elevation="10" height="150" width="400">
                  <v-list-item class="fill-height" three-line>
                    <v-img
                      class="ml-2 mt-n4"
                      contain
                      max-height="96"
                      max-width="96"
                      :src="
                        require('assets/svg/shared/best-kids-play-space-in-ny.svg')
                      "
                    />

                    <v-list-item-content class="d-flex fill-height">
                      <v-list-item-title
                        class="align-self-start font-weight-bold ml-2 text-6"
                      >
                        BEST <br>
                        CHILDREN'S<br>
                        PLAY SPACE IN<br>
                        NYC
                      </v-list-item-title>

                      <v-list-item-subtitle class="align-self-end text-right">
                        - Grubstreet
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>

              <v-col class="fill-height shrink">
                <v-card class="pa-3" elevation="10" height="150" width="400">
                  <v-list-item class="fill-height" three-line>
                    <v-img
                      class="ml-2"
                      contain
                      max-height="96"
                      max-width="96"
                      :src="
                        require('assets/svg/shared/over-a-decade-of-experience.svg')
                      "
                    />

                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold ml-2 text-6">
                        OVER A DECADE <br>
                        OF EXPERIENCE
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="my-12" justify="center">
              <v-col class="pl-3 pl-md-0 ml-md-n16" cols="12" md="4">
                <v-row justify="center" class="ml-md-n16">
                  <v-col cols="12" md="8" sm="12">
                    <p class="text-md-left text-center">
                      <underlined-title
                        text="Instill an early love for learning"
                        class="text-sm-h6 text-md-h4"
                      />
                    </p>

                    <p class="text-md-left text-center text-sm-subtitle-1">
                      We believe early education provides the foundation for all
                      future learning. We provide a variety of visual and hands-
                      on learning for ages 2 to 4 years to promote whole-child
                      development.!
                    </p>

                    <v-row
                      justify="center"
                      no-gutters
                      justify-sm="end"
                      class="hidden-sm-and-down"
                    >
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
                </v-row>
              </v-col>

              <v-col class="mt-0 shrink" cols="6" md="">
                <v-row justify="center">
                  <v-img
                    contain
                    height="150"
                    width="150"
                    :src="require('assets/svg/shared/backpack.svg')"
                  />
                </v-row>

                <h4 class="font-weight-bold text-center text-h5">
                  1000+
                </h4>

                <h6 class="text-center">
                  Satisfied students
                </h6>
              </v-col>

              <v-col class="mt-md-16 shrink ml-md-6" cols="6" md="">
                <v-row justify="center">
                  <v-img
                    contain
                    height="150"
                    width="150"
                    :src="require('assets/svg/shared/succes-rate.svg')"
                  />
                </v-row>

                <h4 class="font-weight-bold text-center text-h5">
                  99%
                </h4>

                <h6 class="text-center">
                  Success rate
                </h6>
              </v-col>

              <v-col class="mt-3 mt-md-0 shrink ml-md-6" cols="6" md="">
                <v-row justify="center">
                  <v-img
                    contain
                    height="150"
                    width="150"
                    :src="require('assets/svg/shared/parent-rating.svg')"
                  />
                </v-row>

                <h4 class="font-weight-bold text-center text-h5">
                  4.9
                </h4>

                <h6 class="text-center">
                  Parent rating
                </h6>
              </v-col>

              <v-col class="mt-3 mt-md-16 shrink ml-md-6" cols="6" md="">
                <v-row justify="center">
                  <v-img
                    contain
                    height="150"
                    width="150"
                    :src="require('assets/svg/shared/based-on-science.svg')"
                  />
                </v-row>

                <h6 class="text-center">
                  Based on
                </h6>

                <h4 class="font-weight-bold text-center text-h5">
                  Science
                </h4>
              </v-col>
            </v-row>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapActions } from 'vuex'

import { hasLocalStorage } from '@/utils/window'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'Slug',

  async asyncData ({ redirect, query, $axios, params, route }) {
    const slug = (() => {
      switch ((params.slug || '').toLowerCase()) {
        case 'puzzle':
          return 'puzzle'
        case 'worksheet':
          return 'worksheet'
        case 'patch':
          return 'patch'
      }

      return false
    })()

    if (!slug) {
      return redirect({ name: 'index' })
    }

    try {
      const { imageUrl, text, description } = await $axios.$get(
        `/social-sharings/${query.link}`
      )

      let pageImage = require(`assets/png/shared/${slug}.png`)

      if (process.env.testEnv === 'production') {
        pageImage = pageImage.substr(4) // removes '/app' from the url
      }

      return {
        pageFullRoutePath: process.env.frontendUrl.slice(0, -1) + route.fullPath,
        imageShared: imageUrl || require('assets/svg/shared/parent-rating.svg'),
        pageImage,
        pageTitle: text,
        pageDescription: description
      }
    } catch (e) {
      return redirect({ name: 'index' })
    }
  },

  data: () => ({
    childName: 'Sophie',
    dialog: false,
    loading: false,
    frontendUrl: process.env.frontendUrl.slice(0, -1)
  }),

  async created () {
    // restoring session
    if (hasLocalStorage()) {
      try {
        const isLoggedIn = await this.checkAuth()

        // If the user is not authenticated check if we can restore his session
        if (!isLoggedIn) {
          await this.restoreAuth()
        }

        this.disableAxiosGlobal()
        await this.fetchUserInfo()
        this.enableAxiosGlobal()
      } catch (e) {}
    }

    this.loading = false
  },

  methods: {
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('auth', {
      checkAuth: 'checkAuth',
      fetchUserInfo: 'fetchUserInfo',
      restoreAuth: 'restoreAuthFromSessionStorage'
    }),

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
          hid: 'fb:app_id',
          property: 'fb:app_id',
          content: '639126580353169'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.pageDescription
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.frontendUrl + this.pageImage
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.pageTitle
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.frontendUrl + this.pageImage
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.pageTitle
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: this.frontendUrl
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.pageFullRoutePath
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          hid: 'twitter:domain',
          name: 'twitter:domain',
          content: this.frontendUrl
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.pageTitle
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

.space-text {
  margin-left: 40%;
}
</style>
