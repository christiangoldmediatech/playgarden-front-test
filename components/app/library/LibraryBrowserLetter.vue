<template>
  <v-hover v-slot="{ hover }">
    <div
      class="library-letter"
      :class="{
        'clickable': hovers,
        'library-letter-vowel': isVowel(),
        'library-letter-scaled': hover && hovers
      }"
      :style="{
        '--rotation': `${rotation}deg`,
        '--size': `${size}px`,
        '--transform-size': (63 / size),
        '--size-lg': `${sizeLg}px`,
        '--transform-size-lg': (140 / sizeLg)
      }"
    >
      {{ letter.name.substr(0, 1) }}
    </div>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { CurriculumType } from '@/models'

export default defineComponent({
  name: 'LibraryBrowserLetter',

  props: {
    letter: {
      type: Object as PropType<CurriculumType>,
      required: true
    },

    rotation: {
      type: Number,
      required: false,
      default: 0
    },

    size: {
      type: Number,
      required: false,
      default: 24
    },

    sizeLg: {
      type: Number,
      required: false,
      default: 48
    },

    hovers: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  setup(props) {
    const vowels = ['A', 'E', 'I', 'O', 'U']

    function isVowel(): boolean {
      return vowels.includes(props.letter.name.substr(0, 1).toUpperCase())
    }

    return {
      isVowel
    }
  }
})
</script>

<style lang="scss" scoped>
.library-letter {
  width: var(--size);
  height: var(--size);
  max-width: var(--size);
  max-height: var(--size);
  font-size: calc(var(--size) * 0.65);
  border-radius: calc(var(--size) * 0.1);
  font-weight: 700;
  line-height: 1.5;
  color: #C2DAA5;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-image: url("~assets/png/wood_background.png");
  user-select: none;
  transition: transform 250ms;
  transform: rotate(var(--rotation));
  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));

  @media screen and(min-width: 1264px) {
    width: var(--size-lg);
    height: var(--size-lg);
    max-width: var(--size-lg);
    max-height: var(--size-lg);
    font-size: calc(var(--size-lg) * 0.65);
    border-radius: calc(var(--size-lg) * 0.1);
  }
  &.library-letter-vowel {
    color: #F89838 !important;
  }
  &.library-letter-scaled {
    transform: scale(var(--transform-size)) rotate(0);
    @media screen and(min-width: 1264px) {
      transform: scale(var(--transform-size-lg)) rotate(0);
    }
  }
}
</style>
