<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Backpacks

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
              <span class="hidden-xs-only white--text">Add new backpack</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete backpacks.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <backpack-editor-dialog
              ref="editor"
              @saved="refetchBackPacksData"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="backpacks"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @search="handleSearch"
              @refresh="refetchBackPacksData"
              @search-text-cleared="handleSearchTextClearance"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.image`]="{ item }">
                <img
                  v-if="item.image"
                  :src="item.image"
                  width="32px"
                >

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
import { mapActions } from 'vuex'
import BackpackEditorDialog from './BackpackEditorDialog'

export default {
  name: 'BackpackDataTable',

  components: {
    BackpackEditorDialog
  },
  data () {
    return {
      backpacks: [],
      loading: false,
      page: 1,
      searchText: null,
      headers: [
        {
          text: 'Image',
          align: 'start',
          sortable: true,
          value: 'image'
        },
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Code',
          align: 'start',
          sortable: true,
          value: 'code'
        },
        {
          text: 'Created',
          align: 'start',
          sortable: false,
          value: 'createdAt'
        },
        {
          text: 'Last Updated',
          align: 'start',
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
    }
  },
  mounted () {
    this.refetchBackPacksData()
  },

  methods: {
    ...mapActions('backpacks', ['getBackpacks', 'deleteBackpack']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchBackPacksData()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchBackPacksData()
    },
    async refetchBackPacksData () {
      this.loading = true
      const name = this.searchText

      try {
        this.backpacks = await this.getBackpacks({
          ...name && { name }
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete backpack?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteBackpack(id)
          await this.refetchBackPacksData()
        }
      })
    }
  }
}
</script>
