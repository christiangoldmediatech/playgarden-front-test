<template>
  <v-hover v-slot="{ hover }">
    <div
      :disabled="block"
      class="elevation-3 lsess-table-entry clickable v2-font pg-relative"
      :class="{
        'lsess-table-entry-scaled': hover,
        'lsess-table-entry-playdate':
          !entry.cancelled && entry.type === 'Playdate',
        'lsess-table-entry-liveclass':
          !entry.cancelled && entry.type === 'LiveClass',
        'lsess-table-entry-cancelled': entry.cancelled,
        opacity: !entry.active
      }"
      @click.stop="openLink"
    >
      <div class="lsess-table-entry-live">
        <span v-if="isLive" class="pg-uppercase">{{ $t('liveClasses.tableEntry.live') }}</span>
        <img
          class="lsess-table-entry-live-icon"
          :class="{ grayscale: entry.cancelled }"
          :src="
            entry.type === 'LiveClass'
              ? require('@/assets/svg/sessions-liveclass-camera.svg')
              : require('@/assets/svg/sessions-playdate-camera.svg')
          "
        />
      </div>
      <div class="pg-flex pg-items-center pg-gap-2 pg-mt-3">
        <div v-if="entry.teacher" class="pg-relative">
          <img
            class="lsess-table-entry-type ml-1 mt-1 pg-object-cover"
            :src="entry.teacher.img"
          />
          <div
            v-if="entry.type !== 'Playdate'"
            class="pg-w-[30px] pg-h-[30px] pg-bg-white pg-rounded-full pg-p-0 pg-shadow-sm pg-absolute pg-bottom-0 pg-right-[-5px] pg-flex pg-items-center pg-justify-center"
          >
            <img
              class="pg-w-[20px] pg-h-[20px] pg-object-contain"
              :src="entry.activityType.icon"
            />
          </div>
        </div>
        <div v-else>
          <img
            class="lsess-table-entry-type ml-1 mt-1"
            :src="entry.activityType.icon"
          />
        </div>
        <div>
          <span class="pg-font-bold">
            {{
              entry.type === 'LiveClass' ? entry.activityType.name : entry.title
            }}
          </span>
          <br />
          <span class="pg-font-light pg-text-sm">
            {{ time }}
          </span>
        </div>
      </div>

      <div class="ma-1">
        {{ title }}
      </div>

      <v-tooltip v-if="entry.cancelled" right>
        <template #activator="{ on, attrs }">
          <img
            v-bind="attrs"
            class="pg-absolute pg-right-2 pg-bottom-2"
            :src="require('@/assets/svg/exclamation.svg')"
            alt="Cancelled"
            v-on="on"
          />
        </template>
        <div class="pg-pt-4 pg-pl-10 pg-pr-2 text-center pg-text-base">
          <span class="v2-font">
            {{ $t('liveClasses.tableEntry.cancelled1') }}<br />
            {{ $t('liveClasses.tableEntry.cancelled2') }}
          </span>
        </div>
      </v-tooltip>

      <!-- Play & Learn lock -->
      <div
        v-if="!userHasAccess"
        class="locked-overlay pg-flex pg-flex-col pg-justify-center pg-items-center pg-text-center pg-tracking-wide"
      >
        <div class="lock pg-mb-1" />

        <span class="pg-font-bold pg-text-sm">{{ $t('liveClasses.tableEntry.toUnlock') }}</span>

        <span
          class="pg-text-accent pg-font-bold pg-underline pg-text-base pg-leading-tight"
        >
          {{ $t('liveClasses.tableEntry.upgrade') }}
        </span>
      </div>
    </div>
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
    },

    disableOpenDialog: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters('auth', ['getUserInfo', 'hasBasicPlayAndLearnPlan']),

    userHasAccess() {
      const day = dayjs(this.entry.dateStart).day()
      return (
        !this.hasBasicPlayAndLearnPlan ||
        (this.hasBasicPlayAndLearnPlan && (day === 0 || day === 6))
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
      if (this.entry.title.lenght < 38) {
        return title
      }

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
        format: 'hh:mma',
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
        return
      }

      if (!this.userHasAccess) {
        this.openPlanUpgradeModal()
        return
      }

      if (!this.disableOpenDialog) {
        this.$nuxt.$emit('open-entry-dialog', this.entry)
        this.$gtm.push({
          event: TAG_MANAGER_EVENTS.LIVE_CLASSES_ITEM_CLICKED,
          userId: this.getUserInfo.id,
          topic: this.entry.activityType
            ? this.entry.activityType
            : this.entry.title,
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
      overflow: hidden;
      border-radius: 10px;
      border-width: 3px;
      border-style: solid;

      &-cancelled {
        border-color: #c8c8c8;
        background-color: #f2f2f2;
        opacity: 0.6;
      }

      &-playdate {
        border-color: #68c453;
        background-color: #f8ffee;
      }

      &-liveclass {
        border-color: #f89838;
        background-color: #fff7f0;
      }

      &-live {
        position: absolute;
        top: 2px;
        right: 2px;
        display: flex;
        align-items: center;
        gap: 2px;

        &-icon {
          width: 25px;
          height: 25px;
        }
      }

      &-type {
        width: 45px;
        height: 45px;
        border-radius: 8px;
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

.cancellation-tooltip {
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.15));
  position: absolute;
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

.v-tooltip__content {
  background-color: transparent !important;
  background-image: url('~@/assets/svg/tooltip.svg');
  background-size: contain;
  background-repeat: no-repeat;
  color: var(--v-black-base);
  z-index: 2 !important;
  height: 192px;
  width: 362px;
  opacity: 1 !important;
}
</style>
