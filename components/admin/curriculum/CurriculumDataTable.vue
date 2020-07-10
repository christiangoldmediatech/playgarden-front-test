<template>
  <v-data-table
    :headers="headers"
    :items="types"
    :loading="loading"
  >
    <template v-slot:top>
      <curriculum-editor-dialog ref="editor" />
      <v-toolbar color="white" flat>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-toolbar-title>
            Rows
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
        </template>
        <v-btn
          class="mr-2"
          color="primary darken-1"
          dark
          :icon="$vuetify.breakpoint.xs"
          small
          @click.stop="$refs.editor.open"
        >
          <v-icon class="hidden-sm-and-up">
            mdi-plus-circle
          </v-icon>
          <v-icon class="hidden-xs-only">
            mdi-plus
          </v-icon>
          <span class="hidden-xs-only">Create</span>
        </v-btn>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="shrink"
          clearable
          hide-details
          label="Search"
          single-line
          @keydown.enter="refresh(false)"
        />
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        class="mr-2"
        color="yellow darken-2"
        @click="$refs.editor.open(item)"
      >
        mdi-pencil-circle
      </v-icon>
      <v-icon
        color="red"
        @click="remove(item)"
      >
        mdi-delete-circle
      </v-icon>
    </template>

    <template v-slot:no-data>
      <v-btn
        color="primary"
        text
        @click="refresh(true)"
      >
        Refresh
      </v-btn>
    </template>

    <template v-slot:loading>
      <v-skeleton-loader
        class="mx-auto"
        type="table-row-divider@3"
      />
    </template>
  </v-data-table>
</template>

<script>
import CurriculumEditorDialog from '@/components/admin/curriculum/CurriculumEditorDialog'

export default {
  name: 'CurriculumDataTable',

  components: {
    CurriculumEditorDialog
  },

  data () {
    return {
      loading: false,
      search: '',
      headers: [
        {
          text: 'Letter',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Actions',
          align: 'right',
          sortable: false,
          value: 'actions'
        }
      ]
    }
  },

  computed: {
    types () {
      return this.$store.getters['admin/curriculum/types']
    }
  },

  methods: {
    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      await this.$store.dispatch('admin/curriculum/getTypes', this.search)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-admin-prompt', {
        title: 'Delete curicculum type?',
        message: `Are you sure you wish to delete '${name}' curriculum type?`,
        action: async () => {
          await this.$store.dispatch('admin/curriculum/deleteType', id)
          this.refresh()
        }
      })
    }
  }
}
</script>
