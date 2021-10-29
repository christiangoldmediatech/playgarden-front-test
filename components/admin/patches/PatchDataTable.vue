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
              <span class="hidden-xs-only white--text">
                Add new patch
              </span>
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
            <patch-editor-dialog
              ref="editor"
              @saved="refetchPatches"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="patches"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refetchPatches"
              @search-text-cleared="handleSearchTextClearance"
              @search="handleSearch"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`top.prepend`]>
                <v-col cols="12" md="4">
                  <pg-select
                    v-model="filters.activityTypeId"
                    class="shrink"
                    clearable
                    hide-details
                    :disabled="loading"
                    :items="types"
                    item-text="name"
                    item-value="id"
                    label="Activity"
                    solo-labeled
                    @change="refetchPatches"
                  />
                </v-col>
                <v-spacer />
              </template>
              <template v-slot:[`item.image`]="{ item }">
                <img v-if="item.image" :src="item.image" width="32px">

                <span v-else>
                  N/A
                </span>
              </template>
            </pg-admin-data-table>
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
    this.getTypes({ activity: true })
  },
  mounted () {
    this.refetchPatches()
  },
  methods: {
    ...mapActions('admin/activity', ['getTypes']),
    ...mapActions('patches', ['getPatches', 'deletePatch']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchPatches()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchPatches()
    },
    async refetchPatches () {
      this.loading = true
      const name = this.searchText
      try {
        this.patches = await this.getPatches({
          ...this.filters,
          ...name && { name }
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete patch?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deletePatch(id)
          await this.refetchPatches()
        }
      })
    }
  }
}
</script>
