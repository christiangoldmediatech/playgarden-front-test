<template>
  <v-main>
    <!-- Header section -->
    <v-container fluid>
      <!-- Title -->
      <v-row class="pos-relative" align="center" justify="center">
        <v-col class="recorded-back-btn pb-0" cols="12">
          <v-btn
            color="accent"
            class="text-none"
            text
            :x-large="!$vuetify.breakpoint.mobile"
            :small="$vuetify.breakpoint.mobile"
            @click.stop="goBack"
          >
            <v-icon left :small="$vuetify.breakpoint.mobile">
              mdi-less-than
            </v-icon>
            Back
          </v-btn>
        </v-col>

        <v-col class="text-center pt-0 pt-lg-3">
          <underlined-title
            font-size="60px"
            font-size-moible="26px"
            line-height="1.5"
            text="Recorded Live Classes"
          />
        </v-col>

        <!-- Search type selector -->
        <v-col cols="12" class="recorded-search-type mr-lg-8">
          <div class="recorded-search-by">
            Search by
          </div>
          <v-btn-toggle v-model="modeValue" dense>
            <v-btn
              class="text-none recorded-search-by-btn"
              :class="{ 'white--text': mode === 'LETTER' }"
              :color="mode === 'LETTER' ? 'accent' : undefined"
              :small="$vuetify.breakpoint.mobile"
            >
              Letter
            </v-btn>
            <v-btn
              class="text-none"
              :class="{ 'white--text': mode === 'CATEGORY' }"
              :color="mode === 'CATEGORY' ? 'accent' : undefined"
              :small="$vuetify.breakpoint.mobile"
            >
              Category
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <!-- Bottom subtitle / dropdown -->
        <v-col
          v-if="$vuetify.breakpoint.mobile && mode === 'LETTER'"
          cols="11"
          sm="6"
          md="4"
        >
          <letter-select v-model="selectedLetter" />
        </v-col>

        <!-- Desktop subtitle -->
        <v-col v-else class="hidden-md-and-down" cols="12">
          <div class="recorded-browse-by">
            {{ `Browse by ${mode === 'LETTER' ? 'Letter' : 'Category'}` }}
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Desktop letter finder -->
    <v-container
      v-if="$vuetify.breakpoint.lgAndUp && mode === 'LETTER'"
      class="recorded-letters"
      :class="{ 'mb-6': recorded && recorded.length === 0 }"
    >
      <!-- Desktop letter selector -->
      <v-row justify="center">
        <recorded-letter
          v-for="letter in letters"
          :key="`letter-${letter.id}`"
          v-bind="{ letter, selectedLetter }"
          @click.native="selectLetter(letter.id)"
        />
      </v-row>
    </v-container>

    <!-- Letter Mode Content -->
    <v-container v-if="mode === 'LETTER' && letterObject">
      <v-row>
        <v-col cols="12" class="text-center text-lg-left">
          <underlined-title
            font-size="40px"
            font-size-moible="20px"
            line-height="1.5"
            :text="selectedLetterTitle"
          />
        </v-col>
        <v-row v-if="recorded && recorded.length > 0">
          <v-col
            v-for="recording in recorded"
            :key="`recording-${recording.id}`"
            class="px-lg-8"
            cols="12"
            sm="8"
            md="6"
            lg="4"
          >
            <recorded-card :entry="recording" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" class="ml-8">
            <p>No recorded classes for {{ letterObject.description }}</p>
          </v-col>
        </v-row>
      </v-row>
    </v-container>

    <template v-if="mode === 'CATEGORY'">
      <!-- Category finder -->
      <category-header v-bind="{ categories }" />

      <!-- Category Mode Content -->
      <recorded-carousel
        v-for="category in categories"
        :id="`category_row_${category.id}`"
        :key="`category-playlist-${category.id}`"
        v-bind="category"
      />
    </template>

    <entry-dialog />
    <recorded-class-player />
  </v-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CategoryHeader from '@/components/app/activities/CategoryHeader.vue'
