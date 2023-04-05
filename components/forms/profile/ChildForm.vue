<template>
  <pg-loading :loading="loading">
    <v-row no-gutters data-test-id="child-form-content" class="pa-4 pa-md-0">
      <v-col cols="12" class="mb-4">
        <v-row no-gutters>
          <!-- Desktop Title -->
          <v-col cols="12" md="6" class="d-none d-sm-block">
            <div class="account-page-title">
              Student Profile
            </div>
            <div class="account-page-subtitle">
              In this section you can edit the Child’s information or add a new Child.
            </div>
            <div class="my-4 pr-10 pl-2">
              <div class="account-orange-dashed-line"></div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="d-sm-flex justify-sm-end pb-12 pb-sm-0">
            <!-- Add New Child Profile Button -->
            <v-btn
              color="primary"
              :loading="loading"
              large
              class="rounded-0"
              elevation="0"
              :block="isMobile"
              @click="addRow"
            >
              <v-icon color="white" left>
                mdi-plus-circle
              </v-icon>
              Add Child
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-row no-gutters>
          <v-col
            v-for="(item, indexD) in items"
            :key="indexD"
            cols="12"
            lg="6"
          >
            <child-card
              :class="[
                'mb-16',
                { 'mr-lg-8': indexD % 2 === 0 },
                { 'ml-lg-8': indexD % 2 === 1 }
              ]"
              :index="indexD"
              :is-removable="removable(item)"
              :item="item"
              :backpacks="backpacks"
              :child-card-color="childCardColor"
            />
          </v-col>
        </v-row>
      </v-col>

      <user-child-timeline-dialog />
    </v-row>
  </pg-loading>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'

import UserChildTimelineDialog from '@/components/forms/profile/UserChildTimelineDialog.vue'
import ChildCard from './ChildCard.vue'

