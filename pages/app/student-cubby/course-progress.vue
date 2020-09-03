<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <underlined-title class="text-h3" text="Review all Curriculum" />

        <p class="mt-5">
          Scroll through to review your lessons and worksheets!
        </p>
      </div>

      <v-row>
        <letter-card
          v-for="letter in letters"
          :key="`letter-card-${letter.id}`"
          v-bind="{ letter }"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import LetterCard from '@/components/app/student-cubby/LetterCard.vue'

export default {
  name: 'CourseProgress',

  components: {
    LetterCard
  },

  data: () => {
    return {
      letters: []
    }
  },

  created () {
    this.loadLetters()
  },

  methods: {
    ...mapActions('admin/curriculum', ['getTypes']),

    async loadLetters () {
      this.letters = await this.getTypes()
    }
  }
}
</script>
