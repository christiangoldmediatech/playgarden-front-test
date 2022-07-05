<template>
  <v-app class="pg-app">
    <template v-if="showContent">
      <v-navigation-drawer
        v-model="appDrawer"
        app
        :permanent="$vuetify.breakpoint.mdAndUp"
        width="296"
      >
        <!-- Logo -->
        <v-container fluid>
          <v-row class="px-6 py-2 py-md-7">
            <span class="font-weight-medium logo-text pl-4">Web Admin</span>

            <img
              alt="Playgarden Prep Online Logo"
              class="logo"
              src="@/assets/svg/logo.svg"
            >
          </v-row>
          <v-row justify="center">
            <span class="black--text mr-2 text--lighten-1">
              {{ userInfo.fullName }}
            </span>
          </v-row>
        </v-container>

        <v-divider />

        <!-- Menu -->
        <v-list v-if="userInfo.role.name === 'SUPER_ADMINISTRATORS'">
          <menu-item
            v-for="(item, indexMI) in menuItems"
            :key="indexMI"
            :item="item"
          />
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app clipped-left color="primary" dark elevation="0">
        <v-app-bar-nav-icon
          class="app-bar-style"
          @click.stop="appDrawer = !appDrawer"
        />

        <v-toolbar-title class="d-flex flex-column hidden-md-and-up">
          <!-- PlayGarden Prep Online - Web Admin -->
          <span class="font-weight-medium navbar-logo-text pl-4">Web Admin</span>

          <img
            alt="Playarden Prep Online Logo"
            class="navbar-logo"
            src="@/assets/svg/logo.svg"
          >
        </v-toolbar-title>

        <v-spacer />

        <v-btn class="hidden-md-and-up" icon nuxt :to="{ name: 'auth-logout' }">
          <v-icon>
            mdi-logout
          </v-icon>
        </v-btn>

        <v-menu class="mr-4">
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip top>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  text
                  color="font-weight-medium white primary--text text--darken-2 text-none"
                  dark
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  <v-progress-circular
                    v-if="uploadingVideos.length > 0"
                    indeterminate
                    color="amber"
                  />
                  <span class="notification-videos">{{ uploadingVideos.length }}</span>
                  <v-icon>
                    mdi-bell
                  </v-icon>
                </v-btn>
              </template>
              <span>Status Videos</span>
            </v-tooltip>
          </template>
          <v-list dense class="mt-8">
            <v-subheader>Notifications</v-subheader>
            <v-divider />
            <v-list v-if="uploadingVideos.length > 0" class="content-notification">
              <v-list-item
                v-for="(item, index) in uploadingVideos"
                :key="index"
              >
                <v-list-item-avatar>
                  <v-icon>
                    mdi-video
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Status: {{ item.status }}
                  </v-list-item-subtitle>
                  <v-divider />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list>
        </v-menu>

        <v-btn
          class="hidden-sm-and-down"
          color="font-weight-medium white primary--text text--darken-2 text-none"
          depressed
          nuxt
          :to="{ name: 'auth-logout' }"
        >
          Log out
        </v-btn>
      </v-app-bar>

      <v-main class="pg-bkg">
        <nuxt />
      </v-main>

      <notify-event />

      <prompt-dialog />

      <admin-snack-bar />

      <video-preview />

      <grades-editor-dialog />
    </template>

    <template v-else>
      <v-main>
        <v-container fill-height fluid>
          <pg-loading />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import VideoPreview from '@/components/admin/video-preview/VideoPreview.vue'
import AdminSnackBar from '@/components/admin/AdminSnackBar.vue'
import GradesEditorDialog from '@/components/admin/grades/GradesEditorDialog.vue'
import MenuItem from '@/components/admin/MenuItem'

