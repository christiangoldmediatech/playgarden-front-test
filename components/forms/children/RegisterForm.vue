<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form :readonly="loading" @submit.prevent="passes(onSubmit)">
      <v-row
        v-for="(item, indexD) in draft"
        :key="indexD"
        class="mb-6"
        no-gutters
      >
        <v-col>
          <span class="font-weight-bold text-h5">
            CHILD’S INFORMATION
          </span>

          <!-- Name -->
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
              class="custom-text-field"
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
                  (removable ? `Child #${indexD + 1} - ` : '') + 'Birthday date'
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
                  class="custom-text-field"
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
            <v-row class="mb-6">
              <v-col v-for="(gender, indexG) in genders" :key="indexG" cols="6">
                <v-btn
                  block
                  :color="item.gender === gender ? 'primary' : 'grey lighten-5'"
                  :disabled="loading"
                  class="custom-btn"
                  @click="item.gender = gender"
                >
                  {{ gender === "FEMALE" ? "Girl" : "Boy" }}
                </v-btn>
              </v-col>
            </v-row>

            <input v-model="item.gender" type="hidden">
          </validation-provider>

          <!-- Backpack -->
          <validation-provider
            :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Backpack'"
            rules="required"
          >
            <v-row>
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

            <input v-model="item.backpackId" type="hidden">
          </validation-provider>

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
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            block
            class="mb-12 mt-6"
            color="primary"
            :disabled="loading"
            text
            x-large
            @click="addRow(null)"
          >
            ADD ANOTHER CHILD
          </v-btn>

          <v-btn
            block
            class="mb-6"
            color="primary"
            :disabled="invalid"
            :loading="loading"
            type="submit"
            x-large
          >
            CONTINUE TO PLAN SELECTION
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </validation-observer>
</template>

<script>
import dayjs from 'dayjs'
import { get } from 'lodash'

import { mapActions, mapGetters } from 'vuex'

import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'RegisterForm',

  props: {
    loading: Boolean
  },

  data: () => ({
    backpacks: [],
    draft: [],
    genders: ['MALE', 'FEMALE']
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    removable () {
      return this.draft.length > 1
    }
  },

  created () {
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

    addRow (child) {
      child = child || {}

      this.draft.push({
        _birthdayFormatted: dayjs(
          child.birthday || `${new Date().getFullYear() - 2}-01-01`
        ).format('MM/DD/YYYY'),
        _birthdayPicker: dayjs(
          child.birthday || `${new Date().getFullYear() - 2}-01-01`
        ).format('YYYY-MM-DD'),
        _menu: child._menu || false,
        id: child.id || null,
        backpackId: get(child, 'backpack.id', ''),
        birthday: child.birthday || '',
        firstName: child.firstName || '',
        gender: child.gender || '',
        lastName: child.lastName || ' ',
        level: child.level || 'BEGINNER'
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

    onSubmit () {
      this.$emit('click:submit', jsonCopy([...this.draft]))
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

            this.$delete(this.draft, index)
          } finally {
            this.loading = false
          }
        }
      })
      return false
    },

    async loadChildren () {
      try {
        const rows = await this.getChildren()

        rows.map(this.addRow)
      } catch (e) {
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