export default {
  name: 'ChildForm',

  components: {
    ChildCard,
    UserChildTimelineDialog
  },

  data: () => ({
    loading: false,
    backpacks: [],
    childrenProgress: [],
    items: [],
    isEditing: [],
    genders: [
      {
        text: 'Boy',
        value: 'MALE'
      },
      {
        text: 'Girl',
        value: 'FEMALE'
      }
    ]
  }),

  computed: {
    isChildChanged () {
      return child => child._original !== this.getOriginalChild(child)
    },

    removable () {
      return (item) => {
        if (!item.id) {
          return true
        }
        const items = this.items.filter(item => item.id)
        return items.length > 1
      }
    },

    childBackpack () {
      return (id) => {
        return this.backpacks.find(backpack => backpack.id === id)
      }
    },

    firstBackpack () {
      if (this.backpacks.length) {
        return this.backpacks[0].id
      }
      return null
    },

    isMobile () {
      return this.$vuetify.breakpoint.smAndDown
    },

    childCardColor() {
      return '248, 152, 56'
    }
  },

  created () {
    this.loadChildren()
  },

  methods: {
    ...mapActions('backpacks', ['getBackpacks']),

    ...mapActions(['setChild']),

    ...mapActions('children', {
      createChild: 'store',
      getChildren: 'get',
      getChild: 'getById',
      updateChild: 'update',
      deleteChild: 'delete'
    }),

    ...mapActions('children/progress', ['getUserChildrenProgress']),

    updateBackpackId(item, id) {
      item.backpackId = id
    },

    goToProgressReport (child) {
      if (child.id) {
        this.setChild({ value: [child], save: true })
        this.$router.push({
          name: 'app-student-cubby-progress-report',
          query: { id: child.id }
        })
      }
    },

    getOriginalChild ({ backpackId, birthday, firstName, level, gender, lastName } = {}) {
      return JSON.stringify({
        backpackId,
        birthday,
        firstName,
        lastName,
        level,
        gender
      })
    },

    async loadChildren () {
      try {
        this.loading = true
        await this.fetchBackpacks()
        this.childrenProgress = await this.getUserChildrenProgress()
        const rows = await this.getChildren()
        rows.forEach((row) => {
          this.loadChild(row)
        })
        this.setIsEditingList()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    loadChild (
      { _original, id, backpack, birthday, firstName, lastName, gender, level },
      index = null
    ) {
      const _birthdayPicker = (birthday) ? new Date(birthday).toISOString().substr(0, 10) : dayjs(`${new Date().getFullYear() - 2}-01-01`).format('YYYY-MM-DD')

      const progress = this.childrenProgress.find((progress) => {
        if (progress && progress.children && progress.children.id) {
          return progress.children.id === id
        }
        return false
      })

      const item = {
        _birthdayPicker,
        _birthdayFormatted: '',
        _original,
        id,
        backpackId: backpack.id,
        birthday,
        firstName,
        lastName,
        gender,
        level,
        progress: {
          curriculumType: {
            letter: progress && progress.curriculumType ? progress.curriculumType.letter : undefined
          },
          day: progress ? progress.day : undefined
        }
      }

      this.onInputBirthday(item)

      if (typeof index === 'number' && index >= 0) {
        this.$set(this.items, index, { ...this.items[index], ...item })
        this.editChild(index, false)
      } else {
        this.addRow(item)
      }
    },

    addRow (data = {}) {
      const _data = {
        _birthdayFormatted: '',
        _birthdayPicker: dayjs(`${new Date().getFullYear() - 2}-01-01`).format(
          'YYYY-MM-DD'
        ),
        _menu: false,
        _original: null,
        backpackId: this.firstBackpack,
        birthday: '',
        firstName: '',
        lastName: '',
        level: 'BEGINNER',
        gender: '',
        progress: {
          curriculumType: {
            letter: undefined
          },
          day: undefined
        },
        ...data
      }

      _data._original = this.getOriginalChild(_data)

      this.items.unshift(_data)

      this.isEditing.unshift(true)
    },

    fetchBackpacks () {
      this.getBackpacks().then(data => (this.backpacks = data))
    },

    onInputBirthday (item) {
      if (item._birthdayPicker) {
        item._birthdayFormatted = dayjs(item._birthdayPicker).format(
          'MM/DD/YYYY'
        )
        item.birthday = (item._birthdayPicker) ? `${item._birthdayPicker}T00:00:00.000` : null
      }
    },

    removeChild (item, index) {
      this.$nuxt.$emit('open-prompt', {
        message: `Are you sure you want to delete <b>${item.firstName}</b>?`,
        action: async () => {
          this.loading = true
          try {
            if (item.id) {
              await this.deleteChild(item.id)
            }
            this.items.splice(index, 1)

            this.$nuxt.$emit('children-changed')
            this.setIsEditingList()
          } catch (e) {
          } finally {
            this.loading = false
          }
        }
      })
      return false
    },

    async onSubmit (item, index) {
      try {
        this.loading = true

        if (item.id) {
          const params = {
            backpackId: item.backpackId,
            firstName: item.firstName,
            lastName: item.lastName,
            birthday: item.birthday,
            gender: item.gender,
            level: item.level
          }

          await this.updateChild({ id: item.id, params })
          item._original = this.getOriginalChild(item)

          this.editChild(index, false)
        } else {
          const data = await this.createChild(item)

          data._original = this.getOriginalChild(item)

          this.loadChild(data, index)

          this.$nuxt.$emit('children-changed')
        }
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    editChild (index, shouldEdit = true) {
      const child = this.items[index]

      // remove the child if the user is clicking Cancel (shouldEdit = false)
      // and the child has not been saved yet
      if (!shouldEdit && !child.id) {
        this.items.splice(index, 1)
        this.isEditing.splice(index, 1)
        this.$nuxt.$emit('children-changed')

        return
      }

      this.$set(this.isEditing, index, shouldEdit)
    },

    openTimeline (child) {
      this.$nuxt.$emit('open-timeline', child)
    },

    getChildBirthday (date) {
      if (!date) {
        return 'Add child birthday'
      }

      return dayjs(date).format('MM/DD/YYYY')
    },

    setIsEditingList () {
      this.isEditing = this.items.map(_ => false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/account.scss';

.child-name {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #707070;

  @media screen and (min-width: $breakpoint-xs) {
    font-size: 24px;
    line-height: 36px;
  }
}

.child-base-text {
  font-style: normal;
  font-size: 14px;
  line-height: 21px;

  @media screen and (min-width: $breakpoint-xs) {
    font-size: 15px;
    line-height: 22px;
  }
}

.image {
  max-height: 80px;
  max-width: 80px;
  width: 100%;

  &.active {
    background-color: var(--v-secondary-base);
    border-radius: 50%;
    padding: 5px;
  }
}

.backpack-active {
  height: 100px;
}

.custom-btn::v-deep.v-btn.grey {
  background-color: #f2f2f2;
  color: #9d9d9d !important;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  text-transform: capitalize !important;
}

.custom-btn::v-deep.v-btn {
  text-transform: capitalize !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

::v-deep .v-text-field .v-input__control .v-input__slot input {
  color: #AAAAAA !important;
}

::v-deep .v-text-field .v-input__control .v-input__slot .v-text-field__suffix {
    color: #AAAAAA !important;
}
</style>
