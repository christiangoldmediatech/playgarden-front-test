<template>
  <pg-loading :loading="loading">
    <v-row no-gutters>
      <!-- Desktop Title -->
      <v-col cols="6" class="d-none d-sm-block">
        <div class="text-uppercase text-h4 font-weight-bold grey--text text--darken-2 pb-12">
          Student Profile
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="d-sm-flex justify-sm-end pb-12 pb-sm-0">
        <!-- Add New Child Profile Button -->
        <v-btn
          color="primary"
          :loading="loading"
          x-large
          :block="isMobile"
          @click="addRow"
        >
          Add Additional Child Profile
        </v-btn>
      </v-col>

      <v-col
        v-for="(item, indexD) in items"
        :key="indexD"
        cols="12"
        sm="6"
      >
        <v-card
          :class="[
            'pa-4 pa-sm-8 custom-card-border mb-16',
            { 'mr-sm-8': indexD % 2 === 0 },
            { 'ml-sm-8': indexD % 2 === 1 }
          ]"
        >
          <validation-observer v-if="isEditing[indexD]" v-slot="{ passes }">
            <v-form
              :readonly="loading"
              @submit.prevent="passes().then(onSubmit(item, indexD))"
            >
              <!-- Backpack -->
              <validation-provider
                :name="
                  (removable(item) ? `Child #${indexD + 1} - ` : '') + 'Backpack'
                "
                rules="required"
              >
                <!-- Delete Child Profile Button -->
                <v-row no-gutters class="mb-6">
                  <v-col v-if="item.id" cols="12" class="d-flex justify-end">
                    <v-btn
                      v-if="removable(item)"
                      text
                      color="error"
                      class="text-decoration-underline"
                      @click.stop="removeChild(item, indexD)"
                    >
                      DELETE CHILD
                    </v-btn>
                  </v-col>

                  <!-- Child Profile Backpack -->
                  <v-col
                    cols="12"
                    :class="[
                      'd-flex justify-center',
                      { 'mt-sm-n0': !!item.id }
                    ]"
                  >
                    <img
                      v-if="firstBackpack"
                      :alt="childBackpack(item.backpackId).name"
                      class="backpack-active"
                      :src="childBackpack(item.backpackId).image"
                    >
                  </v-col>
                </v-row>

                <!-- Backpack Picker -->
                <v-row justify="center" no-gutters>
                  <v-col cols="12" md="10" lg="12">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <span class="text-h6 font-weight-bold text-uppercase">
                          Change backpack:
                        </span>
                      </v-col>

                      <v-col
                        v-for="(backpack, indexB) in backpacks"
                        :key="indexB"
                        class="image"
                        cols="4"
                        md="2"
                      >
                        <img
                          :alt="backpack.name"
                          class="clickable"
                          :class="{ active: item.backpackId === backpack.id }"
                          :src="backpack.image"
                          @click="item.backpackId = backpack.id"
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <input v-model="item.backpackId" type="hidden">
              </validation-provider>

              <v-row>
                <v-col
                  class="pr-2"
                  cols="6"
                >
                  <!-- First name -->
                  <validation-provider
                    v-slot="{ errors }"
                    :name="
                      (removable(item) ? `Child #${indexD + 1} - ` : '') + 'Name'
                    "
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.firstName"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      label="First name"
                      solo-labeled
                    />
                  </validation-provider>
                </v-col>
                <v-col
                  class="pr-2"
                  cols="6"
                >
                  <!-- Last name -->
                  <validation-provider
                    v-slot="{ errors }"
                    :name="
                      (removable(item) ? `Child #${indexD + 1} - ` : '') + 'Name'
                    "
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.lastName"
                      clearable
                      :disabled="loading"
                      :error-messages="errors"
                      label="Last name"
                      solo-labeled
                    />
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- Birthday date -->
              <v-menu
                v-model="item._menu"
                :close-on-content-click="false"
                min-width="290px"
                solo
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="
                      (removable(item) ? `Child #${indexD + 1} - ` : '') +
                        'Birthday date'
                    "
                    rules="required"
                  >
                    <pg-text-field
                      v-bind="attrs"
                      :disabled="loading"
                      :error-messages="errors"
                      label="Birthday date"
                      readonly
                      solo-labeled
                      :suffix="item._birthdayFormatted ? '' : 'MM/DD/YYYY'"
                      validate-on-blur
                      :value="item._birthdayFormatted"
                      v-on="on"
                    />
                  </validation-provider>
                </template>

                <v-date-picker
                  v-model="item._birthdayPicker"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1990-01-01"
                  @input="onInputBirthday(item)"
                />
              </v-menu>

              <!-- Gender -->
              <validation-provider
                :name="
                  (removable(item) ? `Child #${indexD + 1} - ` : '') + 'Gender'
                "
                rules="required"
              >
                <v-row class="mb-6">
                  <v-col
                    v-for="(gender, indexG) in genders"
                    :key="indexG"
                    cols="6"
                  >
                    <v-btn
                      block
                      class="custom-btn"
                      :color="
                        item.gender === gender ? 'primary' : 'grey lighten-5'
                      "
                      :disabled="loading"
                      x-large
                      @click="item.gender = gender"
                    >
                      {{ gender === "FEMALE" ? "Girl" : "Boy" }}
                    </v-btn>
                  </v-col>
                </v-row>

                <input v-model="item.gender" type="hidden">
              </validation-provider>

              <v-btn
                v-if="isChildChanged(item)"
                block
                color="warning"
                :loading="loading"
                type="submit"
                x-large
              >
                SAVE
              </v-btn>

              <v-btn
                block
                text
                color="grey"
                :disabled="loading"
                x-large
                @click="editChild(indexD, false)"
              >
                Cancel
              </v-btn>
            </v-form>
          </validation-observer>

          <!-- Readonly child info -->
          <v-row v-if="!isEditing[indexD]" no-gutters>
            <v-col cols="12" class="d-flex justify-center">
              <img
                v-if="firstBackpack"
                :alt="childBackpack(item.backpackId).name"
                class="backpack-active"
                :src="childBackpack(item.backpackId).image"
              >
            </v-col>

            <v-col cols="12" class="d-flex justify-center mb-3">
              <v-btn
                color="primary"
                @click="goToProgressReport(item)"
              >
                View progress report
              </v-btn>
            </v-col>

            <v-col v-if="item.id" cols="12" class="d-flex justify-center">
              <v-btn class="warning" @click="openTimeline(item)">
                View letter progress
              </v-btn>
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <v-btn class="primary--text" x-large text @click="editChild(indexD)">
                Edit Child
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="!isEditing[indexD]">
            <v-col cols="6" class="grey--text">
              Name
            </v-col>
            <v-col cols="6" class="font-weight-bold grey--text text--darken-2">
              {{ item.firstName }} {{ (item.lastName) ? item.lastName : '' }}
            </v-col>

            <v-col cols="6" class="grey--text">
              Date of birth
            </v-col>
            <v-col cols="6" class="font-weight-bold grey--text text--darken-2">
              {{ getChildBirthday(item.birthday) }}
            </v-col>

            <v-col cols="6" class="grey--text">
              Gender
            </v-col>
            <v-col cols="6" class="font-weight-bold grey--text text--darken-2">
              {{ item.gender === 'FEMALE' ? 'Girl' : item.gender === 'MALE' ? 'Boy' : '' }}
            </v-col>

            <v-col cols="6" class="grey--text">
              Current letter
            </v-col>
            <v-col cols="6" class="font-weight-bold grey--text text--darken-2">
              {{ item.progress.curriculumType.letter ? `Letter ${item.progress.curriculumType.letter}` : undefined }}
            </v-col>

            <v-col cols="6" class="grey--text">
              Current day
            </v-col>
            <v-col cols="6" class="font-weight-bold grey--text text--darken-2">
              {{ item.progress.day ? `Day ${item.progress.day}` : undefined }}
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <user-child-timeline-dialog />
    </v-row>
  </pg-loading>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'

import UserChildTimelineDialog from '@/components/admin/users/UserChildTimelineDialog.vue'

export default {
  name: 'ChildForm',

  components: {
    UserChildTimelineDialog
  },

  data: () => ({
    loading: false,
    backpacks: [],
    childrenProgress: [],
    items: [],
    isEditing: [],
    genders: ['MALE', 'FEMALE']
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

      return dayjs(date).format('MMMM DD, YYYY')
    },

    setIsEditingList () {
      this.isEditing = this.items.map(_ => false)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-content: center;

  img {
    max-height: 80px;
    max-width: 80px;
    width: 100%;

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
  }
}

.backpack-active {
  height: 175px;
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

.custom-card-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
