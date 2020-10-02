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

        <v-row v-if="item" align="center" justify="center">
          <v-col cols="6" class="text-right">
            <img
              :src="item.image"
              width="75%"
            >
            <!-- <div class="text-center worksheet-message-item">
              <v-img
                class="mx-auto worksheet-item-shadow"
                :src="item.image"
                aspect-ratio="1"
              >
                <div class="worksheet-item-image worksheet-item-image-selected" />
              </v-img>
            </div> -->
          </v-col>

          <v-col cols="6">
            <div class="text-center">
              <v-img
                :src="require(`@/assets/svg/${correct ? 'correct' : 'incorrect' }.svg`)"
                class="mx-auto"
                :aspect-ratio="1"
                max-width="168px"
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
        </v-row>

        <v-row justify="center">
          <v-col class="pb-0" cols="12" sm="9">
            <v-btn color="primary" block v-on="{ click: $listeners.click }">
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
  @media screen and (max-width: 599px) {
    &-content {
      padding: 12px 16px;
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
    max-width: 75%;
  }
}
</style>
