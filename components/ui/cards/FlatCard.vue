<template>
  <div
    v-editable="blok"
    class="card pg-image--cover"
  >
    <v-hover v-slot:default="{ hover }">
      <v-card
        :class="['activity-card', { 'scaled': hover }]"
        :elevation="(hover) ? 12 : 2"
      >
        <v-img
          class="card-image clickable"
          :src="blok.image"
          max-width="100%"
          height="220px"
        />
        <!-- Container -->
        <div class="text-container">
          <b>{{ blok.title }}</b>
          <div class="link">
            <a
              :target="linkTarget"
              :href="blok.link"
            >{{ blok.textLink }}</a>
          </div>
        </div>
      </v-card>
    </v-hover>

    <!-- Download -->
    <v-btn
      v-if="blok.downloadFile && blok.downloadFile.filename"
      class="button mt-4"
      color="primary"
      :target="downloadTarget"
      :href="blok.downloadFile.filename"
    >
      <v-icon left>
        mdi-download-outline
      </v-icon>
      Download PDF
    </v-btn>
  </div>
</template>

<script>

export default {
  name: 'FlatCard',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    linkTarget () {
      return this.blok.newTab ? '_blank' : '_self'
    },
    downloadTarget () {
      return this.blok.downloadNewTab ? '_blank' : '_self'
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-card {
  transition: transform 250ms;
}

.card {
  width: 260px;
  padding: 0 10px;
  transition: 200ms ease;
}

.card-image {
  width: 260px;
  height: 220px;
}

.text-container {
  text-align: center;
  padding: 10px 15px;
  height: 95px;
  @include flex;
  flex-flow: column nowrap;
}

.link {
  text-decoration: underline;
  font-weight: normal;

  a {
    font-size: 15px;
    color: $pg-black;
  }
}
</style>
