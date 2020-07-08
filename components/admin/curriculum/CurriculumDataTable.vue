<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :loading="loading"
  >
    <template v-slot:top>
      <curriculum-editor-dialog ref="editor" />
      <v-toolbar flat color="white">
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
          color="primary darken-1"
          dark
          class="mr-2"
          small
          :icon="$vuetify.breakpoint.xs"
          @click.stop="$refs.editor.open()"
        >
          <v-icon v-if="$vuetify.breakpoint.xs">
            mdi-plus-circle
          </v-icon>
          <v-icon v-else>
            mdi-plus
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">Create</span>
        </v-btn>
        <v-spacer />
        <v-text-field
          v-model="search"
          class="shrink"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          clearable
          @keydown.enter="refresh()"
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
        type="table-row-divider@3"
        class="mx-auto"
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
    rows () {
      return this.$store.getters['admin/curriculum/rows']
    }
  },

  methods: {
    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      await this.$store.dispatch('admin/curriculum/get', this.search)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-admin-prompt', {
        title: 'Delete curicculum type?',
        message: `Are you sure you wish to delete '${name}' curriculum type?`,
        action: async () => {
          await this.$store.dispatch('admin/curriculum/delete', id)
          this.refresh()
        }
      })
    }
  }
}
</script>
