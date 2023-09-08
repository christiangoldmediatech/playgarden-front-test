<template>
  <v-hover v-slot="{ hover }">
    <v-img
      v-if="hasPicture"
      contain
      class="letter letter-picture"
      :class="letterClasses(hover)"
      :src="picture"
      v-on="$listeners"
    />
    <div
      v-else
      class="letter"
      :class="letterClasses(hover)"
      v-on="$listeners"
    >
      {{ letterText }}
    </div>
  </v-hover>
</template>

<script>
export default {
  name: 'CarouselLetter',

  props: {
    picture: {
      type: String,
      required: false,
      default: ''
    },

    selected: {
      type: Boolean,
      required: false,
      default: false
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    name: {
      type: String,
      required: true
    },

    scalesOnHover: {
      type: Boolean,
      required: false,
      default: true
    },

    clickable: {
      type: Boolean,
      required: false,
      default: true
    },

    word: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      vowels: ['A', 'E', 'I', 'O', 'U']
    }
  },

  computed: {
    letterText () {
      if (this.word) {
        return this.name
      }
      return this.name.substr(0, 1).toUpperCase()
    },

    hasPicture () {
      return Boolean(this.picture)
    },

    letterClasses () {
      const classes = {
        clickable: this.clickable && !this.disabled,
        'letter-vowel': this.vowels.includes(this.letterText) || this.word,
        'letter-active': this.selected,
        'letter-disabled': this.disabled,
        'letter-picture': this.hasPicture,
        'letter-word': this.word
      }

      return (hover) => {
        classes.scaled = hover && this.scalesOnHover
        return classes
      }
    }
  }
}
</script>

<style lang="scss">
.letter {
  width: 40px;
  height: 40px;
  max-width: 40px;
  max-height: 40px;
  font-size: 26px;
  margin: 12px;
  border-radius: 4px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--v-primary-base);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-image: url("~assets/png/wood_background.png");
  user-select: none;
  transition: transform 250ms;
  // @media screen and(min-width: 1264px) {
  //   width: 78px;
  //   height: 78px;
  //   max-width: 78px;
  //   max-height: 78px;
  //   font-size: 60px;
  //   margin: 8px 28px;
  //   border-radius: 8px;
  // }
  &-vowel {
    color: var(--v-accent-base) !important;
  }
  &-active {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  &-scaled {
    // There is a problem with the shadows when scaling.
    transform: scale(1.125);
  }
  // &-small {
  //   width: 40px;
  //   height: 40px;
  //   max-width: 40px;
  //   max-height: 40px;
  //   font-size: 26px;
  //   margin: 12px;
  //   border-radius: 4px;
  // }
  &-disabled {
    filter: grayscale(1);
  }
  &-picture {
    background-image: none;
    // @media screen and(min-width: 1264px) {
    //   width: 78px;
    //   height: 78px;
    //   max-width: 78px;
    //   max-height: 78px;
    // }
    // &-small {
    //   width: 40px;
    //   height: 40px;
    //   max-width: 40px;
    //   max-height: 40px;
    //   font-size: 26px;
    //   margin: 12px;
    //   border-radius: 4px;
    // }
  }
  &-word {
    width: auto;
    padding: 0px 24px;
  }
}
</style>
