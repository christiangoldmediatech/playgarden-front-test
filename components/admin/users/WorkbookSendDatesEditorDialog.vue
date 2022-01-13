<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                v-for="(item, i) in dateField"
                :key="`filter-item-${i}`"
                cols="12"
              >
                <v-menu
                  v-model="item.menuDate"
                  :close-on-content-click="false"
                  min-width="290px"
                  offset-y
                  transition="scale-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      v-slot="{ errors }"
                      :name="item.name"
                    >
                      <pg-text-field
                        v-model="item.value"
                        :disabled="loading"
                        :error-message="errors"
                        :label="item.name"
                        readonly
                        clearable
                        solo-labeled
                        :value="dateFormat(item.value)"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </validation-provider>
                  </template>

                  <v-date-picker v-model="item.value" />
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'

function generateItemTemplate () {
  return {
    firstName: null,
    lastName: null,
    phoneNumber: null,
    roleId: null,
    workbookSent: null,
    workbookSentDate: {
      workbookAD: null,
      workbookEH: null,
      workbookIL: null,
      workbookMP: null,
      workbookQT: null,
      workbookUZ: null
    }
  }
}

export default {
  name: 'WorkbookSendDatesEditorDialog',

  data: vm => ({
    userId: vm.$route.query.id
      ? parseInt(vm.$route.query.id)
      : null,
    dialog: false,
    headers: [
      {
        text: 'Description',
        align: 'start',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Date',
        align: 'start',
        sortable: true,
        value: 'value'
      }
    ],
    loading: false,
    dateField: [
      { name: 'workbookAD', value: null, menuDate: false },
      { name: 'workbookEH', value: null, menuDate: false },
      { name: 'workbookIL', value: null, menuDate: false },
      { name: 'workbookMP', value: null, menuDate: false },
      { name: 'workbookQT', value: null, menuDate: false },
      { name: 'workbookUZ', value: null, menuDate: false }
    ],
    id: null,
    item: generateItemTemplate()
  }),

  computed: {
    title () {
      return this.id === null ? 'New Workbook Sent Dates' : 'Edit Workbook Sent Dates'
    },
    getData () {
      return this.dateField.filter(data => data.value !== null)
    }
  },

  methods: {
    ...mapActions('admin/users', ['update', 'getById']),

    dateFormat (val) {
      return val ? dayjs(val).format('MM/DD/YYYY') : null
    },

    buildDataWorkbooksent () {
      this.dateField.map((data) => {
        this.item.workbookSentDate[data.name] = data.value
      })
    },

    clearDataWorkbooksent () {
      this.dateField.map((data) => {
        this.item.workbookSentDate[data.name] = null
      })
    },

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true
      this.buildDataWorkbooksent()
      try {
        await this.update({ id: this.id, data: this.item })
        this.clearDataWorkbooksent()
        this.$emit('saved')
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      this.id = item.id
      this.item.firstName = item.firstName
      this.item.lastName = item.lastName
      this.item.phoneNumber = item.phoneNumber
      this.item.roleId = item.role.id
      this.item.workbookSent = true
      if (item.shipments && item.shipments.workbookDate) {
        this.dateField.map((data) => {
          data.value = item.shipments.workbookDate[data.name]
        })
      }
    },

    open (evt, item = null) {
      this.userId = item
      this.resetItem()

      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>

<style lang="scss">
.collaborator-image {
  width: 100%;
  max-width: 100%;
}
</style>
