<template>
  <div
    v-editable="blok"
    class="wrapper"
  >
    <div
      class="back-btn"
      @click="toParentsCorner"
    >
      <v-img
        :src="require('@/assets/svg/chevron-left.svg')"
        max-width="38px"
      />
      <span class="orange-text">Back</span>
    </div>
    <div class="materials-title">
      <div
        class="pg-text--underlined"
      >
        {{ blok.title }}
      </div>
    </div>
    <div class="materials-description">
      {{ blok.description }}
    </div>

    <div class="divider">
      <div class="bottom-bar">
        <img :src="blok.image" class="material-image">
      </div>

      <div class="px-5">
        <div class="pg-title--uppercase">
          Monthly workbooks
        </div>
        <div>
          Download the workbooks to complete the hands-on activities!
        </div>
        <div class="d-flex justify-center">
          <div
            v-for="(interval, idx) in letterIntervals"
            :key="interval"
            class="letter-selector"
            :class="{ 'letter-selector--active': idx === activeInterval }"
            @click="activeInterval = idx"
          >
            {{ interval }}
          </div>
        </div>

        <!-- Download -->
        <div class="d-flex justify-center mt-4">
          <v-btn
            class="button"
            color="primary"
          >
            <v-icon left>
              mdi-download-outline
            </v-icon>
            Download PDF
            <!-- <a :href="blok.link.url || link" @click="toLink">{{ blok.text || text }}</a> -->
          </v-btn>
        </div>
      </div>
    </div>

    <div class="materials-title underlined-title">
      <span>
        {{ blok.subtitle }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CmsMaterials',

  props: {
    blok: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      activeInterval: 0,
      letterIntervals: [
        'Aa - Ee',
        'Ff - Jj',
        'Kk - Rr',
        'Ss - Zz'
      ]
    }
  },

  methods: {
    toParentsCorner () {
      this.$router.push('/app/parent-corner')
    }
  }

}
</script>

<style lang="scss" scoped>

// .wrapper {
//   max-width: 1200px;
// }

.materials-title {
  @include parent-stack-context;
  font-size: 50px;
  margin: 0 auto;
  margin-top: 40px;
  max-width: 800px;
  color: var(--v-black-base);
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: center;
}

.materials-description {
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 40px;
  text-align: center;
  color: var(--v-black-base);
  font-size: 17px;
}

.divider {
  @include parent-stack-context;
  display: flex;
  flex-flow: row wrap;

  > * {
    flex: 1 1 500px;
    position: relative;
  }
}

.material-image {
  width: 500px;
  height: 300px;
  margin-left: 50px;
  margin-bottom: 20px;
}

.bottom-bar {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100px;
    z-index: -1;
    background: var(--v-primary-base);
  }
}

/* Rounded selectors */
.letter-selector {
  width: 90px;
  height: 50px;
  border-radius: 8px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background: white;
  cursor: pointer;
  font-weight: bolder;
  transition: transform 200ms;
  margin: 10px;
  @include flex;

  &:hover {
    transform: scale(1.08);
  }
}

.letter-selector--active {
  border: solid 4px var(--v-primary-base);
}

.back-btn {
  display: flex;
  cursor: pointer;
  align-items: center;
  font-size: 20px;
}

.orange-text {
  color: var(--v-accent-base);
}

.underlined-title {
  display: block;
  text-align: center;

  > * {
    display: inline;
    background: linear-gradient(to bottom, transparent 70%, var(--v-primary-base) 70%);
    box-decoration-break: clone;
  }
}

</style>
