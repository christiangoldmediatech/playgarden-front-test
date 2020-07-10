<template>
  <v-form
    ref="userProfileForm"
    v-model="isValidForm"
  >
    <p class="general-text">
      GENERAL
    </p>

    <!-- Fullname -->
    <v-text-field
      ref="fullName"
      v-model="user.fullName"
      :loading="loading"
      prefix="Parent’s Name:"
      :readonly="modeForm === 'read' ? true : false"
      solo
      type="text"
    />

    <!-- Email -->
    <v-text-field
      v-model="user.email"
      :loading="loading"
      prefix="Email:"
      readonly
      solo
      type="email"
    />

    <!-- Phone number -->
    <v-text-field
      v-model="user.phoneNumber"
      :loading="loading"
      prefix="Phone number:"
      :readonly="modeForm === 'read' ? true : false"
      solo
      type="text"
    />

    <v-row justify="end">
      <label class="edit-text mr-4" @click="toggleModeForm">{{ modeForm === 'read' ? 'EDIT' : 'SAVE' }}</label>
      <label class="change-password-text">CHANGE PASSWORD</label>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: 'UserProfileForm',
  props: {
    user: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      isValidForm: true,
      modeForm: 'read'
    }
  },
  computed: {
    //
  },
  mounted () {
    // eslint-disable-next-line no-console
    // console.log(this.user)
  },
  methods: {
    toggleModeForm () {
      if (this.modeForm === 'read') {
        this.modeForm = 'edit'
        this.$refs.fullName.focus()
      } else {
        this.modeForm = 'read'
        this.updateLoggedUserData()
      }
    },
    async updateLoggedUserData () {
      try {
        this.$emit('set-loading-state', true)
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.patch(`${process.env.apiBaseUrl}/auth/me/edit`, this.user)

        // eslint-disable-next-line no-console
        console.log(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.$emit('set-loading-state', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.general-text {
  width: 172px;
  height: 45px;
  font-family: Poppins;
  font-size: 32px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 4.8px;
  text-align: left;
  color: $pg-black;
}
.input-text {
  color: $pg-black;
}
.edit-text {
  font-weight: bold;
  font-size: 18px;
  color: $pg-accent;
  cursor: pointer;
}
.change-password-text {
  font-weight: bold;
  font-size: 18px;
  color: #c2daa5;
  cursor: pointer;
}
</style>
