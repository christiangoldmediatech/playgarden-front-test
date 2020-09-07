<template>
  <v-container :class="{ 'content-padding': sticky }" :style="{ '--paddingHeight': `${$vuetify.breakpoint.mobile ? 64 : 128}px` }">
    <v-row justify="center">
      <v-col class="text-center font-weight-bold text-h5 pt-0" cols="12">
        Browse by category
      </v-col>
    </v-row>

    <v-toolbar
      id="categoryHeader"
      v-scroll="giveMeInfo"
      :class="{ sticky }"
      color="white"
      flat
      :prominent="!$vuetify.breakpoint.mobile"
    >
      <v-slide-group v-if="$vuetify.breakpoint.mobile" show-arrows="always">
        <v-slide-item
          v-for="category in categories"
          :key="`category-${category.id}`"
        >
          <v-list-item @click="$scrollTo(`#category_row_${category.id}`, 500, { offset: $vuetify.breakpoint.mobile ? -96 : -128 })">
            <v-list-item-avatar tile>
              <v-img
                :src="category.icon"
                contain
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ category.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-slide-item>
      </v-slide-group>
      <v-row v-else align="center" justify="center">
        <v-hover
          v-for="category in categories"
          :key="`category-${category.id}`"
          v-slot:default="{ hover }"
          class="px-2"
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
  padding-top: var(--paddingHeight);
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
