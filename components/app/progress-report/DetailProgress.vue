<template>
  <v-row>
    <v-col cols="3">
      <center>
        {{ getDataCurrent.icon }}
        <v-img :src="getDataCurrent.icon" />
        <br />
      </center>
    </v-col>
    <v-col cols="9">
      <div class="pt-4 mb-4">
        <underlined-title class="text-h6 text-md-h3" :text="reportCardType" />

        <p>
          {{ getDataCurrent }}
        </p>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DetailProgress',

  components: {},

  props: {
    reportCardType: {
      type: String,
      required: true,
      default: undefined
    },
    report: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    getDataCurrent () {
      const index = this.report.categories.indexOf(this.reportCardType)
      return this.report.dataSerie[index]
    }
  },

  watch: {},

  created () {},

  methods: {}
}
</script>
