<template>
  <v-row no-gutters>
    <v-col
      cols="12"
      lg="7"
      order="2"
      order-lg="1"
      :class="{ 'pr-2': isLargeScreen }"
    >
      <v-row :no-gutters="!isLargeScreen">
        <v-col cols="12" lg="6">
          <!-- Name -->
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

        <v-col cols="12" lg="6">
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
      </v-row>

      <!-- Birth date -->
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

      <!-- Gender -->
      <validation-provider
        :name="(removable ? `Child #${index + 1} - ` : '') + 'Gender'"
        rules="required"
      >
        <v-row>
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

    <v-col
      cols="12"
      lg="5"
      order="1"
      order-lg="2"
      class="pg-mb-7 lg:pg-mb-0"
      :class="{ 'pl-2': isLargeScreen }"
    >
      <!-- Backpack -->
      <validation-provider
        :name="(removable ? `Child #${index + 1} - ` : '') + 'Backpack'"
        rules="required"
      >
        <child-icon-selector :value="itemCurrent.backpackId" :backpacks="backpacks" @update:value="updateBackpackId" />
        <input v-model="itemCurrent.backpackId" type="hidden">
      </validation-provider>
    </v-col>

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
import ChildIconSelector from '@/components/forms/children/ChildIconSelector.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ChildrenForm',
  components: { ChildIconSelector },
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
    },

    isLargeScreen() {
      return this.$vuetify.breakpoint.lgAndUp
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

    updateBackpackId(val) {
      this.itemCurrent.backpackId = val
    },

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
@import '~/assets/scss/app.scss';

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
