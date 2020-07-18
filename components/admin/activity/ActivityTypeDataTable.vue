<template>
  <v-data-table
    :headers="headers"
    :items="types"
    :loading="loading"
  >
    <template v-slot:top>
      <activity-type-editor-dialog ref="editor" />
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
          solo
          @keydown.enter="refresh(false)"
        />
      </v-toolbar>
    </template>

    <template v-slot:item.color="{ item }">
      <v-avatar
        color="black"
        size="32"
      >
        <v-avatar
          :color="item.color"
          size="28"
        />
      </v-avatar>
    </template>

    <template v-slot:item.icon="{ item }">
      <img
        v-if="item.icon && item.icon !== '0'"
        :src="item.icon"
        width="32px"
      >
      <span v-else>
        N/A
      </span>
    </template>

    <template v-slot:item.type="{ item }">
      <span class="text-capitalize">
        {{ itemTypeString(item.type) }}
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
        color="blue darken-2"
        @click="$refs.editor.open(null, item)"
      >
        mdi-pencil-outline
      </v-icon>
      <v-icon
        color="red"
        @click="remove(item)"
      >
        mdi-delete-outline
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
import { mapActions, mapGetters } from 'vuex'
import ActivityTypeEditorDialog from './ActivityTypeEditorDialog'

export default {
  name: 'ActivityTypeDataTable',

  components: {
    ActivityTypeEditorDialog
  },

  data () {
    return {
      loading: false,
      search: '',
      headers: [
        {
          text: 'Color',
          align: 'start',
          sortable: true,
          value: 'color'
        },
        {
          text: 'Icon',
          align: 'start',
          sortable: true,
          value: 'icon'
        },
        {
          text: 'Activity Type Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Type',
          align: 'start',
          sortable: true,
          value: 'type'
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
          text: '',
          align: 'right',
          sortable: false,
          value: 'actions'
        }
      ]
    }
  },

  computed: {
    ...mapGetters('admin/activity', ['types'])
  },

  methods: {
    ...mapActions('admin/activity', ['getTypes', 'deleteType']),

    itemTypeString (types) {
      const list = []
      Object.keys(types).forEach((key) => {
        if (types[key]) {
          list.push(key)
        }
      })

      return (list.length) ? list.join(' | ') : 'N/A'
    },

    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      await this.getTypes(this.search)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-admin-prompt', {
        title: 'Delete activity type?',
        message: `Are you sure you wish to delete '${name}' activity type?`,
        action: async () => {
          await this.deleteType(id)
          this.refresh()
        }
      })
    }
  }
}
</script>
