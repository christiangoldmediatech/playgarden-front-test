<template>
  <v-main>
    <v-container>
      <v-row align="start">
        <v-col cols="12" md="6">
          <underlined-title text="Account" />
          <p>Welcome back {{ userInfo.firstName }}! Here you can manage everything related to your account.</p>

          <div class="pr-6 image-bar mb-10">
            <v-img
              :src="require('@/assets/png/profile/child-profile-bkg.png')"
              contain
            />
          </div>

          <v-row no-gutters justify="end">
            <v-btn
              class="px-9 white--text"
              color="#f89838"
              :to="{ name: 'auth-logout' }"
            >
              LOG OUT
            </v-btn>
          </v-row>
        </v-col>

        <v-col>
          <child-form />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapGetters } from 'vuex'
import ChildForm from '@/components/forms/profile/ChildForm.vue'

export default {
  name: 'Profile',

  components: {
    ChildForm
  },

  data () {
    return {
      isLoading: false
    }
  },

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    })
  }
}
</script>

<style lang="scss" scoped>
.image-bar {
  position: relative;
  z-index: 1;
   &::after {
    width: 100%;
    position: absolute;
    bottom: -16px;
    content: "";
    z-index: -1;
    border-bottom: 32px solid var(--v-primary-base);
  }
}
</style>
