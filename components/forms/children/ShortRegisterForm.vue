<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form :readonly="isLoading" @submit.prevent="passes(onSubmit)">
      <v-row v-for="(item, index) in draft" :key="index" no-gutters>
        <v-col>
          <p
            class="font-weight-bold mb-6 pg-letter-spacing text-center text-h5 text-md-left"
            :class="{ 'mt-3': index !== 0 }"
          >
            <underlined-title class="text-h6 text-md-h4" text="CHILD INFORMATION" />
          </p>
          <short-children-form :date="item._birthdayPicker" :item="item" :position="index" :draft="draft" :loading="loading" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
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
import ShortChildrenForm from '@/components/forms/children/ShortChildrenForm.vue'

export default {
  name: 'ShortRegisterForm',

  components: {
    ShortChildrenForm
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
    /* if (this.isUserLoggedIn) {
      this.loadChildren()
    } else {
      this.addRow()
    } */
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
        lastName: child.lastName || ' ',
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