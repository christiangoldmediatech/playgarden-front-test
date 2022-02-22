<template>
  <div class="next-patch-container">
    <v-sheet
      :class="['coming-up-next rounded-l pa-1', { 'shown': params.show }]"
      color="rgba(0, 0, 0, 0.74)"
      max-width="280"
      width="100%"
    >
      <v-list dark color="rgba(0,0,0,0)" dense>
        <v-list-item two-line>
          <v-list-item-avatar size="90" tile>
            <v-img :src="params.image" :aspect-ratio="1" contain />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold cbar-text text-left">
              <span class="wrap">{{ message }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-medium">
              <nuxt-link
                class="accent--text text-decoration-underline"
                :to="{ name: 'app-student-cubby-patches' }"
              >
                Go to patches
              </nuxt-link>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'NextPatch',

  props: {
    params: {
      type: Object,
      required: false,
      default: () => ({
        show: true,
        image: null,
        number: 3
      })
    }
  },

  computed: {
    message () {
      let message = 'WATCH THE NEXT'
      if (parseInt(this.params.number) > 1) {
        message += ` ${this.params.number} VIDEOS `
      } else {
        message += ' VIDEO '
      }

      message += 'AND WIN A PATCH!'

      return message
    }
  }
}
</script>

<style lang="scss" scoped>
.next-patch-container {
  position: relative;
  left: 100%;
  bottom: 16px;
}

.coming-up-next {
  transition: transform ease 1s, opacity ease 1s;
  transform: translate(0%);
  opacity: 0;
}

.shown {
  transform: translate(-100%);
  opacity: 1;
}

.wrap {
  white-space: pre-wrap;
}
</style>
