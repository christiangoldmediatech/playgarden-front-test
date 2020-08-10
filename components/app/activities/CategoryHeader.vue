<template>
  <v-container :class="{ 'content-padding': sticky }">
    <v-row justify="center">
      <v-col class="text-center font-weight-bold text-h5" cols="12">
        Browse by category
      </v-col>
    </v-row>

    <v-toolbar
      id="categoryHeader"
      v-scroll="giveMeInfo"
      :class="{ sticky }"
      color="white"
      flat
      prominent
    >
      <v-row align="center" justify="center">
        <v-hover
          v-for="category in categories"
          :key="`category-${category.id}`"
          v-slot:default="{ hover }"
        >
          <div
            :class="['wrapper clickable text-center mx-2', { 'scaled': hover }]"
            @click="$scrollTo(`#category_row_${category.id}`, 500, { offset: -192 })"
          >
            <div
              class="category d-flex justify-center align-center"
              :style="{'--bgColor': category.color}"
            >
              <v-img
                :src="category.icon"
                height="60px"
                contain
              />
            </div>
            <span
              class="font-weight-bold text-uppercase category-text"
              :style="{'--bgColor': category.color}"
            >
              {{ category.name }}
            </span>
          </div>
        </v-hover>
      </v-row>
    </v-toolbar>
  </v-container>
</template>

<script>
export default {
  name: 'CategoryHeader',

  props: {
    categories: {
      type: Array,
      required: true
    }
  },

  data: () => {
    return {
      offsetTop: 0,
      sticky: false
    }
  },

  mounted () {
    const header = document.getElementById('categoryHeader')
    this.offsetTop = header.offsetTop
  },

  methods: {
    giveMeInfo () {
      if (window.pageYOffset > this.offsetTop) {
        this.sticky = true
      } else {
        this.sticky = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-padding {
  padding-top: 128px;
}

.sticky {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  z-index: 5;
}

.wrapper {
  transition: transform 250ms;
}

.category {
  width: 90px;
  height: 90px;
  border: solid 4px var(--bgColor);
  border-radius: 50%;
}

.scaled {
  transform: scale(1.25);
  z-index: 1;
}
</style>
