<template>
  <v-col class="fill-height">
    <v-row
      class="mt-0 mt-md-0"
      :class="{ mobile: $vuetify.breakpoint.smAndDown }"
      no-gutters
    >
      <underlined-title text="Educational Playdates!" />
    </v-row>

    <v-row>
      <card-playdate joining :playdate="playdateComputed">
        <template v-slot:button>
          <v-row no-gutters>
            <v-col class="pl-4">
              <v-row justify="center" justify-md="start" no-gutters>
                <v-col>
                  <span class="font-weight-bold text--h6">
                    What's a Playdate?
                  </span>

                  <p>
                    A playdate is a place where uoyr child can have fun with
                    their friends while they have fun playing, all supervised by
                    a specialist.
                  </p>
                </v-col>
              </v-row>

              <v-row class="my-3" justify="center">
                <v-btn
                  class="white--text text-transform-none"
                  color="accent"
                  width="250"
                  large
                  @click="onAccept"
                >
                  Join this playdate!
                </v-btn>
              </v-row>

              <v-row justify="center">
                <v-btn
                  class="text-transform-none"
                  color="accent"
                  width="250"
                  large
                  text
                  @click="onCancel"
                >
                  Cancel this invitation
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </card-playdate>
    </v-row>
  </v-col>
</template>

<script>
import { get } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { TAG_MANAGER_EVENTS } from '@/models'

import CardPlaydate from '@/components/app/playdates/CardPlaydate'

export default {
  name: 'Join',

  components: { CardPlaydate },

  data: vm => ({
    inviteId: null,
    playdate: {},

    loading: false,

    token: vm.$route.query.token
  }),

  computed: {
    ...mapGetters('auth', ['getUserInfo']),

    playdateComputed () {
      return {
        ...this.playdate,
        children: get(this.playdate, 'playdatesChildrens.0.children')
      }
    }
  },

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

      this.$router.push({ name: 'app-playdates' })
    },

    async onAction (message, action, token) {
      await action(token)

      this.$snotify.success(
        `Your Playdate invitation has been ${message} successfully!.`
      )

      this.cleanToken()
    },

    async onAccept () {
      this.loading = true

      try {
        this.$gtm.push({
          event: TAG_MANAGER_EVENTS.PLAYDATE_JOIN,
          userId: this.getUserInfo.id
        })
        await this.onAction('stored', this.acceptInvitePlaydate, this.token)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onCancel () {
      this.loading = true

      try {
        await this.onAction(
          'deleted',
          this.deletePlaydateInvitation,
          this.inviteId
        )
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async onToken () {
      this.loading = true

      try {
        const {
          id,
          email,
          phone,
          playdate = {},
          user = {}
        } = await this.getPlaydateInvite(this.token)

        this.inviteId = id
        this.playdate = playdate

        if (
          user.email === this.getUserInfo.email ||
          (this.getUserInfo.email !== email &&
            this.getUserInfo.phoneNumber !== phone)
        ) {
          return this.$router.push({ name: 'app-playdates' })
        }
      } catch (e) {
        this.cleanToken()

        await this.$router.push({ name: 'app-playdates' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
