<template>
  <div>
    <v-menu
      :value="popup.show"
      :position-x="popup.x"
      :position-y="popup.y"
      :min-width="popup.minWidth"
      :content-class="isMobile ? '' : 'v-menu__content_cone'"
      z-index="9999"
    >
      <div class="accent white--text px-4 py-2 text-center">
        <div class="font-weight-bold text-caption text-sm-body-1 my-1">
          {{ popup.message }}
        </div>
        <!--
        <div class="my-1" @click="handlePieceUnlock">
          <a class="text-decoration-underline white--text">Unlock Piece</a>
        </div>
        -->
      </div>
    </v-menu>

    <svg
      :style="{
        '--pc-stroke-color': _strokeColor,
        '--pc-stroke-width': _strokeWidth,
        backgroundImage: `url(${dataUrl})`,
      }"
      :viewBox="`0 0 ${width} ${height}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(path, indexP) in paths"
        :id="`pc-path-${indexP}`"
        :key="indexP"
        :d="path"
        :fill="uncovered.has(indexP) ? 'none' : '#E1E1E1'"
        @mouseenter.stop="handleTooltip(indexP)"
      />
    </svg>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { line, curveBasis } from 'd3-shape'
import { colorValidator } from '@/components/pg/utils/validators'
import { colorMaker } from '@/components/pg/utils/colorable'

const POPUP_MIN_WIDTH_DESKTOP = 370
const POPUP_MIN_WIDTH_MOBILE = 300

