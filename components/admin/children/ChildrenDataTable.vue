<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Children
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              @click.stop="childrenExport"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Export</span>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="rows"
              :loading="loading"
              :items-per-page="paginationLimit"
              :page.sync="page"
              :server-items-length="total"
              :action="action"
              top-justify="space-between"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @update:page="page = $event"
              @refresh="refetchChildrensData"
              @edit-item="
                $router.push({
                  name: 'admin-user-manager-specialists-editor',
                  query: { id: $event.id }
                })
              "
            >
              <template v-slot:[`top.prepend`]>
                <div class="filterControls px-3 my-3 mb-4">
                  <section>
                    <pg-select
                      v-model="selectedLetterPreference"
                      clearable
                      hide-details
                      item-text="name"
                      item-value="id"
                      label="Letter"
                      solo-labeled
                      :items="letterSelectOptions"
                      class="select"
                      @change="refetchChildrensData"
                    />
                    <pg-select
                      v-model="selectedDayPreference"
                      clearable
                      hide-details
                      label="Day"
                      solo-labeled
                      :items="daysSelectOptions"
                      class="select"
                      @change="refetchChildrensData"
                    />
                  </section>

                  <section class="filterCheckboxes">
                    <v-checkbox
                      class="mx-1 my-1 pa-0"
                      color="primary darken-2"
                      hide-details
                      :input-value="allFilters"
                      label="All"
                      @click.stop="toggleAll"
                    />
                    <v-checkbox
                      v-for="(item, i) in filterList"
                      :key="`filter-item-${i}`"
                      v-model="activeFilters"
                      class="mx-1 my-1 pa-0"
                      color="primary darken-2"
                      hide-details
                      :label="item.text"
                      multiple
                      :value="item.value"
                    />
                  </section>
                </div>
              </template>

              <template v-slot:[`item.firstName`]="{ item }">
                {{ `${item.firstName} ${(item.lastName) ? (item.lastName) : ''}` }}
              </template>

              <template v-slot:[`item.backpack.image`]="{ item }">
                <img
                  v-if="item.backpack && item.backpack.image"
                  :src="item.backpack.image"
                  width="32px"
                >
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.lesson.curriculumType.letter`]="{ item }">
                <span
                  v-if="item.lesson && item.lesson.curriculumType.letter"
                >{{ item.lesson.curriculumType.letter }}
                </span>
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.lesson.day`]="{ item }">
                <span
                  v-if="item.lesson && item.lesson.day"
                >{{ item.lesson.day }}
                </span>
                <span v-else>
                  N/A
                </span>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-row>
                  <div class="pl-1">
                    <nuxt-link
                      :to="{
                        name: 'admin-user-manager-profile',
                        query: { id: (item.user) ? item.user.id : '' }
                      }"
                      title="Go to Parent"
                    >
                      <v-img
                        width="20"
                        height="20"
                        :src="require('@/assets/png/Parent.png')"
                      />
                    </nuxt-link>
                  </div>

                  <div :key="`child-${item.id}`" class="pl-4">
                    <v-btn
                      icon
                      width="16"
                      height="16"
                      title="Show Progress"
                      @click.stop="openTimeline(item)"
                    >
                      <v-img :src="require('@/assets/png/progress-1.png')" height="20" width="20" />
                    </v-btn>
                  </div>
                  <div :key="`edit-${item.id}`" class="pl-4">
                    <v-btn
                      icon
                      width="16"
                      height="16"
                      title="Edit"
                      @click.stop="$refs.childEditorDialogRef.open($event, item)"
                    >
                      <v-icon class="my-4 mx-1" color="#81A1F7">
                        mdi-pencil-outline
                      </v-icon>
                    </v-btn>
                  </div>
                </v-row>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <user-child-timeline-dialog />
    <user-child-lesson-overlay />
    <child-editor-dialog
      ref="childEditorDialogRef"
      @saved="refetchChildrensData"
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import UserChildLessonOverlay from '@/components/admin/users/UserChildLessonOverlay.vue'
import UserChildTimelineDialog from '@/components/admin/users/UserChildTimelineDialog.vue'
import ChildEditorDialog from '@/components/admin/children/ChildEditorDialog'

