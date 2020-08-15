<template>
  <v-row class="my-8" justify="center">
    <worksheet-image
      v-for="item in items"
      :key="`images-${item.code}`"
      v-bind="{ item, selected: selected ? selected.code : null }"
      hoverable
      @click.stop="select(item)"
    >
      <span class="d-block font-weight-bold">
        {{ item.word }}
      </span>
    </worksheet-image>

    <v-col
      class="mt-10"
      cols="12"
      sm="10"
      md="8"
      lg="6"
      xl="4"
    >
      <continue-button
        :disabled="!selected"
        @click.stop="check"
      />
    </v-col>

    <v-dialog
      v-model="dialog"
      max-width="978"
      persistent
    >
      <v-card>
        <v-container class="black--text">
          <span class="my-6 d-block text-center text-h4 font-weight-bold">
            <template v-if="correct">
              GREAT JOB!
            </template>
            <template v-else>
              TRY AGAIN!
            </template>
          </span>

          <v-row v-if="selected" class="my-6" align="center" justify="center">
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-row class="text-center" justify="center">
                <worksheet-image size="301" v-bind="{ item: selected, selected: selected.code }">
                  <span class="d-block mt-3 text-h5 font-weight-bold">
                    {{ selected.word }}
                  </span>
                </worksheet-image>
              </v-row>
            </v-col>

            <div class="info-column text-center">
              <v-img
                :src="require(`@/assets/svg/${correct ? 'correct' : 'incorrect' }.svg`)"
                class="ma-auto"
                :aspect-ratio="1"
                :max-width="168"
              />

              <span class="d-block mt-2 text-h6 font-weight-bold">
                {{ selected.word }}
              </span>

              <p>
                starts with a {{ selected.word[0].toUpperCase() }}{{ selected.word[0].toLowerCase() }}
              </p>
            </div>
          </v-row>

          <v-btn
            text
            block
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { shuffle } from '@/utils/arrayTools'
import WorksheetImage from './WorksheetImage.vue'
import ContinueButton from './ContinueButton.vue'

export default {
  name: 'TapCorrect',

  components: {
    WorksheetImage,
    ContinueButton
  },

  props: {
    images: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {
      dialog: false,
      selected: null,
      correct: null
    }
  },

  computed: {
    items () {
      return shuffle(this.images)
    }
  },

  methods: {
    select (item) {
      if (this.selected && this.selected.code === item.code) {
        this.selected = null
      } else {
        this.selected = item
      }
    },

    check () {
      this.correct = this.selected && this.selected.is_correct
      this.dialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.info-column {
  min-width: 300px !important;
}
</style>
