<template>
  <v-container class="sticky px-0" fluid>
    <div class="text-center hidden-lg-and-up">
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
    <div class="hidden-md-and-down">
      <v-toolbar
        id="categoryHeader"
        color="white"
        class="test-z-index"
        flat
        :prominent="!$vuetify.breakpoint.mobile"
      >
        <v-slide-group v-if="$vuetify.breakpoint.mobile" show-arrows="always">
          <v-slide-item
            v-for="category in categories"
            :key="`category-${category.id}`"
          >
            <v-list-item @click="$scrollTo(`#category_row_${category.id}`, 125, { offset: -96, ease: 'ease-out', lazy: true, force: true })">
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
              @click="$scrollTo(`#category_row_${category.id}`, 125, { offset: -192, ease: 'ease-out', lazy: true, force: true })"
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
  }
}
</script>

<style lang="scss" scoped>
.sticky {
  @media screen and (min-width: 1264px) {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 52px;
    z-index: 5;
  }
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
  color: var(--v-black-base) !important;
  text-transform: initial;
}

.menu-border {
  border-bottom: 0.5px solid rgb(204 197 197 / 39%);
  width: 222px;
}
</style>
