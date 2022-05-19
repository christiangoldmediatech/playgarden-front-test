<template>
  <v-main>
    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="2" :class="{ 'fill-height': !isMobile }">
        <v-card
          :flat="isMobile"
          :class="['text-center fill-height', { 'mobile-card': isMobile }]"
        >
          <div class="py-md-12 py-2 mx-2">
            <img
              class="d-none d-sm-inline"
              height="100px"
              src="@/assets/svg/account-profile.svg"
            >

            <div class="text-h6 grey--text py-2">
              Account page
            </div>

            <underlined-title :text="fullName" font-size="32px" />
          </div>

          <pg-select
            v-if="isMobile"
            :value="selectedRouteName"
            :items="filteredSections"
            solo
            class="px-2"
            item-value="routeName"
            data-test-id="mobile-account-page-select"
            @input="navigateToPage($event)"
          >
            <template #selection="{ item }">
              <div :class="mobileDrowpdownClasses(item.routeName)">
                {{ item.text }}
              </div>
            </template>

            <template #item="{ item }">
              <div :class="mobileDrowpdownClasses(item.routeName)">
                {{ item.text }}
              </div>
            </template>
          </pg-select>

          <v-card
            v-for="section in filteredSections"
            v-else
            :key="section.text"
            :class="btnClasses(section.routeName)"
            :data-test-id="`account-left-panel-${section.text}`"
            elevation="2"
            @click="navigateToPage(section.routeName)"
          >
            {{ section.text }}
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" md="10">
        <div class="pa-2 mx-md-10 mx-lg-16 my-md-8 px-lg-8">
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
    selectedRouteName: ''
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),

    ...mapGetters('auth', ['isUserCaregiver']),

    fullName () {
      return this.userInfo.fullName // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    },

    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },

    sections () {
      return [
        { text: 'General', routeName: 'app-account-index', show: true },
        { text: 'Student Profile', routeName: 'app-account-index-student-profile', show: true },
        { text: 'Membership', routeName: 'app-account-index-membership', show: !this.isUserCaregiver },
        { text: 'Caregivers', routeName: 'app-account-index-caregiver', show: !this.isUserCaregiver },
        { text: 'Notifications', routeName: 'app-account-index-notification', show: !this.isUserCaregiver },
        { text: 'Logout', routeName: 'auth-logout', show: true }
      ]
    },

    filteredSections () {
      return this.sections.filter(section => section.show)
    }
  },

  mounted () {
    this.selectedRouteName = this.$route.name
  },

  methods: {
    navigateToPage (routeName) {
      this.selectedRouteName = routeName
      this.$router.push({ name: routeName })
    },
    btnClasses (routeName) {
      const isSelectedRoute = this.selectedRouteName === routeName
      const isLogoutBtn = routeName === 'auth-logout'

      return {
        'py-7 mb-3 text-uppercase font-weight-bold text-letter-spacing-1': true,
        'grey--text text--darken-2': !isSelectedRoute && !isLogoutBtn,
        'primary white--text': isSelectedRoute,
        'orange--text': isLogoutBtn
      }
    },
    mobileDrowpdownClasses (routeName) {
      const isLogoutBtn = routeName === 'auth-logout'

      return {
        'font-weight-bold text-uppercase': true,
        'grey--text text--darken-2': !isLogoutBtn,
        'orange--text': isLogoutBtn
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-sheet.v-card:not(.mobile-card) {
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
}
.text-letter-spacing-1 {
  letter-spacing: 1px;
}
</style>
