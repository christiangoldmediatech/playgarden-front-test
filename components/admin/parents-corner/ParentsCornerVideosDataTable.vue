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
            top-justify="space-between"
            @update:page="page = $event"
            @refresh="refresh(true)"
            @search="
              search = $event
              refresh(false)
            "
            @edit-item="$emit('open-editor', $event)"
            @remove-item="remove"
          >
            <template v-slot:[`top.prepend`]>
              <v-col cols="12" md="4">
                <pg-select
                  v-model="categoryId"
                  label="Category"
                  :items="categories"
                  item-text="category"
                  item-value="id"
                  clearable
                  hide-details
                  solo-labeled
                  @change="refresh(false)"
                />
              </v-col>
            </template>

            <template v-slot:[`item.name`]="{ item }">
              {{ item.video.name }}
            </template>

            <template v-slot:[`item.category`]="{ item }">
              {{ item.category.category }}
            </template>

            <template v-slot:[`item.actions.prepend`]="{ item }">
              <video-preview-btn :video="item.video" />
            </template>
          </pg-admin-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'

export default {
  name: 'ParentsCornerVideosDataTable',

  components: {
    VideoPreviewBtn
  },

  data: () => ({
    loading: false,
    search: null,
    categoryId: null,
    page: 1,
    checkStatusInterval: null,
    headers: [
      {
        text: 'Name',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Category',
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
      categories: 'getCategories',
      items: 'getVideos'
    })
  },

  watch: {
    items() {
      this.checkStatus()
    }
  },

  created() {
    this.fetchCategories()
    this.refresh()
  },

  beforeDestroy() {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('parents-corner', [
      'fetchCategories',
      'fetchVideos',
      'deleteVideo'
    ]),

    async refresh(clear = false) {
      try {
        this.loading = true

        if (clear) {
          this.search = null
        }

        await this.fetchVideos({
          name: this.search,
          categoryId: this.categoryId
        })
      } catch (e) {
        Promise.reject(e)
      } finally {
        this.loading = false
      }
    },

    remove({ id, video }) {
      this.$nuxt.$emit('open-prompt', {
        title: "Delete parent's corner video?",
        message: `Are you sure you want to delete <b>${video.name}</b>?`,
        action: async () => {
          await this.deleteVideo(id)
          await this.refresh()
        }
      })
    },

    checkStatus() {
      if (
        this.items.filter(data => data.video.status !== 'COMPLETED').length > 0
      ) {
        if (this.checkStatusInterval === null) {
          this.checkStatusInterval = setInterval(() => {
            this.refresh()
          }, 120000)
        }
      } else {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
