<template>
  <v-row>
    <v-col>
      <v-row
        class="flex-column flex-md-row mt-3"
        justify="center"
      >
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            v-if="$vuetify.breakpoint.smAndUp"
            max-width="550"
            :src="require('@/assets/svg/child-information.svg')"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
          sm="12"
          xs="12"
          :class="{ 'mt-n14 px-8': !$vuetify.breakpoint.smAndUp }"
        >
          <short-register-form :class="{ 'px-2': !$vuetify.breakpoint.smAndUp }" :loading="loading" @click:submit="onSubmit" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import {
  defineComponent,
  useRoute
} from '@nuxtjs/composition-api'

import { useUTM } from '@/composables/utm/use-utm.composable'
import ShortRegisterForm from '@/components/forms/children/ShortRegisterForm.vue'

export default defineComponent({
  name: 'StepThree',

  components: {
    ShortRegisterForm
  },

  data: () => ({
    loading: false
  }),

  setup() {
    const route = useRoute()
    const utmContent = useUTM({ route: route.value })

    return {
      utmContent
    }
  },

  methods: {
    ...mapActions('auth', ['fetchUserInfo']),

    ...mapActions('children', {
      storeChildren: 'store',
      updateChild: 'update'
    }),

    goToLessons () {
      this.$router.push({
        name: 'app-onboarding',
        query: {
          ...this.utmContent
        }
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
})
</script>
