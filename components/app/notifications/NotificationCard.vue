<template>
  <div v-if="notificationCard.isVisible" :style="cardStyles">
    <v-card :width="isMobile ? '100%' : '525px'">
      <v-icon class="float-right pt-2 pr-2" @click="closeNotificationCard">
        mdi-close
      </v-icon>
      <v-row no-gutters class="py-4 pl-8">
        <v-col cols="2" class="d-none d-md-flex align-center justify-center pr-8">
          <img height="70px" :src="notificationCard.image">
        </v-col>

        <v-col cols="12" md="10">
          <underlined-title
            font-size="20px"
            font-size-mobile="20px"
            letter-spacing="3px"
            :text="notificationCard.title"
          />

          <div class="caption mt-4">
            {{ notificationCard.description }}
          </div>

          <div class="font-weight-bold grey--text body-2 mt-4">
            To learn more <span class="warning--text text-decoration-underline learn-more-text" @click="learnMore">
              click here
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UnderlinedTitle from '~/plugins/globalPartials/UnderlinedTitle.vue'
export default {
  name: 'NotificationCard',

  components: {
    UnderlinedTitle
  },

  computed: {
    ...mapState('notifications', ['notificationCard']),

    cardStyles () {
      return {
        position: 'fixed',
        top: this.isMobile ? '56px' : '100px',
        right: '0px',
        'z-index': 99
      }
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  methods: {
    learnMore () {
      try {
        this.notificationCard.action()
      } finally {
        this.closeNotificationCard()
      }
    },

    closeNotificationCard () {
      this.$store.commit('notifications/SET_NOTIFICATION_CARD', { isVisible: false })
    }
  }
}
</script>

<style lang="scss" scoped>
.float-right {
  float: right;
}

.learn-more-text {
  cursor: pointer;
}

.v-sheet.v-card {
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16) !important;
}
</style>
