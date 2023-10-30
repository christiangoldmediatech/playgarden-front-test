<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)">
      <!-- Email -->
      <validation-provider
        v-slot="{ errors }"
        name="email"
        rules="required|email"
      >
        <pg-text-field
          v-model="draft.email"
          clearable
          :disabled="loading"
          :error-messages="errors"
          label="Email"
          :loading="loading"
          solo
          type="email"
          class="custom-text-field"
        />
      </validation-provider>

      <v-btn
        block
        color="green2"
        :disabled="invalid"
        :loading="loading"
        min-height="60"
        class="main-btn"
        type="submit"
        x-large
      >
        GET STARTED
      </v-btn>

      <v-row class="my-6" no-gutters>
        <v-col class="hr-line">
          <v-divider />
        </v-col>

        <v-col class="text-center">
          or
        </v-col>

        <v-col class="hr-line">
          <v-divider />
        </v-col>
      </v-row>

      <p class="login mt-8">
        <nuxt-link class="primary--text" :to="{ name: 'index' }">
          <span class="return-link">return to login</span>
        </nuxt-link>
      </p>
    </v-form>
  </validation-observer>
</template>

<script>
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'SignupEmailForm',

  mixins: [submittable],

  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    resetDraft () {
      this.draft = {
        email: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  color: var(--v-primary-base);
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}

.signup {
  font-size: 20px;

  span {
    color: var(--v-primary-base);
    text-transform: uppercase;
    font-weight: bold;
  }
}
.return-link {
  color:  var(--v-primary-base);
}
</style>
