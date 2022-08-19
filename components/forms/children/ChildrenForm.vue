<template>
  <v-row no-gutters>
    <!-- Name -->
    <v-col
      class="pr-2"
      cols="6"
    >
      <validation-provider
        v-slot="{ errors }"
        :name="(removable ? `Child #${index + 1} - ` : '') + 'Name'"
        rules="required"
      >
        <pg-text-field
          v-model="itemCurrent.firstName"
          clearable
          :disabled="isLoading"
          :error-messages="errors"
          label="First name"
          solo
          class="custom-text-field"
        />
      </validation-provider>
    </v-col>
    <v-col
      cols="6"
    >
      <!-- Lastname -->
      <validation-provider
        v-slot="{ errors }"
        :name="(removable ? `Child #${index + 1} - ` : '') + 'Lastname'"
        rules="required"
      >
        <pg-text-field
          v-model="itemCurrent.lastName"
          clearable
          :disabled="isLoading"
          :error-messages="errors"
          label="Last name"
          solo
          class="custom-text-field"
        />
      </validation-provider>
    </v-col>
    <!-- Birth date -->
    <v-col cols="12">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <pg-text-field
            label="Birth date"
            readonly
            solo
            :suffix="itemCurrent._birthdayFormatted ? '' : 'MM/DD/YYYY'"
            validate-on-blur
            :value="selectedDate"
            v-bind="attrs"
            class="custom-text-field"
            v-on="on"
          />
        </template>
        <v-date-picker
          ref="picker"
          v-model="itemCurrent._birthdayPicker"
          :max="new Date().toISOString().substr(0, 10)"
          min="1950-01-01"
          @input="onInputBirthday(itemCurrent)"
          @change="save"
        />
      </v-menu>
    </v-col>

    <!-- Gender -->
    <v-col cols="12">
      <validation-provider
        :name="(removable ? `Child #${index + 1} - ` : '') + 'Gender'"
        rules="required"
      >
        <v-row class="mb-6">
          <v-col v-for="(gender, indexG) in genders" :key="indexG" cols="6">
            <v-btn
              block
              class="custom-btn"
              :color="itemCurrent.gender === gender ? 'primary' : 'grey lighten-5'"
              :disabled="isLoading"
              min-height="60"
              x-large
              @click="itemCurrent.gender = gender"
            >
              {{ gender === "FEMALE" ? "Girl" : "Boy" }}
            </v-btn>
          </v-col>
        </v-row>

        <input v-model="itemCurrent.gender" type="hidden">
      </validation-provider>
    </v-col>

    <!-- Backpack -->
    <center class="mb-4">
      <small>
        Choose an icon for you child:
      </small>
    </center>
    <validation-provider
      :name="(removable ? `Child #${index + 1} - ` : '') + 'Backpack'"
      rules="required"
    >
      <v-row justify="center" no-gutters>
        <v-col cols="12" md="10" lg="12">
          <v-row no-gutters>
            <v-col cols="12">
              <span class="text-h6 font-weight-bold text-uppercase">
                Change icon:
              </span>
            </v-col>

            <v-sheet
              class="my-2"
              width="100%"
            >
              <v-slide-group
                v-model="itemCurrent.backpackId"
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
                    class="clickable image"
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

      <input v-model="itemCurrent.backpackId" type="hidden">
    </validation-provider>

    <v-btn
      v-if="removable"
      block
      text
      color="primary"
      @click.stop="removeChild"
    >
      DELETE CHILD PROFILE
    </v-btn>

    <v-divider v-if="removable" class="mt-6" />
  </v-row>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ChildrenForm',
  props: {
    item: {
      type: Object,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    draft: {
      type: Array,
      required: true
    },
    loading: Boolean
  },
  data: () => ({
    backpacks: [],
    menu: false,
    itemCurrent: null,
    indexCurrent: null,
    dataLoading: false,
    genders: ['MALE', 'FEMALE'],
    selectedDate: null
  }),
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    removable () {
      return this.draft.length > 1
    },

    isLoading () {
      return this.dataLoading || this.loading
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  created () {
    this.index = this.position
    this.itemCurrent = this.item
    if (this.itemCurrent.id) {
      this.selectedDate = this.itemCurrent._birthdayFormatted
    }
    this.fetchBackpacks()
    if (this.isUserLoggedIn) {
      this.loadChildren()
    } else {
      this.addRow()
    }
  },
  methods: {
    ...mapActions('backpacks', ['getBackpacks']),

    ...mapActions('children', {
      getChildren: 'get',
      deleteChild: 'delete'
    }),

    fetchBackpacks () {
      this.getBackpacks().then(data => (this.backpacks = data))
    },

    onInputBirthday () {
      if (this.itemCurrent._birthdayPicker) {
        this.itemCurrent._birthdayFormatted = dayjs(this.itemCurrent._birthdayPicker).format(
          'MM/DD/YYYY'
        )
        this.selectedDate = this.itemCurrent._birthdayFormatted
        this.itemCurrent.birthday = `${this.itemCurrent._birthdayPicker}T00:00:00.000`
      }
    },

    removeChild () {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete child profile?',
        message: `Are you sure you want to delete <b>${this.itemCurrent.firstName}</b>?`,
        action: async () => {
          this.dataLoading = true
          try {
            if (this.itemCurrent.id) {
              await this.deleteChild(this.itemCurrent.id)
            }

            this.$delete(this.draft, this.index)
          } catch (e) {
          } finally {
            this.dataLoading = false
          }
        }
      })
    },

    async loadChildren () {
      try {
        this.dataLoading = true

        const rows = await this.getChildren()

        if (rows.length) {
          rows.map(this.addRow)
        } else {
          this.addRow()
        }
      } catch (e) {
      } finally {
        this.dataLoading = false
      }
    },

    save (date) {
      this.$refs.menu.save(date)
      this.$emit('selected-date-birthday', date)
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
    max-height: 100px;
    max-width: 100px;
    width: 100%;

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
}

.grey {
  color: var(--v-black-base);
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
</style>
