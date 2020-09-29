<template>
  <v-container :class="{ 'content-padding': sticky }" :style="{ '--paddingHeight': `${$vuetify.breakpoint.mobile ? 64 : 128}px` }">
    <div v-if="$vuetify.breakpoint.mobile" class="text-center">
      <v-menu id="categoryHeader" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="white"
            v-bind="attrs"
            class="btn-mobile-menu"
            v-on="on"
          >
            Browse by category
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(category, index) in categories"
            :key="index"
          >
            <v-list-item-title @click="$scrollTo(`#category_row_${category.id}`, 500, { offset: $vuetify.breakpoint.mobile ? -96 : -128 })">
              <v-row no-gutters class="menu-border">
                <v-col
                  cols="4"
                  sm="4"
                  xs="4"
                  class="mb-2 mt-2"
                >
                  <v-img
                    :src="category.icon"
                    height="28px"
                    contain
                  />
                </v-col>
                <v-col
                  cols="6"
                  sm="6"
                  xs="6"
                  class="mt-5 category-name-mobile"
                >
                  {{ category.name }}
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-else>
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
                  <span
                    class="text-uppercase category-text"
                    :style="{'--bgColor': category.color}"
                  >
                    {{ category.name }}
                  </span>
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
                class="text-uppercase category-text"
                :style="{'--bgColor': category.color}"
              >
                {{ category.name }}
              </span>
            </div>
          </v-hover>
        </v-row>
      </v-toolbar>
    </div>
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

.category-name-mobile {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 13px;
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
.btn-mobile-menu {
  color: $pg-black !important;
  text-transform: initial;
}

.menu-border {
  border-bottom: 0.5px solid rgb(204 197 197 / 39%);
  width: 222px;
}
</style>
