<template>
  <v-dialog
    :value="value"
    max-width="978px"
    max-height="710px"
    persistent
    @input="$emit('input', $event.target.value)"
  >
    <v-card>
      <div class="worksheet-message-content">
        <v-row>
          <v-col class="pt-0" cols="12">
            <div class="worksheet-message-title">
              {{ `${correct ? 'GREAT JOB!' : 'TRY AGAIN!'}` }}
            </div>
          </v-col>
        </v-row>

        <v-row v-if="item" align="center">
          <v-col class="d-flex justify-end" cols="6">
            <div class="worksheet-message-item">
              <v-img
                class="ml-auto worksheet-item-shadow"
                :src="item.image"
                aspect-ratio="1"
                max-width="300px"
                max-height="300px"
              >
                <div class="worksheet-item-image worksheet-item-image-selected" />
              </v-img>
            </div>
          </v-col>

          <v-col cols="6" lg="5">
            <div class="text-center">
              <v-img
                :src="require(`@/assets/svg/${correct ? 'correct' : 'incorrect' }.svg`)"
                class="mx-auto worksheet-message-icon"
                :class="{ 'clickable': !correct }"
                :aspect-ratio="1"
                v-on="{ click: correct ? () => {} : $listeners.click }"
              />
              <div class="mt-2 text-h6 font-weight-bold">
                {{ item.word }}
              </div>
              <template v-if="item.errorMessage && !correct">
                <p>
                  {{ item.errorMessage }}
                </p>
              </template>
              <template v-else>
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
              </template>
            </div>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col class="pb-0" cols="12" sm="9">
            <v-btn v-if="correct" color="primary" block v-on="{ click: $listeners.click }">
              <slot />
            </v-btn>
          </v-col>
        </v-row>
      </div>
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
.worksheet-message {
  &-content {
    padding: 45px 55px;
  }
  &-icon {
    max-width: 168px;
  }
  @media screen and (max-width: 600px) {
    &-content {
      padding: 12px 16px;
    }
    &-icon {
      max-width: 80px;
    }
  }
  &-title {
    font-size: 28px !important;
    font-weight: bold !important;
    letter-spacing: 0.15em !important;
    text-align: center !important;
    display: block;
  }
  &-item {
    width: 75%;
    max-width: 75%;
  }
}
</style>
