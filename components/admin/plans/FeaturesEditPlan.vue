<template>
  <div>
    <v-row justify="end" class="mb-4">
      <v-btn
        class="text-h7 text-md-h7 mb-3 mr-4"
        color="primary"
        small
        @click="addComponent"
      >
        + Add {{ mode }}
      </v-btn>
    </v-row>
    <template v-for="(feature, i) in componentList">
      <v-row :key="i" no-gutters>
        <v-col cols="11">
          <validation-provider
            v-slot="{ errors }"
            name="Value"
            rules="required"
          >
            <pg-text-field
              v-model="feature.value"
              :error-messages="errors"
              label="Value"
              solo-labeled
            />
          </validation-provider>
        </v-col>
        <v-col cols="1">
          <v-btn
            class="mt-6"
            block
            text
            @click="removeComponent(feature)"
          >
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>

export default {
  name: 'FeaturesEditPlan',

  props: {
    list: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },

  data: () => ({
    componentList: []
  }),

  computed: {},

  watch: {
    list (val) {
      this.componentList = val.map((feature) => {
        return { value: feature }
      })
    }
  },

  created () {
    this.componentList = this.list.map((feature) => {
      return { value: feature }
    })
  },

  methods: {
    addComponent () {
      this.componentList.push({ value: '' })
    },

    removeComponent (selected) {
      this.componentList = this.componentList.filter(component => component.value !== selected.value)
    }
  }
}
</script>
