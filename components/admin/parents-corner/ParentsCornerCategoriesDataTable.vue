<template>
  <v-row>
    <v-col cols="12">
      <v-card width="100%">
        <v-card-text>
          <pg-admin-data-table
            :headers="headers"
            :items="items"
            :loading="loading"
            :page.sync="page"
            @update:page="page = $event"
            @refresh="refresh(true)"
            @search="
              search = $event
              refresh(false)
            "
            @edit-item="$emit('open-editor', $event)"
            @remove-item="remove"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ParentsCornerCategoriesDataTable',

  data: () => ({
    loading: false,
    search: null,
    page: 1,
    headers: [
      {
        text: 'Name',
        sortable: true,
        value: 'category'
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
        width: 125
      }
    ]
  }),

  computed: {
    ...mapGetters('parents-corner', {
      items: 'getCategories'
    })
  },

  created() {
    this.refresh()
  },

  methods: {
    ...mapActions('parents-corner', ['fetchCategories', 'deleteCategory']),

    async refresh(clear = false) {
      try {
        this.loading = true

        if (clear) {
          this.search = null
        }

        await this.fetchCategories({ category: this.search })
      } catch (e) {
        Promise.reject(e)
      } finally {
        this.loading = false
      }
    },

    remove({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete parent\'s corner category?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteCategory(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
