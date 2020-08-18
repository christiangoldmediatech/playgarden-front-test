<template>
  <v-dialog
    :value="value"
    max-width="978"
    persistent
    @input="$emit('input', $event.target.value)"
  >
    <v-card>
      <v-container class="black--text">
        <span class="my-6 d-block text-center text-h4 font-weight-bold">
          {{ `${correct ? 'GREAT JOB!' : 'TRY AGAIN!'}` }}
        </span>

        <v-row v-if="Object.keys(selected).length > 0" class="my-6" align="center" justify="center">
          <v-col class="flex-grow-0 flex-shrink-1">
            <v-row class="text-center" justify="center">
              <worksheet-image size="301" v-bind="{ item: selected, selected: selected.code }">
                <span v-if="showImageWord" class="d-block mt-3 text-h5 font-weight-bold">
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

            <slot>
              <span class="d-block mt-2 text-h6 font-weight-bold">
                {{ selected.word }}
              </span>

              <p>
                starts with a {{ selected.word[0].toUpperCase() }}{{ selected.word[0].toLowerCase() }}
              </p>
            </slot>
          </div>
        </v-row>

        <slot name="actions" />
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import WorksheetImage from './WorksheetImage.vue'

export default {
  name: 'WorksheetMessage',

  components: {
    WorksheetImage
  },

  props: {
    value: {
      type: Boolean,
      required: true
    },

    correct: {
      type: Boolean,
      required: true
    },

    showImageWord: {
      type: Boolean,
      required: false,
      default: false
    },

    selected: {
      type: Object,
      required: true
    }
  },

  data: () => {
    return {
      loading: false
    }
  },

  methods: {
    close () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-column {
  min-width: 300px !important;
}
</style>
