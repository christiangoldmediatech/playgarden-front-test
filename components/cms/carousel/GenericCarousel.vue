<template>
  <v-container
    v-editable="blok"
  >
    <v-row
      class="carousel"
      :style="{
        '--line-color': blok.lineColor,
        '--line-position': isMobile ? '-25px' : linePosition
      }"
      :class="{ 'carousel__background-line': blok.useLineColor }"
    >
      <div class="carousel__mobile-controllers">
        <div
          v-for="n in pageContent.length"
          :key="n"
          class="controller-item"
          :class="{ 'controller-item--active': page + 1 === n }"
        />
      </div>
      <v-btn
        v-show="showControllers"
        text
        class="carousel__btn"
        @click="prevPage"
      >
        <v-img
          :src="require('@/assets/png/player/left-arrow.svg')"
          max-width="32px"
        />
      </v-btn>

      <div
        ref="container"
        class="carousel__content"
        align="center"
      >
        <template v-if="blok.cards">
          <component
            :is="card.component"
            v-for="card in blok.cards"
            ref="components"
            :key="card._uid"
            :image="card.image"
            :title="card.title"
            :blok="card"
          />
        </template>
        <template v-else>
          <slot />
        </template>
      </div>

      <v-btn
        v-show="showControllers"
        text
        class="carousel__btn"
        @click="nextPage"
      >
        <v-img
          :src="require('@/assets/png/player/right-arrow.svg')"
          max-width="32px"
        />
      </v-btn>
    </v-row>
    <div />
  </v-container>
</template>

<script>
export default {
  name: 'GenericCarousel',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      page: 0,
      pageContent: [],
      container: null,
      children: [],
      isMobile: false
    }
  },

  computed: {
    cards () {
      if (this.pageContent.length === 0) { return this.blok.cards }
      return this.pageContent[this.page]
    },
    linePosition () {
      if (this.blok && this.blok.linePosition) { return `${this.blok.linePosition}%` }
      return '3%'
    },
    showControllers () {
      return this.pageContent.length > 1
    }
  },

  watch: {
    page () {
      this.setContentForPage()
    }
  },

  async mounted () {
    const { container } = this.$refs
    /* Mobile handler */
    const mql = window.matchMedia('(max-width: 850px)')

    this.isMobile = mql.matches
    mql.addListener((e) => { this.isMobile = e.matches })

    const Hammer = (await import(
      'hammerjs'
    )).default

    /* Mobile gestures */
    const hammerHandler = new Hammer(container)
    hammerHandler.on('swipe', (event) => {
      if (event.deltaX < 0) {
        this.nextPage()
      } else {
        this.prevPage()
      }
    })

    /* Handling for elements inside container */
    let { components } = this.$refs
    components = components || []

    this.container = container
    this.children = [...components].map((child) => {
      const { width, display } = window.getComputedStyle(child.$el)

      return {
        element: child.$el,
        initialWidth: parseInt(width),
        initialDisplay: display
      }
    })

    this.setVisibleElements()

    const mutationOptions = {
      childList: true,
      attributes: true,
      subtree: true
    }
    const mutationObserver = new MutationObserver((mutationList, observer) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'childList') { this.$nextTick(this.setVisibleElements.bind(this)) }
      })
    })

    mutationObserver.observe(this.container, mutationOptions)
    window.addEventListener('resize', this.setVisibleElements.bind(this))
  },

  methods: {
    currentPage () {
      return this.pageContent[this.page]
    },
    nextPage () {
      if (this.page < this.pageContent.length - 1) { this.page++ }
    },
    prevPage () {
      if (this.page > 0) { this.page-- }
    },
    /*
      Set observer that changes the amount of elements per page
      according to the available space of the container
    */
    setVisibleElements () {
      const { paddingLeft, paddingRight } = window.getComputedStyle(this.container)
      const containerWidth = this.container.clientWidth - parseInt(paddingLeft) - parseInt(paddingRight)
      let accumulatedSize = 0

      this.pageContent = []

      this.children.reduce((prev, curr, index) => {
        const itemSize = curr.initialWidth

        if (accumulatedSize + itemSize < containerWidth || prev.length === 0) {
          accumulatedSize += itemSize
          prev.push(curr)

          if (index === this.children.length - 1) { this.pageContent.push(prev) }

          return prev
        }

        this.pageContent.push(prev)

        if (index === this.children.length - 1) { return this.pageContent.push([curr]) }

        accumulatedSize = itemSize
        return [curr]
      }, [])

      if (this.page >= this.pageContent.length) { this.page = this.pageContent.length - 1 }
      this.setContentForPage()
    },
    setContentForPage () {
      this.pageContent.forEach((page, pageIndex) => {
        page.forEach((reference) => {
          reference.element.style.display = this.page === pageIndex
            ? reference.initialDisplay
            : 'none'
        })
      })
    },
    handleSwipe () {

    }
  }
}
</script>

<style lang="scss" scoped>
$background-line-height: 80px;

.carousel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row nowrap;
  position: relative;
}

.carousel__content {
  position: relative;
  display: flex;
  justify-content: center;
  z-index: 1;
  width: 100%;
}

.carousel__background-line {
  position: relative;

  &::after {
    content: '';
    width: 100vw;
    height: $background-line-height;
    bottom: var(--line-position);
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    box-shadow: 0 -1px 6px 0 rgba(0, 0, 0, 0.12);
    background: var(--line-color, $pg-main);
    z-index: 0;
  }
}

.carousel__title {
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 3px;
  letter-spacing: 6.75px;
  color: $pg-black;
}

.carousel__btn {
  position: relative;
  z-index: 1;
}

@media (max-width: 850px) {
  .carousel__btn {
    display: none;
  }

  .carousel__mobile-controllers {
    position: absolute;
    top: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    z-index: 1;
  }

  .controller-item {
    @include rounded-element(6px);
    border: 1px solid $pg-black;
    margin: 0 2px;
  }

  .controller-item--active {
    background: $pg-black;
  }

  .carousel__background-line--mobile {
    --line-position: 0;
  }
}

</style>