const MAX_NUMBER_OF_DAYS = 5

export default {
  name: 'ChildrenDataTable',

  components: {
    UserChildTimelineDialog,
    UserChildLessonOverlay,
    ChildEditorDialog
  },
  data () {
    return {
      loading: false,
      action: false,
      searchText: null,
      page: 1,
      allFilters: false,
      children: [],
      activeFilters: ['firstName'],
      filterList: [
        {
          text: 'First Name',
          value: 'firstName'
        }
      ],
      headers: [
        {
          text: 'Image',
          align: 'start',
          sortable: false,
          value: 'backpack.image'
        },
        {
          text: 'Children name',
          align: 'start',
          sortable: false,
          value: 'firstName'
        },
        {
          text: 'Current Letter',
          align: 'start',
          sortable: false,
          value: 'lesson.curriculumType.letter'
        },
        {
          text: 'Current Day',
          align: 'start',
          sortable: false,
          value: 'lesson.day'
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 120
        }
      ],
      selectedLetterPreference: null,
      // The property below is initiated with an array that is formed by using the Array.from() method by passing an Array-like object that has a `length` property.
      // The map function goes as the second argument in Array.from() and modifies an array of form [0,1,2,...] to start the array from 1 and not from 0
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#using_arrow_functions_and_array.from
      // Purpose: This enables us to dynamically generate the array of any required length in the future by just altering MAX_NUMBER_OF_DAYS and not distrubing any existing logic
      daysSelectOptions: ['All', ...Array.from({ length: MAX_NUMBER_OF_DAYS }, (_, index) => index + 1)],
      selectedDayPreference: null
    }
  },
  computed: {
    ...mapState('admin', ['paginationLimit']),
    ...mapGetters('admin/children', ['rows', 'total', 'types']),
    ...mapGetters('admin/curriculum', {
      letters: 'types'
    }),
    letterSelectOptions () {
      // We use the Array.prototype.filter() below to prevent `undefined` from being pushed into the array should this.letters be undefined
      return ['All'].concat(this.letters).filter(Boolean)
    }
  },
  watch: {
    page () {
      this.refetchChildrensData()
    },

    limit () {
      this.refetchChildrensData()
    },

    activeFilters (val) {
      if (val.length === 0 || val.length !== this.filterList.length) {
        this.allFilters = false
      }

      if (val.length === this.filterList.length) {
        this.allFilters = true
      }
    }
  },
  created () {
    this.getTypes()
  },
  mounted () {
    this.refetchChildrensData()
  },
  methods: {
    ...mapActions('admin/children', ['getChildrensProgress']),
    ...mapActions('children/progress', ['getChildrenProgressExport']),
    ...mapActions('admin/curriculum', ['getTypes']),

    openTimeline (child) {
      this.$nuxt.$emit('open-timeline', child)
    },

    toggleAll () {
      this.allFilters = !this.allFilters

      if (this.allFilters) {
        this.filterList.forEach((filter) => {
          if (!this.activeFilters.includes(filter.value)) {
            this.activeFilters.push(filter.value)
          }
        })
      } else {
        this.activeFilters = []
      }
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
      this.refetchChildrensData()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchChildrensData()
    },
    async refetchChildrensData () {
      this.loading = true
      const curriculumTypeId = this.selectedLetterPreference !== 'All' && this.selectedLetterPreference
      const day = this.selectedDayPreference !== 'All' && this.selectedDayPreference
      const firstName = this.searchText

      const params = {
        limit: this.paginationLimit,
        page: this.page,
        ...firstName && { firstName },
        ...curriculumTypeId && { curriculumTypeId },
        ...day && { day }
      }

      try {
        await this.getChildrensProgress(params)
      } catch (e) {
        // We should decide on how to handle API errors
        // eslint-disable-next-line
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async childrenExport () {
      this.exporting = true

      try {
        const { data } = await this.getChildrenProgressExport()

        if (data.export) {
          this.$snotify.success(
            'Export is complete and will be sent to your email.'
          )
        }
      } catch (e) {
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .filterControls {
    flex: 1;
    display: flex;
    flex-direction: column;

    section {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;

      & > .select {
        flex-basis: 10rem;
      }
    }
  }
}
</style>
