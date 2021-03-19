<template>
  <v-row>
    <v-row no-gutters>
      <v-btn
        color="accent"
        nuxt
        text
        @click="backLogin"
      >
        <v-icon left>
          mdi-less-than
        </v-icon>

        Back
      </v-btn>
    </v-row>
    <v-col cols="12">
      <step-one />
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import StepOne from '@/components/app/register/StepOne'

export default {
  name: 'Parent',

  components: {
    StepOne
  },

  data: vm => ({}),

  computed: {},

  created () {},

  methods: {
    ...mapActions('auth', ['logout']),

    async backLogin () {
      await this.logout()
      this.$router.push({ name: 'index' })
    }
  }
}
</script>
