<template>
  <v-hover v-slot="{ hover }">
    <v-img
      v-if="letter.picture"
      contain
      class="recorded-letter"
      :class="classes(hover)"
      :src="letter.picture"
    />
    <div v-else class="recorded-letter" :class="classes(hover)">
      {{ letter.name.substr(0, 1) }}
    </div>
  </v-hover>
</template>

<script>
export default {
  name: 'RecordedLetter',

  props: {
    letter: {
      type: Object,
      required: true
    },

    selectedLetter: {
      validator: (val) => {
        return typeof val === 'number' || val === null
      },
      required: false,
      default: null
    },

    listMode: {
      type: Boolean,
      required: false,
      default: false
    },

    small: {
      type: Boolean,
      required: false,
      default: false
    },

    disabled: {
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
    classes () {
      const result = {
        clickable: !this.listMode,
        'recorded-letter-vowel': this.vowels.includes(
          this.letter.name.substr(0, 1)
        ),
        'recorded-letter-active':
          this.selectedLetter === this.letter.id && !this.listMode,
        'recorded-letter-small': this.small,
        'recorded-letter-disabled': this.disabled,
        'recorded-letter-picture': this.letter.picture && this.letter.picture !== null,
        'recorded-letter-picture-small': this.small
      }

      return (hover) => {
        result['recorded-letter-scaled-none'] = hover && !this.listMode
        return result
      }
    }
  }
}
</script>

<style lang="scss">
.recorded-letter {
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
  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
  user-select: none;
  transition: transform 250ms;
  @media screen and(min-width: 1264px) {
    width: 78px;
    height: 78px;
    max-width: 78px;
    max-height: 78px;
    font-size: 60px;
    margin: 8px 28px;
    border-radius: 8px;
  }
  &-vowel {
    color: var(--v-accent-base) !important;
  }
  &-active {
    box-shadow: inset 10px 32px 34px rgba(0, 0, 0, 0.25);
  }
  &-scaled {
    // There is a problem with the shadows when scaling.
    transform: scale(1.125);
  }
  &-small {
    width: 40px;
    height: 40px;
    max-width: 40px;
    max-height: 40px;
    font-size: 26px;
    margin: 12px;
    border-radius: 4px;
  }
  &-disabled {
    filter: grayscale(1);
  }
  &-picture {
    background-image: none;
    @media screen and(min-width: 1264px) {
      width: 78px;
      height: 78px;
      max-width: 78px;
      max-height: 78px;
    }
    &-small {
      width: 40px;
      height: 40px;
      max-width: 40px;
      max-height: 40px;
      font-size: 26px;
      margin: 12px;
      border-radius: 4px;
    }
  }
}
</style>
