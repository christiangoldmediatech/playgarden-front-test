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
              <span class="hidden-xs-only">Add new curriculum type</span>
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
            <v-data-table
              :headers="headers"
              hide-default-footer
              :items="types"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
            >
              <template v-slot:top>
                <curriculum-types-editor-dialog ref="editor" />
                <v-toolbar color="white" flat>
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
                  @click="$refs.editor.open(item)"
                >
                  mdi-pencil-outline
                </v-icon>
                <v-icon
                  color="#d30909"
                  dense
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
                      <span :key="`footer-page-number-${i}`" :class="['font-weight-normal', { 'accent--text text--darken-1': props.pagination.page === i, 'clickable': props.pagination.page !== i }]" @click.stop="page = i">
                        {{ i }}
                      </span>
                      <span v-if="i !== props.pagination.pageCount" :key="`footer-page-dot-${i}`" class="font-weight-normal mx-1">
                        &centerdot;
                      </span>
                    </template>

                    <v-icon
                      class="clickable ml-2"
                      color="green"
                      :disabled="props.pagination.page === props.pagination.pageCount || loading"
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
import CurriculumTypesEditorDialog from '@/components/admin/curriculum/CurriculumTypesEditorDialog'

export default {
  name: 'CurriculumTypesDataTable',

  components: {
    CurriculumTypesEditorDialog
  },

  data () {
    return {
      loading: false,
      search: '',
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
    ...mapGetters('admin/curriculum', ['types'])
  },

  methods: {
    ...mapActions('admin/curriculum', ['getTypes', 'deleteType']),

    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      await this.getTypes(this.search)
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete curicculum type?',
        message: `Are you sure you wish to delete '${name}' curriculum type?`,
        action: async () => {
          await this.deleteType(id)
          this.refresh()
        }
      })
    }
  }
}
</script>
