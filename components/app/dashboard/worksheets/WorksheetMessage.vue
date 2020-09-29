<template>
  <v-dialog
    :value="value"
    max-width="640"
    persistent
    @input="$emit('input', $event.target.value)"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <div class="worksheet-message-title">
              {{ `${correct ? 'GREAT JOB!' : 'TRY AGAIN!'}` }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-row v-if="item" align="center" justify="center">
          <v-col class="flex-shrink-1 flex-grow-0" cols="7" sm="5">
            <div class="text-center worksheet-item">
              <v-img
                class="mx-auto worksheet-item-shadow"
                :src="item.image"
                max-width="200"
                aspect-ratio="1"
              >
                <div class="worksheet-item-image worksheet-item-image-selected" />
              </v-img>
              <div class="my-3 text-center font-weight-bold">
                {{ item.word }}
              </div>
            </div>
          </v-col>
          <v-col cols="5" sm="4">
            <div class="text-center">
              <v-img
                :src="require(`@/assets/svg/${correct ? 'correct' : 'incorrect' }.svg`)"
                class="mx-auto"
                :aspect-ratio="1"
                :max-width="100"
              />
              <div class="mt-2 text-h6 font-weight-bold">
                {{ item.word }}
              </div>
              <p v-if="tapCorrect">
                starts with a {{ item.word[0].toUpperCase() }}{{ item.word[0].toLowerCase() }}
              </p>
              <p v-else>
                <template v-if="correct">
                  is the correct answer!
                </template>
                <template v-else>
                  is not a {{ randomWord }}
                </template>
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="9">
            <v-btn color="primary" block v-on="{ click: $listeners.click }">
              <slot />
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'WorksheetMessage',

  props: {
    value: {
      type: Boolean,
      required: true
    },

    correct: {
      type: Boolean,
      required: true
    },

    showWord: {
      type: Boolean,
      required: false,
      default: false
    },

    item: {
      required: true,
      validator: (val) => {
        return typeof val === 'object' || null
      }
    },

    randomWord: {
      type: String,
      required: false,
      default: ''
    },

    tapCorrect: {
      type: Boolean,
      required: false,
      default: false
    },

    connectingPairs: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      loading: false
    }
  }
}
</script>

<style lang="scss">
.worksheet {
  &-message-title {
    font-size: 28px !important;
    font-weight: bold !important;
    letter-spacing: 0.15em !important;
    text-align: center !important;
    display: block;
  }
}
</style>
