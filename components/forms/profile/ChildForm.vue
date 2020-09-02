<template>
  <v-col>
    <validation-observer
      v-for="(item, indexD) in items"
      :key="indexD"
      v-slot="{ invalid, passes }"
    >
      <v-row class="mb-6">
        <v-col>
          <v-form
            :readonly="loading"
            @submit.prevent="passes().then(onSubmit(item, indexD))"
          >
            <!-- Backpack -->
            <validation-provider
              :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Backpack'"
              rules="required"
            >
              <v-row class="mb-6" justify="center">
                <img
                  v-if="firstBackpack"
                  :alt="childBackpack(item.backpackId).name"
                  class="active"
                  :src="childBackpack(item.backpackId).image"
                >
              </v-row>

              <v-row justify="center" no-gutters>
                <v-col cols="12" md="10" lg="8">
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
                      cols="6"
                      md="2"
                      sm="4"
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

            <!-- First name -->
            <validation-provider
              v-slot="{ errors }"
              :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Name'"
              rules="required"
            >
              <v-text-field
                v-model="item.firstName"
                clearable
                :disabled="loading"
                :error-messages="errors"
                label="Name"
                solo
              />
            </validation-provider>

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
                    (removable ? `Child #${indexD + 1} - ` : '') +
                      'Birthday date'
                  "
                  rules="required"
                >
                  <v-text-field
                    v-bind="attrs"
                    :disabled="loading"
                    :error-messages="errors"
                    label="Birthday date"
                    readonly
                    solo
                    suffix="MM/DD/YYYY"
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
              :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Gender'"
              rules="required"
            >
              <v-row class="mb-6 px-12">
                <v-col
                  v-for="(gender, indexG) in genders"
                  :key="indexG"
                  :class="{ 'text-left': indexG, 'text-right': !indexG }"
                  cols="6"
                >
                  <v-btn
                    block
                    :color="
                      item.gender === gender ? 'primary' : 'grey lighten-5'
                    "
                    :disabled="loading"
                    @click="item.gender = gender"
                  >
                    {{ gender === "FEMALE" ? "Girl" : "Boy" }}
                  </v-btn>
                </v-col>
              </v-row>

              <input v-model="item.gender" type="hidden">
            </validation-provider>

            <v-row class="mb-6" justify="center">
              <v-btn
                class="px-8"
                color="primary"
                :disabled="invalid"
                :loading="loading"
                type="submit"
              >
                Save
              </v-btn>
            </v-row>

            <v-btn
              v-if="removable"
              block
              text
              color="primary"
              @click.stop="removeChild(item, indexD)"
            >
              DELETE CHILD PROFILE
            </v-btn>

            <v-divider v-if="removable" class="mt-6" />
          </v-form>
        </v-col>
      </v-row>
    </validation-observer>

    <v-row>
      <v-col>
        <v-btn
          block
          class="mb-12 mt-6"
          color="primary"
          :disabled="loading"
          x-large
          @click="addRow"
        >
          ADD ANOTHER CHILD
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'

export default {
  name: 'ChildForm',

  data: () => ({
    loading: false,
    backpacks: [],
    items: [],
    genders: ['MALE', 'FEMALE']
  }),

  computed: {
    removable () {
      return this.items.length > 1
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
    }
  },

  created () {
    this.loadChildren()
  },

  methods: {
    ...mapActions('backpacks', ['getBackpacks']),

    ...mapActions('children', {
      createChild: 'store',
      getChildren: 'get',
      getChild: 'getById',
      updateChild: 'update',
      deleteChild: 'delete'
    }),

    async loadChildren () {
      try {
        this.loading = true
        await this.fetchBackpacks()
        const rows = await this.getChildren()
        rows.forEach((row) => {
          this.loadChild(row)
        })
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    loadChild (
      { id, backpack, birthday, firstName, gender, level },
      index = null
    ) {
      const _birthdayPicker = new Date(birthday).toISOString().substr(0, 10)
      const item = {
        _birthdayPicker,
        _birthdayFormatted: '',
        id,
        backpackId: backpack.id,
        birthday,
        firstName,
        gender,
        level
      }

      this.onInputBirthday(item)

      if (index) {
        this.$set(this.items, index, { ...this.items[index], ...item })
      } else {
        this.addRow(item)
      }
    },

    addRow (data = {}) {
      this.items.push({
        _birthdayFormatted: '',
        _birthdayPicker: '',
        _menu: false,
        backpackId: this.firstBackpack,
        birthday: '',
        firstName: '',
        level: 'BEGINNER',
        gender: '',
        ...data
      })
    },

    fetchBackpacks () {
      this.getBackpacks().then(data => (this.backpacks = data))
    },

    onInputBirthday (item) {
      if (item._birthdayPicker) {
        item._birthdayFormatted = dayjs(item._birthdayPicker).format(
          'MM/DD/YYYY'
        )
        item.birthday = `${item._birthdayPicker}T00:00:00.000`
      }
    },

    removeChild (item, index) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete child profile?',
        message: `Are you sure you wish to delete '${item.firstName}'s' profile?`,
        action: async () => {
          this.loading = true
          try {
            if (item.id) {
              await this.deleteChild(item.id)
            }
            this.items.splice(index, 1)
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
            birthday: item.birthday,
            gender: item.gender,
            level: item.level
          }
          await this.updateChild({ id: item.id, params })
        } else {
          const data = await this.createChild(item)
          this.loadChild(data, index)
        }
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 145px;

  img {
    max-height: 145px;
    padding: 10px;
    width: 100%;

    &.active {
      background-color: $pg-secondary;
      border-radius: 25px;
      padding: 5px;
    }
  }
}
</style>
