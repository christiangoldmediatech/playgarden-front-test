<template>
  <v-main>
    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="2" :class="{ 'fill-height': !isMobile }">
        <v-card
          :flat="isMobile"
          :class="['text-center fill-height', { 'mobile-card': isMobile }]"
        >
          <div class="py-12 mx-2">
            <img
              class="d-none d-sm-inline"
              height="161px"
              src="@/assets/svg/account-profile.svg"
            >

            <div class="text-h6 grey--text py-2">
              Account page
            </div>

            <underlined-title :text="fullName" font-size="32px" />
          </div>
          <pg-select
            v-if="isMobile"
            solo
            class="px-2"
            :value="selectedHref"
            :items="sections"
            item-value="href"
            @input="navigateToPage($event)"
          >
            <template v-slot:selection="{ item }">
              <div class="font-weight-medium text-uppercase">
                {{ item.text }}
              </div>
            </template>
          </pg-select>

          <v-card
            v-for="section in sections"
            v-else
            :key="section.text"
            elevation="2"
            :class="btnClasses(section.href)"
            @click="navigateToPage(section.href)"
          >
            {{ section.text }}
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" md="10">
        <div class="pa-2 px-sm-8 mx-sm-16 my-sm-8">
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
    sections: [
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
      return [
        'py-6 mb-3 text-uppercase font-weight-bold account-section',
        { 'primary white--text': this.selectedHref === href }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.v-sheet.v-card:not(.mobile-card) {
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
}
.account-section {
  color: #606060;
  letter-spacing: 0.96px;
  line-height: 30px;
}
</style>
