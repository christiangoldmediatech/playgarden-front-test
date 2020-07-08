<template>
  <v-alert
    v-model="alert"
    v-bind="$attrs"
    border="top"
    class="alert"
    :color="globalNotificationMessage.color"
    dismissible
    outlined
    transition="slide-x-reverse-transition"
    v-on="$listeners"
  >
    {{ globalNotificationMessage.message }}
  </v-alert>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NotifyEvent',

  data: () => ({
    alert: false
  }),

  computed: {
    ...mapGetters({
      globalNotificationMessage: 'getGlobalNotificationMessage'
    })
  },

  watch: {
    globalNotificationMessage (v) {
      if (v.message) {
        this.alert = true
      }
    }
  }
}
</script>

<style scoped>
.alert{
  position: fixed;
  bottom: 50px;
  right: 50px;
}
</style>