export default {
  name: 'Admin',

  components: {
    AdminSnackBar,
    GradesEditorDialog,
    MenuItem,
    VideoPreview
  },

  data () {
    return {
      appDrawer: false,

      checkStatusInterval: null,

      menuItems: [
        {
          icon: 'mdi-chart-bar',
          title: 'Dashboard',
          route: '/admin/dashboard'
        },
        {
          icon: 'mdi-television-play',
          title: 'Activities management',
          route: '/admin/activity-management'
        },
        {
          icon: 'mdi-teach',
          title: 'Curriculum management',
          route: '/admin/curriculum-management'
        },
        {
          icon: 'mdi-phone',
          title: 'Live Classes Management',
          route: '/admin/live-session-management'
        },
        {
          icon: 'mdi-google-circles-extended',
          title: 'Recurring Meetings',
          route: '/admin/recurring-live-sessions-management'
        },
        {
          icon: 'mdi-filmstrip',
          title: 'Kids corner videos',
          route: '/admin/kids-corner-videos'
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          rootPath: '/admin/settings',
          children: [
            {
              title: 'General',
              rootPath: '/general',
              children: [
                {
                  title: 'Coupon Management',
                  route: 'coupon-management'
                },
                {
                  title: 'Notification Management',
                  route: 'notification-management'
                },
                {
                  title: 'Privacy Policy Management',
                  route: 'privacy-policy-management'
                },
                {
                  title: 'Plans Management',
                  route: 'plan-management'
                }
              ]
            },
            {
              title: 'Lesson Configurations',
              rootPath: '/lesson-configurations',
              children: [
                {
                  title: 'Activity Types',
                  route: 'activity-types'
                },
                {
                  title: 'Curriculum Types',
                  route: 'curriculum-types'
                },
                {
                  title: 'Offline Worksheet Categories',
                  route: 'offline-worksheet-categories'
                },
                {
                  title: 'Onboarding Management',
                  route: 'onboarding'
                },
                {
                  title: 'Report Card Types',
                  route: 'report-card-types'
                }
              ]
            },
            {
              title: 'Student Cubby',
              rootPath: '/student-cubby',
              children: [
                {
                  title: 'Backpack Management',
                  route: 'backpack-management'
                },
                {
                  title: 'Patch Management',
                  route: 'patch-management'
                },
                {
                  title: 'Puzzle Management',
                  route: 'puzzle-management'
                }
              ]
            }
          ]
        },
        {
          icon: 'mdi-account',
          title: 'User manager',
          rootPath: '/admin/user-manager',
          children: [
            {
              title: 'All Users',
              route: ''
            },
            {
              title: 'Parents',
              route: 'parents-list'
            },
            {
              title: 'Specialists',
              route: 'specialists-management'
            },
            {
              title: 'Role Management',
              route: 'role-management'
            },
            {
              title: 'Children',
              route: 'children-list'
            }
          ]
        },
        {
          icon: 'mdi-logout',
          title: 'Log out',
          route: '/auth/logout'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),
    ...mapState('admin', ['uploadingVideos']),
    ...mapState(['showContent'])
  },

  mounted () {
    this.getVideos()
    this.checkStatus()

    this.$store.commit('SET_SHOW_CONTENT', true)
  },

  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('admin', {
      getVideos: 'getVideosUploading'
    }),

    checkStatus () {
      this.checkStatusInterval = setInterval(() => {
        this.getVideos()
      }, 60000)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application ::v-deep {
  .row {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .container:not(.container--fluid) {
    max-width: 1200px;
  }

  .v-data-footer {
    border: none;
  }

  .v-data-table tr > td,
  thead > tr > th {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.12) !important;
  }

  .v-data-table tr > td:not(:last-child),
  thead > tr > th:not(:last-child) {
    border-right: 1px dashed rgba(0, 0, 0, 0.12) !important;
  }

  header.v-app-bar {
    background-image: linear-gradient(
      to bottom,
      #d3f5a8 -132%,
      var(--v-primary-base) 202%
    ) !important;
    background-color: transparent !important;
  }

  .navbar-logo {
    max-height: 32px;
  }

  .logo {
    max-width: 100%;
  }

  .logo-text {
    color: #78c383 !important;
  }

  .navbar-logo-text {
    color: #78c383 !important;
    font-size: 12px;
  }

  .pg-app {
    height: 100%;
    margin: 0 auto;
  }

  .pg-bkg {
    background-color: #f9f9f9 !important;
  }
  .v-text-field .v-input__control .v-input__slot {
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16) !important;
  }
  .notification-videos {
    color: var(--v-black-base) !important;
  }
  .content-notification {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
