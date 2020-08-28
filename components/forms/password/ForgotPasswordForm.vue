<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)" class="row">
      <v-container>
        <!-- Email -->
        <validation-provider
          v-slot="{ errors }"
          name="Email"
          :rules="{
            required: !draft.phone,
            email: true
          }"
        >
          <v-text-field
            v-model="draft.email"
            clearable
            :disabled="loading || Boolean(draft.phone)"
            :error-messages="errors"
            label="Email"
            :loading="loading"
            solo
            type="email"
          />
        </validation-provider>

        <v-row class="my-3" no-gutters>
          <v-col>
            <span>
              <hr class="hr-forgot"></hr>
            </span>
          </v-col>
          <v-col cols="1" class="text-center">
            <span class="spanHr">
              or
            </span>
          </v-col>
          <v-col>
            <span>
              <hr class="hr-forgot"></hr>
            </span>
          </v-col>

          <v-col cols="12" class="data-phone">
            <!-- Phone -->
            <validation-provider
              v-slot="{ errors }"
              name="Phone"
              :rules="{
                required: !draft.email,
                min: 7,
                max: 20,
                phone: true
              }"
            >
              <v-text-field
                v-model="draft.phone"
                class="mt-9"
                clearable
                :disabled="loading || Boolean(draft.email)"
                :error-messages="errors"
                label="Phone"
                :loading="loading"
                maxlength="20"
                solo
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-btn
          block
          color="primary"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          SEND RECOVERY LINK
        </v-btn>

        <p class="login mt-8">
          <nuxt-link class="primary--text" :to="{ name: 'index' }">
            <span>return to login</span>
          </nuxt-link>
        </p>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script>
import submittable from '@/utils/mixins/submittable'

export default {
  name: 'ForgotPasswordForm',

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
        email: null,
        phone: null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hr-line {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
  color: $pg-main;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  font-size: 20px;
}

.signup {
  font-size: 20px;

  span {
    color: $pg-main;
    text-transform: uppercase;
    font-weight: bold;
  }
}

.margin-or {
  margin-left: 5px;
  margin-right: 5px;
}

.spanHr {
  margin-top: -11px !important;
  color: #989696;
  position: relative;
  top: -11px;
}
.hr-forgot {
  border-top: 2px solid #989696;
}
.data-phone {
  margin-top: -27px !important;
}
</style>
