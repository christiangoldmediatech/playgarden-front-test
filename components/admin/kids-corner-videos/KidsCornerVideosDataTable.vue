<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Kids corner videos - Management

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-kids-corner-videos-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only white--text">
                Add new kids corner video
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete kids corner videos.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card width="100%">
      <v-card-text>
        <pg-admin-data-table
          :headers="headers"
          :items="KidsCornerVideos"
          :loading="loading"
          :page.sync="page"
          :server-items-length="total"
          top-justify="space-between"
          @search="onSearch"
          @refresh="refresh(true)"
          @update:page="page = $event"
          @edit-item="
            $router.push({
              name: 'admin-kids-corner-videos-editor',
              query: { id: $event.id },
            })
          "
        >
          <template v-slot:[`top.prepend`]>
            <v-col class="fkex-shrink-1 flex-grow-0">
              <v-icon class="my-4 mx-1" color="accent">
                mdi-tune
              </v-icon>
            </v-col>

            <v-col cols="12" md="7" class="flex-shrink-0 flex-grow-1">
              <v-row no-gutters>
                <!-- <pg-select
                  v-model="activeFilters"
                  clearable
                  :items="filterList"
                  item-text="text"
                  item-value="value"
                  label="Filter"
                  solo-labeled
                  multiple
                /> -->
              </v-row>
            </v-col>
          </template>

          <template v-slot:[`item.video.name`]="{ item }">
            <v-btn
              class="mr-2"
              :disabled="loading"
              icon
              @click.stop="toggleFeatured(item)"
            >
              <v-icon
                :color="item.featured ? 'accent' : ''"
                v-text="item.featured ? 'mdi-star' : 'mdi-star-outline'"
              />
            </v-btn>
            {{ item.video.name }}
          </template>
        </pg-admin-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { useKidsCorner } from '@/composables/kids-corner'
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import onSearch from '@/mixins/OnSearchMixin.js'
import paginable from '@/utils/mixins/paginable'

export default defineComponent({
  name: 'defineComponent',
  mixins: [paginable, onSearch],
  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'video.name'
        },
        {
          text: 'Category',
          align: 'start',
          sortable: true,
          value: 'activityType.name'
        },
        {
          text: 'Letter',
          align: 'start',
          sortable: false,
          value: 'curriculumType.letter'
        },
        {
          text: '',
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 173
        }
      ]
    }
  },
  setup () {
    const loading = ref(false)
    const search = ref<string>('')
    const activeFilters = ref<any | null >('')
    const filterList = ref<any[]>([])

    const { KidsCornerVideos, page, total, limit, getKidsCorner } = useKidsCorner()
    const refresh = async (clear = false) => {
      loading.value = true
      const params = {
        page: page.value,
        limit: limit.value,
        name: ''
      }

      if (clear) {
        search.value = ''
      }

      if (search.value) {
        params.name = search.value
      }

      console.log('params--', params)

      try {
        await getKidsCorner(params)
      } catch (e) {
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await refresh()
    })

    return {
      activeFilters,
      loading,
      page,
      total,
      filterList,
      KidsCornerVideos,
      refresh
    }
  }
})
</script>
