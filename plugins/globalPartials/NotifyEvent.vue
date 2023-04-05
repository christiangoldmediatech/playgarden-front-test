<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  /**
   * This is just a simple wrapper for toast,
   * it just handles vuex events in a easy way,
   * you can still use this.$toast trough system components.
   * Remember import it into any layout you want to use it :).
   */
  name: 'NotifyEvent',

  computed: {
    ...mapGetters({
      globalNotificationMessage: 'getGlobalNotificationMessage'
    })
  },

  watch: {
    globalNotificationMessage ({
      body,
      config = {},
      title,
      type
    } = {}) {
      if (body && type) {
        this.$toast[type](body, title, config)
      }
    }
  }
}
</script>
