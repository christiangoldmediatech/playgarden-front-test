<template>
  <div class="lesson-puzzle-pieces">
    <div class="pieces-content">
      <div class="pieces-image">
        <img :src="puzzlePiece.puzzle.image">
        <puzzle-clip-path />
      </div>

      <div class="pieces-data">
        <div class="remaining-title">
          GET A PUZZLE PIECE!
        </div>

        <div class="remaining-text">
          Watch {{ completeTotal }} in a row
        </div>

        <div class="percentage">
          <div class="remaining-bar">
            <div
              class="remaining-progress"
              :style="{ '--completed': `${(finished/total) * 100}%` }"
            />
          </div>

          <div class="remaining-number">
            {{ finished }}/{{ total }}
          </div>
        </div>
      </div>
    </div>

    <div class="view-puzzle" @click="openLessonPuzzleDialog">
      View<br>
      Puzzle
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PuzzleClipPath from '@/components/PuzzleClipPath.vue'

export default {
  name: 'LessonPuzzlePieces',

  components: {
    PuzzleClipPath
  },

  props: {
    activities: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapState('children/lesson', ['puzzlePiece']),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    total () {
      const videos = this.activities ? this.lesson.lessonsActivities : this.lesson.videos
      return videos.length
    },

    completeTotal () {
      const extra = this.activities ? 'activities' : 'video lessons'
      return `${this.total} ${extra}`
    },

    finished () {
      let count = 0
      const videos = this.activities ? this.lesson.lessonsActivities : this.lesson.videos
      videos.forEach((video) => {
        const source = this.activities ? video.activity : video
        count += Number(Boolean(source && source.viewed && source.viewed.completed))
      })
      return count
    }
  },

  methods: {
    openLessonPuzzleDialog () {
      const { id, name, pieces, image, curriculumType } = this.puzzlePiece.puzzle
      const puzzle = {
        active: true,
        name,
        pieces,
        piecesUnclocked: this.puzzlePiece.piecesUnlock,
        percentageCompleted: (this.puzzlePiece.piecesUnlock / pieces) * 100,
        src: image,
        srcType: 'lazy-src',
        letter: curriculumType.name,
        id,
        completed: false,
        puzzleChildrenId: this.puzzlePiece.id,
        lazy: false
      }
      // puzzleChildrenId
      this.$nuxt.$emit('open-lesson-puzzle-dialog', puzzle)
    }
  }
}
</script>

<style lang="scss">
.lesson-puzzle-pieces {
  display: flex;
  width: 100%;
  background-color: white;
  max-width: 100vw;
  overflow: hidden;
  box-shadow: 0px -8px 24px 0px rgba(0, 0, 0, 0.15);

  @media screen and (min-width: 960px){
    width: auto;
    max-width: 580px;
  }

  .pieces-content {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 8px 12px;
    display: flex;
    align-items: center;

    @media screen and (min-width: 960px){
      padding: 16px 24px;
    }

    .pieces-image {
      margin-right: 12px;
      img {
        width: 40px;
        height: 40px;
        object-fit: none;
        object-position: center;
        vertical-align: middle;
        clip-path: url(#myClip);
        @media screen and (min-width: 960px){
          width: 55px;
          height: 55px;
        }
      }
    }

    .pieces-data {
      .remaining-title {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.5;
        letter-spacing: 2.4px;
        text-align: left;
        color: #606060;
        @media screen and (min-width: 960px){
          font-size: 20px;
        }
      }

      .remaining-text {
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
        text-align: left;
        color: #606060;
        margin-bottom: 8px;
        @media screen and (min-width: 960px){
          font-size: 14px;
        }
      }

      .percentage {
        display: flex;
        .remaining-bar {
          background: rgba(196, 196, 196, 1);
          height: 12px;
          width: 100%;
          border-radius: 6px;
        }

        .remaining-progress {
          width: var(--completed);
          height: 100%;
          background-color: var(--v-accent-base);
          border-radius: 6px;
        }

        .remaining-number {
          font-size: 9px;
          color: #606060;
          white-space: nowrap;
          margin-left: 8px;
          @media screen and (min-width: 960px){
            font-size: 12px;
          }
        }
      }
    }
  }

  .view-puzzle {
    cursor: pointer;
    background-color: var(--v-accent-base);
    color: white;
    flex-shrink: 1;
    flex-grow: 0;
    padding: 6px;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
    display: flex;
    align-items: center;
    @media screen and (min-width: 960px){
      font-size: 16px;
      padding: 12px;
    }
  }
}
</style>
