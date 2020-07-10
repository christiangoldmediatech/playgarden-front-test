<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form :readonly="loading" @submit.prevent="passes(onSubmit)">
      <div v-for="(item, indexD) in draft" :key="indexD" class="mb-6">
        <v-row class="mb-6">
          <v-spacer />

          <v-btn v-if="removable" icon @click="$delete(draft, indexD)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <!-- First name -->
        <validation-provider
          v-slot="{ errors }"
          :name="(removable ? `Child #${indexD + 1} - ` : '') + 'First name'"
          rules="required"
        >
          <v-text-field
            v-model="item.firstName"
            clearable
            :disabled="loading"
            :error-messages="errors"
            label="First name"
            outlined
          />
        </validation-provider>

        <!-- Last name -->
        <validation-provider
          v-slot="{ errors }"
          :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Last name'"
          rules="required"
        >
          <v-text-field
            v-model="item.lastName"
            clearable
            :disabled="loading"
            :error-messages="errors"
            label="Last name"
            outlined
          />
        </validation-provider>

        <!-- birthday -->
        <validation-provider
          v-slot="{ errors }"
          :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Birthday date'"
          rules="required"
        >
          <v-menu
            v-model="item._menu"
            :close-on-content-click="false"
            min-width="290px"
            outlined
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-bind="attrs"
                :disabled="loading"
                :error-messages="errors"
                label="Birthday date"
                outlined
                readonly
                suffix="MM/DD/YYYY"
                :value="item._birthdayFormatted"
                v-on="on"
              />
            </template>

            <v-date-picker
              v-model="item._birthdayPicker"
              :max="new Date().toISOString().substr(0, 10)"
              min="1990-01-01"
              @input="onInputBirthday(item)"
            />
          </v-menu>
        </validation-provider>

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
                @click="item.gender = gender"
              >
                {{ gender === "FEMALE" ? "Girl" : "Boy" }}
              </v-btn>
            </v-col>
          </v-row>

          <input v-model="item.gender" type="hidden">
        </validation-provider>

        <!-- Level -->
        <validation-provider
          :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Level'"
          rules="required"
        >
          <v-row class="mb-6">
            <v-col
              v-for="(level, indexL) in levels"
              :key="indexL"
              cols="12"
              sm="4"
            >
              <v-btn
                block
                :color="item.level === level ? 'primary' : 'grey lighten-5'"
                :disabled="loading"
                @click="item.level = level"
              >
                {{ level }}
              </v-btn>
            </v-col>
          </v-row>

          <input v-model="item.level" type="hidden">
        </validation-provider>

        <!-- Backpack -->
        <validation-provider
          :name="(removable ? `Child #${indexD + 1} - ` : '') + 'Backpack'"
          rules="required"
        >
          <v-row class="mb-6">
            <v-col
              v-for="(backpack, indexB) in backpacks"
              :key="indexB"
              class="image"
              cols="4"
              sm="2"
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

        <v-divider v-if="removable" />
      </div>

      <v-btn
        block
        class="mb-12 mt-6"
        color="primary"
        :disabled="loading"
        text
        @click="addRow"
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
      >
        SIGNUP
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'

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
    levels: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
  }),

  computed: {
    removable () {
      return this.draft.length > 1
    }
  },

  created () {
    this.addRow()
    this.fetchBackpacks()
  },

  methods: {
    ...mapActions('backpacks', { indexBackpacks: 'index' }),

    addRow () {
      this.draft.push({
        _birthdayFormatted: '',
        _birthdayPicker: '',
        _menu: false,
        backpackId: '',
        birthday: '',
        firstName: '',
        gender: '',
        lastName: '',
        level: ''
      })
    },

    fetchBackpacks () {
      this.indexBackpacks().then(data => (this.backpacks = data))
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
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  height: 145px;

  img {
    width: 100%;
    padding: 10px;

    &.active {
      padding: 5px;
      background-color: $pg-secondary;
      border-radius: 25px;
    }
  }
}
</style>
