<template>
  <v-col class="fill-height">
    <v-row
      class="mt-0 mt-md-0"
      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      no-gutters
    >
      <v-col cols="12" md="6" sm="12">
        <v-img
          alt="Educational Playdates"
          :src="require('@/assets/png/playdates/playdate.png')"
          class="align-center mr-md-15"
        />
      </v-col>

      <v-col cols="12" md="6" sm="12">
        <underlined-title text="Educational Playdates!" />

        <p>You just can create or join one playdate per week</p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Join',

  data: vm => ({
    issuer: {},

    loading: false,

    token: vm.$route.query.token
  }),

  created () {
    if (this.token) {
      this.onToken()
    } else {
      this.$router.push('app-playdates')
    }
  },

  methods: {
    ...mapActions('auth', ['setPlaydateInvitationToken']),

    ...mapActions('playdates', [
      'acceptInvitePlaydate',
      'deletePlaydateInvitation',
      'getPlaydateInvite'
    ]),

    cleanToken () {
      this.setPlaydateInvitationToken()

      this.$router.push('app-playdates')
    },

    async onAction (message, action) {
      await action(this.token)

      this.$snotify.success(
        `Your Playdate invitation has been ${message} successfully!.`
      )

      this.cleanToken()
    },

    async onAccept () {
      this.loading = true

      try {
        await this.onAction('stored', this.acceptInvitePlaydate)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onCancel () {
      this.loading = true

      try {
        await this.onAction('deleted', this.deletePlaydateInvitation)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onToken () {
      this.loading = true

      try {
        const { user = {} } = await this.getPlaydateInvite(this.token)

        this.issuer = user
      } catch (e) {
        this.cleanToken()

        await this.$router.push('app-playdates')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
