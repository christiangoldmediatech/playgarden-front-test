<template>
  <v-container>
    <v-dialog
      v-if="dialog"
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="400px"
      persistent
    >
      <v-card class="pt-4">
        <v-card-text class="mt-4">
          <label>Curriculum: {{ itemSelected.curriculumType.name }}</label> <br>
          <label>Name: {{ itemSelected.name }}</label> <br>
          <label>Description: {{ itemSelected.description }}</label>
          <center>
            <audio controls class="mt-4">
              <source :src="itemSelected.songUrl" type="audio/mpeg">
              <source :src="itemSelected.songUrl" type="audio/x-m4a">
              Your browser does not support the audio element.
            </audio>
          </center>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="red"
            :dark="$vuetify.breakpoint.xs"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          <music-library-editor-dialog
            ref="editor"
            @saved="refetchMusicLibraries"
          />
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="types"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              top-justify="space-between"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @refresh="refetchMusicLibraries"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`top.prepend`]>
                <v-col cols="11" md="2">
                  <pg-select
                    v-model="filters.curriculumTypeId"
                    clearable
                    hide-details
                    :items="letters"
                    item-text="name"
                    item-value="id"
                    label="Letter"
                    solo-labeled
                    @change="refetchMusicLibraries"
                  />
                </v-col>
              </template>
              <template v-slot:[`item.actions.prepend`]="{ item }">
                <v-btn
                  color="accent"
                  icon
                  :loading="loading"
                  @click.stop="onPlaySong(item)"
                >
                  <v-icon v-text="'mdi-play'" />
                </v-btn>
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
import MusicLibraryEditorDialog from './MusicLibraryEditorDialog'

export default {
  name: 'MusicLibraryDataTable',

  components: {
    MusicLibraryEditorDialog
  },
  data () {
    return {
      loading: false,
      action: true,
      dialog: false,
      filters: {
        curriculumTypeId: null
      },
      itemSelected: {
        name: '',
        description: '',
        curriculumType: {
          name: ''
        },
        songUrl: ''
      },
      searchText: '',
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
          text: 'Curriculum',
          align: 'start',
          sortable: false,
          value: 'curriculumType.name'
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 120
        }
      ]
    }
  },

  computed: {
    ...mapGetters('admin/music-library', {
      types: 'rows',
      total: 'total'
    }),
    ...mapGetters('admin/curriculum', {
      letters: 'types'
    })
  },

  watch: {
    page () {
      this.refetchMusicLibraries()
    },

    limit () {
      this.refetchMusicLibraries()
    }
  },

  created () {
    this.getTypes()
  },
  mounted () {
    this.refetchMusicLibraries()
  },
  methods: {
    ...mapActions('admin/music-library', {
      getMusicLibraries: 'get',
      deleteMusicLibraries: 'delete'
    }),

    ...mapActions('admin/curriculum', [
      'getTypes'
    ]),

    onPlaySong (item) {
      this.dialog = true
      this.itemSelected = item
    },

    setLimit (limit) {
      if (limit > 0) {
        this.limit = limit
      } else {
        this.limit = 0
      }
    },
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchMusicLibraries()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchMusicLibraries()
    },
    async refetchMusicLibraries () {
      this.loading = true
      const name = this.searchText
      const params = {
        limit: this.limit,
        page: this.page,
        curriculumTypeId: this.filters.curriculumTypeId || null,
        ...name && { name }
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
          this.refetchMusicLibraries()
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
