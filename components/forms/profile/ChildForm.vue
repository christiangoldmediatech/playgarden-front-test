<template>
  <pg-loading :loading="loading">
    <v-row no-gutters data-test-id="child-form-content">
      <v-col cols="12" class="mb-4">
        <v-row no-gutters>
          <!-- Desktop Title -->
          <v-col cols="12" sm="6" class="d-none d-sm-block">
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
          <v-col cols="12" sm="6" class="d-sm-flex justify-sm-end pb-12 pb-sm-0">
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
            sm="6"
          >
            <v-card
              :class="[
                '!pg-relative account-card-border',
                'pa-4 pa-sm-8 mb-16',
                { 'mr-sm-8': indexD % 2 === 0 },
                { 'ml-sm-8': indexD % 2 === 1 }
              ]"
              :style="{ '--card-custom-color': childCardColor }"
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
                    </v-row>
                    <!-- Backpack Picker -->
                    <v-row class="mb-6" no-gutters>
                      <v-col cols="12">
                        <v-row justify="center" no-gutters>
                          <v-col cols="12" md="10" lg="12">
                            <v-row no-gutters>
                              <v-col cols="12">
                                <span class="account-field-label">
                                  Change icon:
                                </span>
                              </v-col>
                              <v-sheet
                                class="my-2"
                                width="100%"
                              >
                                <v-slide-group
                                  v-model="item.backpackId"
                                  show-arrows="always"
                                >
                                  <v-slide-item
                                    v-for="backpack in backpacks"
                                    :key="backpack.id"
                                    v-slot="{ active, toggle }"
                                    :value="backpack.id"
                                  >
                                    <img
                                      :alt="backpack.name"
                                      class="clickable image mx-2"
                                      :class="{ active }"
                                      :src="backpack.image"
                                      height="100px"
                                      @click="toggle"
                                    >
                                  </v-slide-item>
                                  <template v-slot:next>
                                    <v-icon color="#F89838" x-large>
                                      mdi-chevron-right
                                    </v-icon>
                                  </template>
                                  <template v-slot:prev>
                                    <v-icon color="#F89838" x-large>
                                      mdi-chevron-left
                                    </v-icon>
                                  </template>
                                </v-slide-group>
                              </v-sheet>
                            </v-row>
                          </v-col>
                        </v-row>
                        <input v-model="item.backpackId" type="hidden">
                      </v-col>
                    </v-row>
                  </validation-provider>
                  <v-row>
                    <v-col
                      class="pr-2"
                      cols="6"
                    >
                      <!-- First name -->
                      <span class="d-inline-block account-field-label mb-2">First name</span>
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
                          background-color="#F7F7F7"
                          color="#AAAAAA"
                          solo
                          dense
                          flat
                        />
                      </validation-provider>
                    </v-col>
                    <v-col
                      class="pl-2"
                      cols="6"
                    >
                      <!-- Last name -->
                      <span class="d-inline-block account-field-label mb-2">Last name</span>
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
                          background-color="#F7F7F7"
                          color="#AAAAAA"
                          solo
                          dense
                          flat
                        />
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-row class="mb-2" no-gutters>
                    <v-col cols="6" class="pr-2">
                      <!-- Birthday date -->
                      <span class="d-inline-block account-field-label mb-2">Date of birth</span>
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
                              readonly
                              background-color="#F7F7F7"
                              color="#AAAAAA"
                              solo
                              dense
                              flat
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
                    </v-col>
                    <v-col cols="6" class="pl-2">
                      <!-- Gender -->
                      <span class="d-inline-block account-field-label mb-2">Gender </span>
                      <validation-provider
                        v-slot="{ errors }"
                        :name="
                          (removable(item) ? `Child #${indexD + 1} - ` : '') + 'Gender'
                        "
                        rules="required"
                      >
                        <pg-select
                          v-model="item.gender"
                          :items="genders"
                          clearable
                          :error-messages="errors"
                          :loading="loading"
                          background-color="#F7F7F7"
                          color="#AAAAAA"
                          solo
                          dense
                        />
                      </validation-provider>
                    </v-col>
                    <v-col cols="6 d-flex flex-column justify-center" class="pr-2">
                      <div>
                        <span class="child-base-text pg-text-[#78C383]">Current letter: </span>
                        <span class="child-base-text">
                          {{ item.progress.curriculumType.letter ? `Letter ${item.progress.curriculumType.letter}` : undefined }}
                        </span>
                      </div>
                      <div>
                        <span class="child-base-text pg-text-[#78C383]">Current day: </span>
                        <span class="child-base-text">
                          {{ item.progress.day ? `Day ${item.progress.day}` : undefined }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>

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
                <v-col cols="3" class="pb-3">
                  <img
                    v-if="firstBackpack"
                    :alt="childBackpack(item.backpackId).name"
                    class="backpack-active"
                    :src="childBackpack(item.backpackId).image"
                  >
                </v-col>

                <v-col cols="9" class="d-flex flex-column justify-end pl-3">
                  <h1 class="child-name mb-3">
                    {{ item.firstName }} {{ (item.lastName) ? item.lastName : '' }}
                  </h1>

                  <div>
                    <span class="child-base-text pg-text-[#707070]">Date of birth:  </span>
                    <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">{{ getChildBirthday(item.birthday) }}</span>
                  </div>

                  <div>
                    <span class="child-base-text pg-text-[#707070]">Gender:  </span>
                    <span class="child-base-text pg-text-[#A5A5A5] pg-font-[400]">
                      {{ item.gender === 'FEMALE' ? 'Girl' : item.gender === 'MALE' ? 'Boy' : '' }}
                    </span>
                  </div>
                </v-col>

                <v-col cols="12" class="mt-4 mb-2">
                  <v-row class="d-flex space-between" no-gutters>
                    <v-col cols="6">
                      <div>
                        <span class="child-base-text pg-text-[#78C383]">Current letter: </span>
                        <span class="child-base-text">
                          {{ item.progress.curriculumType.letter ? `Letter ${item.progress.curriculumType.letter}` : undefined }}
                        </span>
                      </div>
                    </v-col>

                    <v-col cols="6" class="d-flex">
                      <div class="ml-auto">
                        <span class="child-base-text pg-text-[#78C383]">Current day: </span>
                        <span class="child-base-text">
                          {{ item.progress.day ? `Day ${item.progress.day}` : undefined }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col v-if="item.id" cols="12" class="d-flex justify-center">
                  <v-btn
                    color="#A7CFFC"
                    text
                    class="text-decoration-underline"
                    @click="openTimeline(item)"
                  >
                    View letter progress
                  </v-btn>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <v-btn
                    color="#FFA0C8"
                    text
                    class="text-decoration-underline"
                    @click="goToProgressReport(item)"
                  >
                    View progress report
                  </v-btn>
                </v-col>

                <v-btn
                  class="!pg-absolute pg-top-[10px] pg-right-[10px]"
                  text
                  color="#F89838"
                  @click="editChild(indexD)"
                >
                  <span class="text-decoration-underline">Edit</span>
                  <v-icon right>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-row>
            </v-card>
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
@import '~/assets/scss/account.scss';

.child-name {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  color: #707070;
}

.child-base-text {
  font-style: normal;
  font-size: 15px;
  line-height: 22px;
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
</style>
