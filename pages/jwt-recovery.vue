<template>
  <v-container fill-height fluid ma-0 pa-0>
    <v-row align="center" fill-height justify="center" ma-0 pa-0>
      <v-col
        class="text-center"
        cols="4"
      >
        <div>
          <img class="logo-img" src="@/assets/svg/logo.svg">
        </div>

        <v-progress-linear
          color="primary"
          indeterminate
          :size="20"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { hasSessionStorage } from '@/utils/window'

export default {
  layout: 'loading',

  name: 'JwtRecovery',

  async mounted () {
    if (hasSessionStorage()) {
      await this.restoreAuth()
    }

    if (this.$route.query.redirect) {
      this.$router.push(decodeURIComponent(this.$route.query.redirect))
    } else {
      this.$router.push({ name: 'index' })
    }
  },

  methods: {
    ...mapActions({
      restoreAuth: 'auth/restoreAuthFromSessionStorage'
    })
  },

  head () {
    return {
      title: 'Recover token'
    }
  }
}
</script>

<style scoped>
.logo-img {
  max-width: 200px;
}
</style>
