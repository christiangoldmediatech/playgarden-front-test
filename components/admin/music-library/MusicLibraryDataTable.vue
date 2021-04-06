<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Music Library
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              @click.stop="$refs.editor.open"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add music library</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete music library.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <music-library-editor-dialog ref="editor" @saved="refresh(false)" />
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="types"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              top-justify="space-between"
              @search="onSearch"
              @refresh="refresh(true)"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:item.songUrl="{ item }">
                <audio controls>
                  <source :src="item.songUrl" type="audio/mpeg">
                  Your browser does not support the audio element.
                </audio>
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
import onSearch from '@/mixins/OnSearchMixin.js'
import MusicLibraryEditorDialog from './MusicLibraryEditorDialog'

export default {
  name: 'MusicLibraryDataTable',

  components: {
    MusicLibraryEditorDialog
  },

  mixins: [onSearch],

  data () {
    return {
      loading: false,
      action: true,
      search: '',
      limit: 10,
      page: 1,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Description',
          align: 'start',
          sortable: false,
          value: 'description'
        },
        {
          text: 'Song',
          align: 'start',
          sortable: false,
          value: 'songUrl'
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

  computed: {
    ...mapGetters('admin/music-library', {
      types: 'rows',
      total: 'total'
    })
  },

  watch: {
    page () {
      this.refresh()
    },

    limit () {
      this.refresh()
    }
  },

  methods: {
    ...mapActions('admin/music-library', {
      getMusicLibraries: 'get',
      deleteMusicLibraries: 'delete'
    }),

    setLimit (limit) {
      if (limit > 0) {
        this.limit = limit
      } else {
        this.limit = 0
      }
    },

    async refresh (clear = false) {
      this.loading = true
      const params = { limit: this.limit, page: this.page }

      if (clear) {
        this.search = ''
      }

      if (this.search) {
        params.name = this.search
      }

      await this.getMusicLibraries(params)
      this.loading = false
    },

    remove ({ id, item }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete music library?',
        message: 'Are you sure you wish to delete ?',
        action: async () => {
          await this.deleteMusicLibraries(id)
          this.refresh()
        }
      })
    },

    playDates (item) {
      this.$router.push({
        name: 'admin-playdates',
        query: { specialistId: item.id }
      })
    }
  }
}
</script>