const MIN_ROW_COUNT = 3
const MIN_COL_COUNT = 5
// You can find more about theory in these links
// http://dev.inventables.com/2016/02/26/generating-svg-jigsaw-puzzles.html
// http://bl.ocks.org/nevernormal1/f808cffb897c63a8dd4e
export default {
  name: 'PuzzleCover',

  props: {
    backgroundImage: {
      type: String,
      required: true
    },

    columns: {
      type: [Number, String],
      default: 7
    },

    edgesSeed: {
      type: [Number, String],
      default: undefined,
      validator: (value) => {
        if (!value) {
          return true
        }

        value = parseFloat(value)

        return value >= 0 && value <= 1000
      }
    },

    height: {
      type: [Number, String],
      default: 90
    },

    rows: {
      type: [Number, String],
      default: 4
    },

    strokeColor: {
      type: [Object, String],
      default: () => ({ color: 'black', light: 'base' }),
      validator: colorValidator
    },

    strokeWidth: {
      type: [Number, String],
      default: 0.5,
      validator: value => !Number.isNaN(parseFloat(value))
    },

    uncover: {
      type: [Array, Number, String],
      default: undefined, // Ex: 2 | '2' | [0, 5, 6, 8, 4]
      validator: (value) => {
        if (value === undefined || Number.isInteger(parseInt(value))) {
          return true
        }

        if (Array.isArray(value)) {
          value.every(item => Number.isInteger(parseInt(item)))
        }

        return false
      }
    },

    width: {
      type: [Number, String],
      default: 160
    },

    letter: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      d3CurvedLine: line().curve(curveBasis),

      paths: [],

      maxPiecesCount: 0,

      rowCount: 0,

      colCount: 0,

      popup: {
        minWidth: POPUP_MIN_WIDTH_DESKTOP,
        show: false
      },

      handleTooltip: debounce(this._handleTooltip, 300),

      dataUrl: ''
    }
  },

  computed: {
    _edgesSeed () {
      return this.hasEdgeSeed ? parseFloat(this.edgesSeed) / 1000 : 0
    },

    _strokeColor () {
      return colorMaker(this.strokeColor)
    },

    _strokeWidth () {
      return `${parseFloat(this.strokeWidth)}px`
    },

    hasEdgeSeed () {
      return Number.isInteger(parseInt(this.edgesSeed))
    },

    uncovered () {
      let uncover = []

      const uncoveredPieces = parseInt(this.uncover)
      if (Number.isInteger(uncoveredPieces)) {
        if (this.maxPiecesCount > (this.rows * this.columns)) {
          /**
           * We have spaces to fill that will not be covered by the amount if
           * indexes for pieces there are. Let fill thouse out depending on the
           * pieces that have been unlocked
           */
          const piecesCount = this.rows * this.columns
          let spacesOfNpiecesToFill = 0
          let extraSpacesLeft = 0
          if (this.rows * this.columns) {
            spacesOfNpiecesToFill = this.maxPiecesCount / piecesCount
            extraSpacesLeft = this.maxPiecesCount % piecesCount
          }

          // Push the given indexes as those are always correct
          for (let j = 0; j < uncoveredPieces; j++) {
            uncover.push(j)
          }

          if (spacesOfNpiecesToFill) {
            let nSpaceRandomOffset, nSpaceIndexOffset
            const randomPrime = 3
            // Fill n spaces of piecesCount length
            for (let i = 1; i <= spacesOfNpiecesToFill; i++) {
              nSpaceIndexOffset = piecesCount * i
              nSpaceRandomOffset = (i + spacesOfNpiecesToFill) % piecesCount
              for (let j = 1; j <= uncoveredPieces; j++) {
                uncover.push(nSpaceIndexOffset + ((j + nSpaceRandomOffset * randomPrime) % piecesCount))
              }
            }
          }

          if (extraSpacesLeft) {
            // Fill the remainder of spaces to fill of length extraSpacesLeft
            const extraSpacesOffset = (spacesOfNpiecesToFill * piecesCount) + piecesCount
            for (let j = 0; j < uncoveredPieces; j++) {
              uncover.push(extraSpacesOffset + uncoveredPieces - 1)
            }
          }
        } else {
          /**
           * Indexes of pieces are exact, just pushed to the right index the amount of
           * unlocked
           */
          for (let i = 0; i < uncoveredPieces; i++) {
            uncover.push(i)
          }
        }
      } else if (Array.isArray(this.uncover)) {
        uncover = this.uncover.map(parseInt)
      }

      return new Set(uncover)
    },

    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },

  watch: {
    columns () {
      this.buildPaths()
    },

    edgesSeed () {
      this.buildPaths()
    },

    height () {
      this.buildPaths()
    },

    rows () {
      this.buildPaths()
    },

    uncover () {
      this.buildPaths()
    },

    width () {
      this.buildPaths()
    },

    backgroundImage(val) {
      if (val) {
        this.dataUrl = val
      }
    }
  },

  created () {
    this.getDataUrl()
    this.calculateMaxPiezesCount()
    this.buildPaths()
  },

  methods: {
    calculateMaxPiezesCount () {
      this.colCount = Math.max(this.columns, MIN_COL_COUNT)
      this.rowCount = Math.max(this.rows, MIN_ROW_COUNT)

      this.maxPiecesCount = this.colCount * this.rowCount
    },
    buildPaths () {
      this.calculateMaxPiezesCount()
      this.paths = this.buildPiecePaths(
        this.buildPieces(parseInt(this.rowCount, 10), parseInt(this.colCount, 10))
      ).sort()
    },

    // Builds an m + 1 x n matrix of edge shapes. The first and last rows
    // are straight edges.
    buildDistributions (m, n) {
      const lineGroups = []
      let lines = []
      let i, j

      for (j = 0; j < n; j++) {
        lines.push([
          [0, 0],
          [1, 0]
        ])
      }
      lineGroups.push(lines)

      for (i = 1; i < m; i++) {
        lines = []
        for (j = 0; j < n; j++) {
          lines.push(this.edgeDistributions(i + j))
        }
        lineGroups.push(lines)
      }

      lines = []
      for (j = 0; j < n; j++) {
        lines.push([
          [0, 0],
          [1, 0]
        ])
      }
      lineGroups.push(lines)

      return lineGroups
    },

    buildPieces (rowCount, columnCount) {
      const rowHeight = this.height / rowCount
      const columnWidth = this.width / columnCount
      const pieces = []

      const rows = this.buildDistributions(rowCount, columnCount)
      this.offsetPoints(rows, (point, j, i) => {
        return this.offsetPoint(point, j, i, columnWidth, rowHeight)
      })

      const columns = this.buildDistributions(columnCount, rowCount)
      this.offsetPoints(columns, (point, j, i) => {
        return this.offsetPoint(
          this.transposePoint(point),
          i,
          j,
          columnWidth,
          rowHeight
        )
      })

      for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
          const edges = []
          edges.push(rows[rowIndex - 1][columnIndex])
          edges.push(columns[columnIndex + 1][rowIndex - 1])
          edges.push(rows[rowIndex][columnIndex].slice().reverse())
          edges.push(columns[columnIndex][rowIndex - 1].slice().reverse())

          pieces.push(edges)
        }
      }

      return pieces
    },

    buildPiecePaths (pieces) {
      return pieces.map(this.piecePathData)
    },

    // Returns 6 points representing the shape of one edge of a puzzle piece.
    // Point coordinates are expressed as percentage distances across the width
    // and height of the piece.
    edgeDistributions (seed) {
      const randomBetween = (min, max) => {
        return (
          (this.hasEdgeSeed ? this._edgesSeed : Math.random()) * (max - min) +
          min
        )
      }

      const baselineOffsets = {
        xMin: 51,
        xMax: 62,
        yMin: -15,
        yMax: 5
      }

      const upperOffsets = {
        xMin: 20,
        xMax: 30,
        yMin: 20,
        yMax: 44
      }

      const point1 = [0, 0]
      const point2 = [
        randomBetween(baselineOffsets.xMin, baselineOffsets.xMax),
        randomBetween(baselineOffsets.yMin, baselineOffsets.yMax)
      ]
      const point3 = [
        randomBetween(upperOffsets.xMin, upperOffsets.xMax),
        randomBetween(upperOffsets.yMin, upperOffsets.yMax)
      ]
      const point4 = [
        randomBetween(100 - upperOffsets.xMax, 100 - upperOffsets.xMin),
        randomBetween(upperOffsets.yMin, upperOffsets.yMax)
      ]
      const point5 = [
        randomBetween(100 - baselineOffsets.xMax, 100 - baselineOffsets.xMin),
        randomBetween(baselineOffsets.yMin, baselineOffsets.yMax)
      ]
      const point6 = [100, 0]

      const sign = (this.hasEdgeSeed
        ? seed % 2 === 0
        : Math.random() < 0.5)
        ? -1
        : 1

      return [point1, point2, point3, point4, point5, point6].map((p) => {
        return [p[0] / 100, (p[1] * sign) / 100]
      })
    },

    piecePathData (piece) {
      return (
        'M' +
        piece
          .map(this.d3CurvedLine)
          .join(',')
          .replace(/M/g, '')
      )
    },

    offsetPoint (point, columnIndex, rowIndex, columnWidth, rowHeight) {
      const offsetColumnPosition = (percent, columnWidth, columnIndex) => {
        const columnOffset = columnWidth * columnIndex
        return percent * columnWidth + columnOffset
      }

      const offsetRowPosition = (percent, rowHeight, rowIndex) => {
        const rowOffset = rowHeight * rowIndex
        return percent * rowHeight + rowOffset
      }

      const x = offsetColumnPosition(point[0], columnWidth, columnIndex)
      const y = offsetRowPosition(point[1], rowHeight, rowIndex)

      return [x, y]
    },

    offsetPoints (lineGroups, offSetter) {
      for (let i = 0; i < lineGroups.length; i++) {
        const lines = lineGroups[i]

        for (let j = 0; j < lines.length; j++) {
          lines[j] = lines[j].map((point) => {
            return offSetter(point, j, i)
          })
        }
      }
    },

    transposePoint (point) {
      return [point[1], point[0]]
    },

    _handleTooltip (index) {
      this.popup.show = false

      const menuWidth = this.isMobile ? POPUP_MIN_WIDTH_MOBILE : POPUP_MIN_WIDTH_DESKTOP

      const pathElBoundaries = document.querySelector(`#pc-path-${index}`).getBoundingClientRect()
      const yPosition = pathElBoundaries.top + pathElBoundaries.height / 5
      const xPosition =
        pathElBoundaries.left + (pathElBoundaries.width / 2) - (menuWidth / 2)

      let message = this.$t('studentCubby.puzzle.unlockIntro')
      switch (index) {
        case 0:
          message += this.$t('studentCubby.puzzle.videoUnlock', { letter: this.letter, day: 1 })
          break
        case 1:
          message += this.$t('studentCubby.puzzle.worksheetUnlock', { letter: this.letter, day: 1 })
          break
        case 2:
          message += this.$t('studentCubby.puzzle.activitiesUnlock', { letter: this.letter, day: 1 })
          break
        case 3:
          message += this.$t('studentCubby.puzzle.videoUnlock', { letter: this.letter, day: 2 })
          break
        case 4:
          message += this.$t('studentCubby.puzzle.worksheetUnlock', { letter: this.letter, day: 2 })
          break
        case 5:
          message += this.$t('studentCubby.puzzle.activitiesUnlock', { letter: this.letter, day: 2 })
          break
        case 6:
          message += this.$t('studentCubby.puzzle.videoUnlock', { letter: this.letter, day: 3 })
          break
        case 7:
          message += this.$t('studentCubby.puzzle.worksheetUnlock', { letter: this.letter, day: 3 })
          break
        case 8:
          message += this.$t('studentCubby.puzzle.activitiesUnlock', { letter: this.letter, day: 3 })
          break
        case 9:
          message += this.$t('studentCubby.puzzle.videoUnlock', { letter: this.letter, day: 4 })
          break
        case 10:
          message += this.$t('studentCubby.puzzle.worksheetUnlock', { letter: this.letter, day: 4 })
          break
        case 11:
          message += this.$t('studentCubby.puzzle.activitiesUnlock', { letter: this.letter, day: 4 })
          break
        case 12:
          message += this.$t('studentCubby.puzzle.videoUnlock', { letter: this.letter, day: 5 })
          break
        case 13:
          message += this.$t('studentCubby.puzzle.worksheetUnlock', { letter: this.letter, day: 5 })
          break
        case 14:
          message += this.$t('studentCubby.puzzle.activitiesUnlock', { letter: this.letter, day: 5 })
          break
      }

      setTimeout(() => {
        this.popup = {
          ...this.popup,
          show: true,
          minWidth: menuWidth,
          x: xPosition,
          y: yPosition,
          message
        }
      }, 300)
    },

    // TODO
    handlePieceUnlock () {},

    async getDataUrl() {
      const img = await fetch(this.backgroundImage).then(res => res.blob())
      const fr = new FileReader()
      fr.readAsDataURL(img)
      fr.onload = e => (this.dataUrl = e.target.result)
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  background-position: center;
  background-size: cover;
  width: 100%;
}

rect,
circle,
path {
  stroke: var(--pc-stroke-color);
  stroke-width: var(--pc-stroke-width);
}

circle {
  fill: #fff;
  fill-opacity: 0.2;
}

.v-menu__content {
  box-shadow: none;
  height: 85px;

  &_cone:after {
    position: absolute;
    left: 50%;
    margin-left: -16px;
    content: " ";
    border-style: solid;
    border-color: var(--v-accent-base) transparent transparent transparent;
    border-width: 16px 16px 0px 16px;
  }
}
</style>
