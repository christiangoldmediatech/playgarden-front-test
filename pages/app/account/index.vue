<template>
  <v-main>
    <v-row no-gutters class="fill-height">
      <v-col v-if="isMobile" cols="12" md="2">
        <v-card class="text-center fill-height" flat>
          <div class="text-h6 grey--text py-12 mx-2">
            <div class="pb-2">
              Account page
            </div>

            <underlined-title :text="fullName" font-size="32px" />
          </div>
          <pg-select
            solo
            class="px-8"
            :value="selectedHref"
            :items="btns"
            item-value="href"
            @input="navigateToPage($event)"
          >
            <template v-slot:selection="{ item }">
              <div class="font-weight-medium text-uppercase">
                {{ item.text }}
              </div>
            </template>
          </pg-select>
        </v-card>
      </v-col>
      <v-col v-if="!isMobile" cols="12" md="2" class="fill-height">
        <v-card class="text-center fill-height" elevation="12">
          <div class="text-h6 grey--text py-12">
            <div class="pb-2">
              Account page
            </div>

            <underlined-title :text="fullName" font-size="32px" />
          </div>
          <v-card
            v-for="btn in btns"
            :key="btn.text"
            elevation="3"
            :class="btnClasses(btn.href)"
            @click="navigateToPage(btn.href)"
          >
            {{ btn.text }}
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" md="10">
        <div class="pa-8 pa-sm-12">
          <nuxt-child />
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Index',

  data: () => ({
    btns: [
      { text: 'General', href: '/app/account/' },
      { text: 'Student Profile', href: '/app/account/student-profile' },
      { text: 'Membership', href: '/app/account/membership' },
      { text: 'Caregivers', href: '/app/account/caregiver' },
      { text: 'Notification', href: '/app/account/notification' }
    ],
    selectedHref: ''
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),
    fullName () {
      return `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    },
    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    }
  },

  mounted () {
    this.selectedHref = this.$route.path
  },

  methods: {
    navigateToPage (href) {
      this.selectedHref = href
      this.$router.push(href)
    },
    btnClasses (href) {
      return {
        'py-4 mb-6 text-uppercase font-weight-medium': true,
        'primary white--text': this.selectedHref === href
      }
    }
  }
}
</script>
