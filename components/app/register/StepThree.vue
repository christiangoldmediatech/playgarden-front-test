<template>
  <v-row no-gutters>
    <v-col>
      <v-row
        class="flex-column flex-md-row"
        justify="center"
        no-gutters
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            max-width="550"
            :src="require('@/assets/svg/child-information.svg')"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <short-register-form :loading="loading" @click:submit="onSubmit" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

import ShortRegisterForm from '@/components/forms/children/ShortRegisterForm.vue'

export default {
  name: 'StepThree',

  components: {
    ShortRegisterForm
  },

  data: () => ({
    loading: false
  }),

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('children', {
      storeChildren: 'store',
      updateChild: 'update'
    }),

    goToLessons () {
      this.$router.push({
        name: 'app-onboarding'
      })
    },

    async onSubmit (children) {
      this.loading = true

      try {
        await Promise.all(
          children.map(child =>
            child.id
              ? this.updateChild({ id: child.id, params: child })
              : this.storeChildren(child)
          )
        )

        await this.fetchUserInfo()

        this.$snotify.success('Children have been stored successfully!')
        this.goToLessons()
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
