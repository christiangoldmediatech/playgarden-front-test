<template>
  <v-card>
    <div class="green-line green-line-1" />
    <div class="green-line green-line-2" />

    <v-card-text>
      <template v-if="currentSheet">
        <span class="d-block text-center text-h6 text-uppercase font-weight-bold">
          Online Worksheet
        </span>

        <!-- Progress -->
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-row no-gutters>
              <v-col cols="12">
                <v-progress-linear
                  height="13"
                  rounded
                  :value="progress"
                />
              </v-col>
              <v-col
                v-for="i in stepCount"
                :key="`question-marker-${i}`"
                class="text-center"
              >
                <span
                  :class="['font-weight-bold', { 'primary--text': step >= i }]"
                >
                  {{ i }}
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Question -->
        <span class="d-block text-center font-weight-bold">
          {{ worksheetTable.question }}
        </span>

        <!-- Answers -->
        <!-- <v-row class="my-8" justify="center">
          <v-hover
            v-for="item in images"
            :key="`images-${item.code}`"
            v-slot="{ hover }"
          >
            <div
              :class="['rounded-circle item text-center mx-4 clickable', { 'scaled': hover || selected === item.code }]"
              @click.stop="select(item.code)"
            >
              <v-responsive
                :class="['rounded-circle', { 'selected': item.code === selected }]"
                width="198"
                height="198"
              >
                <v-img
                  :src="item.image"
                  aspect-ratio="1"
                />
              </v-responsive>
              <span
                v-if="type === 'TAP_CORRECT'"
                class="d-block font-weight-bold"
              >
                {{ item.word }}
              </span>
            </div>
          </v-hover>
        </v-row> -->

        <!-- Continue button -->
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-btn
              color="primary"
              class="py-2"
              block
              large
              @click.stop="nextPage"
            >
              Continue
              <v-icon right>
                mdi-greater-than
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
// import { shuffle } from '@/utils/arrayTools'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'OnlineWorksheet',

  data: () => {
    return {
      step: 1,
      selected: null
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    sheets () {
      if (this.getLesson) {
        return this.getLesson.worksheets.filter(({ type }) => type === 'ONLINE')
      }
      return []
    },

    stepCount () {
      return this.sheets.length
    },

    progress () {
      if (this.stepCount) {
        return Math.round((this.step / this.stepCount) * 100)
      }
      return 0
    },

    currentSheet () {
      return this.sheets[this.step - 1] || null
    },

    worksheetTable () {
      return this.currentSheet.worksheetTable || null
    },

    images () {
      return this.worksheetTable.images || []
    }
  },

  methods: {
    nextPage () {
      this.step++
      this.selected = null
    },

    select (code) {
      if (this.selected === code) {
        this.selected = null
      } else {
        this.selected = code
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.11);
  z-index: 1;
}

.selected {
  ::after {
    border-radius: 50%;
    box-shadow:inset 0px 0px 0px 10px var(--v-primary-base);
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