import EntryDialog from '@/components/app/live-sessions/EntryDialog.vue'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import RecordedClassPlayer from '@/components/app/live-sessions/RecordedClassPlayer.vue'
import RecordedCard from '@/components/app/live-sessions/recorded/RecordedCard.vue'
import RecordedCarousel from '@/components/app/live-sessions/recorded/RecordedCarousel.vue'
import LetterSelect from '@/components/app/live-sessions/recorded/LetterSelect.vue'

export default {
  name: 'Recorded',

  components: {
    EntryDialog,
    RecordedLetter,
    RecordedClassPlayer,
    RecordedCard,
    RecordedCarousel,
    CategoryHeader,
    LetterSelect
  },

  data: () => {
    return {
      modeValue: 0,
      selectedLetter: null,
      selectedCategory: null,
      selectedLetterTitle: '',
      recorded: []
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { unfilteredLetters: 'types' }),
    ...mapGetters('admin/activity', { categoryTypes: 'types' }),

    mode() {
      if (this.modeValue === 0) {
        return 'LETTER'
      }
      return 'CATEGORY'
    },

    letters() {
      return this.unfilteredLetters.filter((letter) => {
        // remove intro and nature from music library ch2621
        return !['In', 'Nt'].includes(letter.letter)
      })
    },

    letterObject() {
      return this.letters.find(({ id }) => id === this.selectedLetter)
    },

    categories() {
      const categories = []

      if (this.mode === 'CATEGORY') {
        this.categoryTypes.forEach((category) => {
          const recordings = this.recorded.filter((recording) => {
            if (
              recording.activityType &&
              recording.activityType.id === category.id
            ) {
              return true
            }
            return false
          })

          if (recordings.length) {
            categories.push({
              ...category,
              recordings
            })
          }
        })
      }

      return categories
    }
  },

  watch: {
    mode(val) {
      this.recorded = []
      this.selectedLetter = null
      if (val === 'CATEGORY') {
        this.getRecorded({}).then(({ meetings }) => {
          this.recorded = meetings
        })
      }
    },

    selectedLetter(val) {
      if (val && this.mode === 'LETTER') {
        this.getRecorded({ curriculumTypeId: val }).then(({ meetings }) => {
          this.recorded = meetings
        })
      }
    },

    letterObject(val) {
      this.selectedLetterTitle = val?.picture
        ? `Recorded Classes of ${val.description}`
        : `Recorded Classes of Letter ${val?.name.substr(0, 1)}`
    }
  },

  created() {
    this.getLetters()
    this.getCategories({ extra: true })
  },

  methods: {
    ...mapActions('admin/curriculum', {
      getLetters: 'getTypes'
    }),
    ...mapActions('admin/activity', {
      getCategories: 'getTypes'
    }),
    ...mapActions('live-sessions', ['getRecorded']),

    selectLetter(id) {
      if (this.selectedLetter === id) {
        this.selectedLetter = null
      } else {
        this.selectedLetter = id
      }
    },

    goBack() {
      this.$router.push({ name: 'app-live-classes' })
    }
  }
}
</script>

<style lang="scss">
.recorded {
  &-letters {
    max-width: 1264px !important;
  }
  &-back-btn {
    @media screen and (min-width: 1264px) {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &-search-type {
    width: 100%;
    text-align: center;
    @media screen and (min-width: 1264px) {
      width: auto;
      text-align: left;
      position: absolute;
      right: 0;
    }
  }
  &-search-by {
    display: inline;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    margin-right: 12px;
    @media screen and(min-width: 1264px) {
      display: block;
      font-size: 22px;
    }
    &-btn {
      width: 85px;
      @media screen and (min-width: 1264px) {
        width: 96px;
      }
    }
  }
  &-browse-by {
    text-align: center;
    font-size: 40px;
    font-weight: 700;
    line-height: 1.5;
  }
}
</style>
