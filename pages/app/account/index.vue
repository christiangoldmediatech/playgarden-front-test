<template>
  <v-main>
    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="2" :class="{ 'fill-height': !isMobile }">
        <v-card
          :flat="isMobile"
          class="d-flex flex-column"
          :class="['text-center fill-height', { 'mobile-card': isMobile }]"
          color="#FFF5E7"
        >
          <div class="pt-md-12 d-flex flex-column align-center">
            <v-btn v-if="isMobile" text color="#F89838" class="mr-auto mt-4" @click="goToPrevPage">
              <v-icon>mdi-chevron-left</v-icon>
              Back
            </v-btn>

            <img
              class="d-inline"
              height="100px"
              src="@/assets/svg/account-profile-v2.svg"
            >

            <div class="account-section-title py-2">
              Account page
            </div>

            <div class="account-owner-name w-100 mt-5 py-3 mr-4">
              <h1>{{ fullName }}</h1>
            </div>

            <div class="w-100 px-4">
              <div class="account-green-dashed-line my-4"></div>
            </div>
          </div>

          <pg-select
            v-if="isMobile"
            :value="selectedRouteName"
            :items="filteredSections"
            solo
            background-color="#FFAF60"
            append-icon="mdi-chevron-down"
            class="px-2 white--text"
            item-value="routeName"
            data-test-id="mobile-account-page-select"
            @input="navigateToPage($event)"
          >
            <template v-slot:append>
              <v-icon color="white">
                mdi-chevron-down
              </v-icon>
            </template>
            <template #selection="{ item }">
              <div class="w-100 d-flex justify-center account-mobile-select pg-text-[#FFFFFF]">
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
            :data-test-id="`account-left-panel-${section.text}`"
            elevation="0"
            color="transparent"
            class="clickable account-item py-5 rounded-0"
            :class="{
              'account-item-selected': selectedRouteName === section.routeName,
              'account-item-logout': section.routeName === 'auth-logout',
              'disabled-link': disableLogout && section.routeName === 'auth-logout'
            }"
            @click="navigateToPage(section.routeName)"
          >
            {{ section.text }}
          </v-card>

          <div v-if="!hidePatch" class="background-patch pg-relative"></div>
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

    isLoadingMembershipInfo () {
      return this.$store.getters['account/getLoadingMembershipInfo']
    },

    isLoadingCaregiverInfo() {
      return this.$store.getters['account/getLoadingCaregiverInfo']
    },

    isLoadingNotifications() {
      return this.$store.getters['account/getLoadingNotifications']
    },

    isLoadingShippingAddressInfo() {
      return this.$store.getters['account/getLoadingShippingAddressInfo']
    },

    isLoadingStudentProfileInfo() {
      return this.$store.getters['account/getLoadingStudentProfileInfo']
    },

    disableLogout() {
      return this.isLoadingMembershipInfo || this.isLoadingCaregiverInfo || this.isLoadingNotifications || this.isLoadingShippingAddressInfo || this.isLoadingStudentProfileInfo
    },

    hidePatch() {
      return this.$vuetify.breakpoint.mdAndDown
    },

    fullName () {
      return this.userInfo.fullName // `${this.userInfo.firstName ?? ''} ${this.userInfo.lastName ?? ''}`.trim()
    },

    routeName () {
      return this.$route.name
    },

    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },

    sections () {
      return [
        { text: 'General', routeName: 'app-account-index', show: true },
        { text: 'Personal Information', routeName: 'app-account-index-personal', show: true },
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

  watch: {
    routeName() {
      this.selectedRouteName = this.routeName
    }
  },

  mounted() {
    this.selectedRouteName = this.routeName
  },

  methods: {
    goToPrevPage() {
      this.$router.go(-1)
    },
    navigateToPage (routeName) {
      this.selectedRouteName = routeName
      this.$router.push({ name: routeName })
    },
    mobileDrowpdownClasses (routeName) {
      const isLogoutBtn = routeName === 'auth-logout'

      return {
        'w-100 d-flex justify-center account-mobile-select': true,
        'pg-text-[#6c6c6c]': !isLogoutBtn,
        'pg-text-[#68C453]': isLogoutBtn
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';

.background-patch {
  width: 100%;
  background: #FFF5E7;
  height: 435px;
  margin-top: auto;
  bottom: -430px;
  box-shadow: 0px 3px 1px -1px rgba(0, 0, 0, 0.2), 0px 3px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 5px 0px rgba(0, 0, 0, 0.12);
}

.text-letter-spacing-1 {
  letter-spacing: 1px;
}

.account-section-title {
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  color: #F89838;
}

.account-owner-name {
  background-color: #A1DC85;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;

  h1 {
    font-family: 'Quicksand';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    color: #FFFFFF;
  }
}

.account-item {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #565454;
}

.account-item-selected {
  background-color: #FFAF60 !important;
  color: white;
}

.account-item-logout {
  text-decoration-line: underline;
  color: #68C453;
}

.disabled-link {
  pointer-events: none;
  opacity: 0.5;
}
</style>
