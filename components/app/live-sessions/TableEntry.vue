<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="lsess-table-entry clickable"
      :class="{
        'lsess-table-entry-active': isLive,
        'lsess-table-entry-scaled': hover
      }"
      @click.stop="openLink"
    >
      <div class="lsess-table-entry-live">
        <span v-if="isLive">Live</span>
        <img
          v-if="isLive"
          class="lsess-table-entry-live-icon mt-2 mr-2"
          src="@/assets/svg/sessions-active-camera.svg"
        >
        <img
          v-if="isFuture"
          class="lsess-table-entry-live-icon mt-2 mr-2"
          src="@/assets/svg/sessions-camera.svg"
        >
      </div>

      <v-row class="px-2" :title="entry.activityType.name">
        <v-col cols="12" md="4">
          <v-row align="center" class="fill-height">
            <v-img :src="entry.activityType.icon" />
          </v-row>
        </v-col>

        <v-col cols="12" md="8" class="shrink">
          <v-row align="center" class="fill-height overflow-hidden">
            <b>{{ entry.activityType.name }}</b>
          </v-row>
        </v-col>
      </v-row>

      <div>
        {{ title }}
      </div>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'TableEntry',

  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  computed: {
    isLive () {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      const end = new Date(this.entry.dateEnd)

      return (
        today.getTime() >= start.getTime() - 5 * 60 * 1000 &&
        today.getTime() <= end.getTime() + 5 * 60 * 1000
      )
    },

    isFuture () {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      return today.getTime() <= start.getTime()
    },

    title () {
      let str = this.entry.title.substr(0, 37).replace(/\s+$/, '')
      if (this.entry.title.lenght > str.length) {
        str += '...'
      }
      return str
    }
  },

  methods: {
    openLink () {
      this.$nuxt.$emit('open-entry-dialog', this.entry)
    }
  }
}
</script>

<style lang="scss" scoped>
.lsess {
  &-table {
    &-entry {
      position: relative;
      transition: transform 250ms;
      padding: 8px;
      width: 100%;
      height: 100%;
      &.v-card.v-sheet {
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.160784);
      }
      &-active {
        border: solid 3px #f89838;
      }
      &-live {
        position: absolute;
        top: 0px;
        right: 0px;
        display: flex;
        align-items: center;
        &-icon {
          width: 24px;
          height: 24px;
        }
      }
      &-type {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        margin-right: 8px;
        border: solid 3px #f2f2f2;
        object-fit: contain;
        object-position: center center;
      }
      &-title {
        font-size: 1.1rem;
        line-height: 1.25;
        font-weight: bold;
      }
      &-scaled {
        transform: scale(1.1);
        z-index: 1;
      }
    }
  }
}
</style>
