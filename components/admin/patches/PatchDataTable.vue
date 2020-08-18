<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Patches

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              @click.stop="$refs.editor.open"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only">Add new patch</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete patches.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="patches"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
            >
              <template v-slot:top>
                <patch-editor-dialog ref="editor" @saved="refresh(false)" />

                <v-toolbar color="white" flat>
                  <v-select
                    v-model="filters.activityTypeId"
                    class="shrink"
                    clearable
                    hide-details
                    :disabled="loading"
                    :items="types"
                    item-text="name"
                    item-value="id"
                    label="Activity"
                    solo
                    @change="refresh(false)"
                  />

                  <v-spacer />

                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    class="shrink"
                    clearable
                    hide-details
                    label="Search"
                    single-line
                    solo
                    @keydown.enter="refresh(false)"
                  />
                </v-toolbar>
              </template>

              <template v-slot:item.image="{ item }">
                <img v-if="item.image" :src="item.image" width="32px">

                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt | formatDate }}
              </template>

              <template v-slot:item.updatedAt="{ item }">
                {{ item.updatedAt | formatDate }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-icon
                  color="#81A1F7"
                  dense
                  @click="$refs.editor.open(null, item)"
                >
                  mdi-pencil-outline
                </v-icon>

                <v-icon color="#d30909" dense @click="remove(item)">
                  mdi-delete-outline
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-btn color="primary" text @click="refresh(true)">
                  Refresh
                </v-btn>
              </template>

              <template v-slot:loading>
                <v-skeleton-loader class="mx-auto" type="table-row-divider@3" />
              </template>

              <template v-slot:footer="{ props }">
                <v-container fluid>
                  <v-row align="center" justify="end">
                    <v-icon
                      class="clickable mr-2"
                      color="green"
                      :disabled="props.pagination.page === 1 || loading"
                      x-small
                      @click.stop="page--"
                      v-text="'mdi-less-than'"
                    />

                    <template v-for="i in props.pagination.pageCount">
                      <span
                        :key="`footer-page-number-${i}`"
                        :class="[
                          'font-weight-normal',
                          {
                            'accent--text text--darken-1':
                              props.pagination.page === i,
                            clickable: props.pagination.page !== i
                          }
                        ]"
                        @click.stop="page = i"
                      >
                        {{ i }}
                      </span>
                      <span
                        v-if="i !== props.pagination.pageCount"
                        :key="`footer-page-dot-${i}`"
                        class="font-weight-normal mx-1"
                      >
                        &centerdot;
                      </span>
                    </template>

                    <v-icon
                      class="clickable ml-2"
                      color="green"
                      :disabled="
                        props.pagination.page === props.pagination.pageCount ||
                          loading
                      "
                      x-small
                      @click.stop="page++"
                      v-text="'mdi-greater-than'"
                    />
                  </v-row>
                </v-container>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import PatchEditorDialog from './PatchEditorDialog'

export default {
  name: 'PatchDataTable',

  components: {
    PatchEditorDialog
  },

  data: () => ({
    filters: {
      activityTypeId: null
    },
    patches: [],
    loading: false,
    search: null,
    page: 1,
    headers: [
      {
        text: 'Image',
        sortable: true,
        value: 'image'
      },
      {
        text: 'Name',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Number',
        sortable: true,
        value: 'number'
      },
      {
        text: 'Type',
        sortable: true,
        value: 'patchType'
      },
      {
        text: 'Activity',
        sortable: true,
        value: 'activityType.name'
      },
      {
        text: 'Created',
        sortable: false,
        value: 'createdAt'
      },
      {
        text: 'Last Updated',
        sortable: false,
        value: 'updatedAt'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
    ]
  }),

  computed: {
    ...mapGetters('admin/activity', ['types'])
  },

  created () {
    this.getTypes()
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes']),

    ...mapActions('patches', ['getPatches', 'deletePatch']),

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        this.patches = await this.getPatches({ ...this.filters, name: this.search })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete patch?',
        message: `Are you sure you wish to delete '${name}' patch?`,
        action: async () => {
          await this.deletePatch(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
