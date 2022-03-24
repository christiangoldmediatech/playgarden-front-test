<template>
  <div id="library-categories" class="lib-cats">
    <div class="d-lg-none d-flex justify-center">
      <pg-select
        v-model="selectedActivity"
        class="flex-shrink-1 flex-grow-0"
        label="Browse by Category"
        solo
        :items="compCategories"
        item-value="id"
        hide-details
      >
        <template #selection="{ item, on, attrs }">
          <v-list-item v-bind="attrs" class="w-100" v-on="on">
            <v-list-item-avatar v-if="item.icon" tile>
              <div
                class="lib-cats-circular-icon"
                :style="{'--category-color': item.color}"
              >
                <v-img
                  :src="item.icon"
                  max-width="70%"
                  max-height="70%"
                  contain
                />
              </div>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <template #item="{ item, on, attrs }">
          <v-list-item v-bind="attrs" class="w-100" v-on="on">
            <v-list-item-avatar tile>
              <div
                class="lib-cats-circular-icon"
                :style="{'--category-color': item.color}"
              >
                <v-img
                  :src="item.icon"
                  max-width="70%"
                  max-height="70%"
                  contain
                />
              </div>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </pg-select>
    </div>

    <div class="hidden-md-and-down">
      <div class="lib-cats-title">
        Browse by Category
      </div>

      <div class="d-flex flex-wrap justify-center">
        <div v-if="favorites" class="lib-cats-entry text-center mx-3">
          <div
            class="lib-cats-circle"
            :style="{
              '--category-color': `${'#ff051e'}`
            }"
            @click="scrollTo('activity-type-favorites-container')"
          >
            <img
              class="lib-cats-icon"
              src="@/assets/svg/library/favorites.svg"
            >
          </div>

          <span class="lib-cats-name" :style="{ '--cat-bkg-color': bkgColor('#ff051e') }">
            Favorites
          </span>
        </div>

        <div
          v-for="category in categories"
          :key="`category-${category.id}`"
          class="lib-cats-entry text-center mx-3"
          :data-test-id="`lib-cat-entry-${category.name}`"
        >
          <div
            class="lib-cats-circle"
            :style="{
              '--category-color': category.color
            }"
            @click="scrollTo(`activity-type-${category.id}-container`)"
          >
            <img
              class="lib-cats-icon"
              :src="category.icon"
            >
          </div>

          <span class="lib-cats-name" :style="{ '--cat-bkg-color': bkgColor(category.color) }">
            {{ category.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hexToRgb } from '@/utils/colorTools'

export default {
  name: 'LibraryCategories',

  props: {
    categories: {
      type: Array,
      required: true
    },

    favorites: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    selectedActivity: null,
    currentScroll: 0
  }),

  computed: {
    compCategories () {
      if (this.favorites) {
        return [
          {
            id: 'favorites',
            color: '#ff051e',
            name: 'Favorites',
            icon: require('@/assets/svg/library/favorites.svg')
          },
          ...this.categories
        ]
      }
      return [
        ...this.categories
      ]
    }
  },

  watch: {
    selectedActivity (id) {
      if (id) {
        this.scrollTo(`activity-type-${id}-container`)
      }
    }
  },

  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('scroll', this.toggleCategoriesHeader)
  },

  destroyed() {
    window.removeEventListener('scroll', this.toggleCategoriesHeader)
  },

  methods: {
    toggleCategoriesHeader() {
      const categories = document.getElementById('library-categories')
      if (this.$vuetify.breakpoint.mdAndDown) {
        const scroll = window.scrollY
        if (scroll > this.currentScroll) {
          categories.style.top = '-35px'
          this.currentScroll = scroll
        } else if (scroll < this.currentScroll) {
          categories.style.top = '30px'
          this.currentScroll = scroll
        }
      } else {
        categories.style.top = '75px'
      }
    },

    bkgColor (color) {
      return hexToRgb(color.substring(1))
    },

    scrollTo (id) {
      const elem = document.getElementById(id)
      const categories = document.getElementById('library-categories')
      if (elem && categories) {
        const viewOffset = this.$vuetify.breakpoint.smAndDown ? -16 : 36
        const headerOffset = categories.offsetHeight - viewOffset
        const elementPosition = elem.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.lib-cats {
  width: 100%;
  border-top: none;
  margin-top: -36px;
  padding-top: 48px;
  padding-bottom: 8px;
  position: sticky;
  background: #FFFFFF;
  top: 30px;
  z-index: 4;
  @media screen and (min-width: 1264px) {
    border: 2px solid #EEEDED;
    padding-top: 36px;
    padding-bottom: 24px;
    top: -30px;
    border-bottom-left-radius: 3% 12%;
    border-bottom-right-radius: 3% 12%;
  }
  &-title {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.5;
    letter-spacing: 0px;
    text-align: center;
    color: #606060;
    margin-bottom: 16px;
  }
  &-entry {
    transition: transform .2s ease-in-out;
    cursor: pointer;
    user-select: none;
    &:hover {
      transform: scale(1.1);
    }
  }
  &-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid var(--category-color);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 8px;
    @media screen and (min-width: 1904px) {
      width: 100px;
      height: 100px;
      border: 6px solid var(--category-color);
    }
  }
  &-icon {
    width: 70%;
    height: 70%;
    object-fit: contain;
    position: center;
    display: block;
  }
  &-name {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    text-transform: uppercase;
    color: #606060;
    position: relative;
    z-index: 1;
    @media screen and (min-width: 1904px) {
      font-size: 21px;
    }
    &::after {
      content: '';
      position: absolute;
      left: -3px;
      bottom: 2px;
      width: calc(100% + 6px);
      height: 8px;
      border-radius: 4px;
      background-color: rgba(var(--cat-bkg-color), 0.3);
      z-index: -1;
      @media screen and (min-width: 1904px) {
        left: -6px;
        width: calc(100% + 12px);
        height: 14px;
        bottom: 0;
      }
    }
  }
  &-circular-icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid var(--category-color);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
}
</style>
