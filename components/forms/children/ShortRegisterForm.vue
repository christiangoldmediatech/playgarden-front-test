<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form :readonly="isLoading" @submit.prevent="passes(onSubmit)">
      <v-row v-for="(item, index) in draft" :key="index" no-gutters>
        <v-col>
          <h1 class="form-title">
            CHILD INFORMATION
          </h1>
          <h2 class="form-subtitle">
            Tell us a little about your little one
          </h2>
          <children-form
            class="mt-6"
            :date="item._birthdayPicker"
            :item="item"
            :position="index"
            :draft="draft"
            :loading="loading"
          />
        </v-col>
      </v-row>

      <v-row class="mt-6">
        <v-col>
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
            START LEARNING
          </v-btn>

          <v-btn
            v-show="false"
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

import ChildrenForm from '@/components/forms/children/ChildrenForm.vue'

export default {
  name: 'ShortRegisterForm',

  components: {
    ChildrenForm
  },

  props: {
    loading: Boolean
  },

  data: () => ({
    backpacks: [],
    draft: [],
    genders: ['MALE', 'FEMALE'],
    dataLoading: false,
    menuTest: false,
    date: null
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

  watch: {
    menuTest (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },

  created () {
    this.addRow()
  },

  methods: {

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
        lastName: child.lastName || '',
        level: child.level || 'BEGINNER'
      })
    },

    onSubmit () {
      this.$emit('click:submit', jsonCopy([...this.draft]))
    },

    removeChild (item, index) {
      this.$nuxt.$emit('open-prompt', {
        message: `Are you sure you want to delete <b>${item.firstName}</b>?`,
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
.form-title {
  font-style: normal;
  line-height: 72px;
  letter-spacing: 4.8px;
}

.form-subtitle {
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 28px;
}
</style>
