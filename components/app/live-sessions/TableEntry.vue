<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :disabled="block"
      class="lsess-table-entry ma-1 clickable pg-relative"
      :class="{
        'lsess-table-entry-active': isLive,
        'lsess-table-entry-scaled': hover,
        opacity: !entry.active
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

      <v-row class="px-2 my-0" align="end" :title="entry.activityType.name">
        <img
          class="lsess-table-entry-type ml-1 mt-1"
          :src="entry.activityType.icon"
        >

        <div class="pl-md-2 pl-lg-3 pl-xl-4">
          <v-row align="center" class="fill-height overflow-hidden my-0">
            <div>
              <b>{{ entry.activityType.name }}</b><br>
              {{ time }}
            </div>
          </v-row>
        </div>
      </v-row>

      <v-card-actions>
        {{ title }}
      </v-card-actions>

      <!-- Play & Learn lock -->
      <div
        v-if="!userHasAccess"
        class="locked-overlay pg-flex pg-flex-col pg-justify-center pg-items-center pg-text-center pg-tracking-wide"
      >
        <div class="lock pg-mb-1" />

        <span class="pg-font-bold pg-text-sm">To unlock</span>

        <span
          class="pg-text-accent pg-font-bold pg-underline pg-text-base pg-leading-tight"
        >
          Upgrade your Plan
        </span>
      </div>
    </v-card>
  </v-hover>
</template>

<script>
import { mapGetters } from 'vuex'
import { TAG_MANAGER_EVENTS } from '@/models'
import moment from 'moment'
import { formatTimezone } from '@/utils/dateTools'
import dayjs from 'dayjs'

export default {
  name: 'TableEntry',

  props: {
    entry: {
      type: Object,
      required: true
    },

    block: {
      type: Boolean,
      required: false,
      default: false
    },

    editMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo', 'hasUserLearnAndPlayPlan']),

    userHasAccess() {
      const day = dayjs(this.entry.dateStart).day()
      return (
        !this.hasUserLearnAndPlayPlan ||
        (this.hasUserLearnAndPlayPlan && (day === 0 || day === 6))
      )
    },

    isLive() {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      const end = new Date(this.entry.dateEnd)

      return (
        today.getTime() >= start.getTime() - 5 * 60 * 1000 &&
        today.getTime() <= end.getTime() + 5 * 60 * 1000
      )
    },

    isFuture() {
      const today = new Date()
      const start = new Date(this.entry.dateStart)
      return today.getTime() <= start.getTime()
    },

    title() {
      let str = this.entry.title.substr(0, 37).replace(/\s+$/, '')
      if (this.entry.title.lenght > str.length) {
        str += '...'
      }
      return str
    },

    time() {
      const start = moment(this.entry.dateStart)
      const { timezone } = this.getUserInfo
      return formatTimezone(start, {
        format: 'HH:mm',
        timezone,
        returnObject: false
      })
    }
  },

  methods: {
    openPlanUpgradeModal() {
      this.$store.commit(
        'notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY',
        true
      )
    },

    openLink() {
      if (this.editMode) {
        this.$nuxt.$emit('open-entry-editor-dialog', this.entry)
      } else {
        if (!this.userHasAccess) {
          this.openPlanUpgradeModal()
          return
        }

        this.$nuxt.$emit('open-entry-dialog', this.entry)
        this.$gtm.push({
          event: TAG_MANAGER_EVENTS.LIVE_CLASSES_ITEM_CLICKED,
          userId: this.getUserInfo.id,
          topic: this.entry.activityType.name,
          topicDescription: this.entry.title,
          itemDateTime: this.entry.dateStart
        })
      }
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
      max-width: 100%;
      max-height: 160px;
      overflow: hidden;
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

.locked-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  font-weight: 500;
}

.lock {
  background-color: white;
  mask: url('~@/assets/svg/sessions-locked.svg') no-repeat center / contain;
  height: 40px;
  width: 40px;
}

.opacity {
  opacity: 0.5 !important;
}
</style>
