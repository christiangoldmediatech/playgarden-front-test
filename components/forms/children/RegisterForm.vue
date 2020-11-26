<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form :readonly="isLoading" @submit.prevent="passes(onSubmit)">
      <v-row v-for="(item, indexD) in draft" :key="indexD" no-gutters>
        <v-col>
          <p
            class="font-weight-bold mb-6 pg-letter-spacing text-center text-h5 text-md-left"
          >
            CHILD INFORMATION
          </p>

          <!-- Name -->
          <validation-provider
            v-slot="{ errors }"
            :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Name'"
            rules="required"
          >
            <pg-text-field
              v-model="item.firstName"
              clearable
              :disabled="isLoading"
              :error-messages="errors"
              label="Name"
              solo
              class="custom-text-field"
            />
          </validation-provider>

          <!-- Birth date -->
          <v-menu
            v-model="item._menu"
            :close-on-content-click="false"
            min-width="290px"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <validation-provider
                v-slot="{ errors }"
                :name="
                  (removable ? `Child #${indexD + 1} - ` : '') + 'Birth date'
                "
                rules="required"
              >
                <pg-text-field
                  v-bind="attrs"
                  :disabled="isLoading"
                  :error-messages="errors"
                  label="Birth date"
                  readonly
                  solo
                  :suffix="item._birthdayFormatted ? '' : 'MM/DD/YYYY'"
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
                  class="custom-btn"
                  :color="item.gender === gender ? 'primary' : 'grey lighten-5'"
                  :disabled="isLoading"
                  min-height="60"
                  x-large
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
            <v-row no-gutters>
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
                  height="100px"
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
            class="mb-4 mt-4 main-btn"
            min-height="60"
            color="primary"
            :disabled="isLoading"
            text
            x-large
            @click="addRow(null)"
          >
            ADD ANOTHER CHILD
          </v-btn>

          <v-btn
            block
            class="mb-6 main-btn"
            min-height="60"
            color="primary"
            :disabled="invalid"
            :loading="isLoading"
            type="submit"
            x-large
          >
            {{
              $vuetify.breakpoint.mdAndUp
                ? "CONTINUE TO PLAN SELECTION"
                : "CONTINUE"
            }}
          </v-btn>
        </v-col>
      </v-row>
      <p class="text-center messages-info-register">
        You will only be billed after 30 days of FREE trial is completed
      </p>
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
    genders: ['MALE', 'FEMALE'],
    dataLoading: false
  }),

  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    isLoading () {
      return this.dataLoading || this.loading
    },

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
        _birthdayFormatted: child.birthday
          ? dayjs(child.birthday).format('MM/DD/YYYY')
          : '',
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
          this.dataLoading = true

          try {
            if (item.id) {
              await this.deleteChild(item.id)
            }

            this.$delete(this.draft, index)
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
    max-height: 100px;
    max-width: 100px;
    width: 100%;

    &.active {
      background-color: var(--v-secondary-base);
      border-radius: 50%;
      padding: 5px;
    }
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
