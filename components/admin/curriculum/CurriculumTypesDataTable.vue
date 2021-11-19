<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Curriculum Types

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
                Add new curriculum type
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete curriculum types.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <curriculum-types-editor-dialog ref="editor" />

            <pg-admin-data-table
              :headers="headers"
              :items="types"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refetchCurriculumTypes"
              @search="refetchCurriculumTypes"
              @search-text-cleared="refetchCurriculumTypes"
              @edit-item="$refs.editor.open($event)"
              @remove-item="remove"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CurriculumTypesEditorDialog from '@/components/admin/curriculum/CurriculumTypesEditorDialog'

export default {
  name: 'CurriculumTypesDataTable',

  components: {
    CurriculumTypesEditorDialog
  },
  data () {
    return {
      loading: false,
      page: 1,
      headers: [
        {
          text: 'Letter',
          align: 'start',
          sortable: true,
          value: 'letter'
        },
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Order',
          align: 'start',
          sortable: false,
          value: 'order'
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

  computed: {
    ...mapGetters('admin/curriculum', ['types'])
  },
  mounted () {
    this.refetchCurriculumTypes()
  },
  methods: {
    ...mapActions('admin/curriculum', ['getTypes', 'deleteType']),

    async refetchCurriculumTypes (searchText) {
      this.loading = true

      await this.getTypes(searchText)
      this.loading = false
    },
    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curicculum type?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteType(id)
          this.refetchCurriculumTypes()
        }
      })
    }
  }
}
</script>
