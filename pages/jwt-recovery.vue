<template>
  <v-container ma-0 pa-0 fluid fill-height>
    <v-row ma-0 pa-0 justify="center" align="center" fill-height>
      <v-col
        class="text-center"
        cols="4"
      >
        <div>
          <img class="logo-img" src="@/assets/svg/logo.svg">
        </div>
        <v-progress-linear
          :size="20"
          color="primary"
          indeterminate
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
  async mounted () {
    if (hasSessionStorage()) {
      await this.restoreAuth()
    }
    if (this.$route.query.redirect) {
      this.$router.push(decodeURIComponent(this.$route.query.redirect))
    } else {
      this.$router.push('/')
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
