<template>
  <svg
    :style="{
      '--pc-stroke-color': _strokeColor,
      '--pc-stroke-width': _strokeWidth,
      backgroundImage: `url(${backgroundImage})`
    }"
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-for="(path, indexP) in paths"
      :key="indexP"
      :d="path"
      :fill="uncovered.has(indexP) ? 'none' : '#ffffff'"
    />
  </svg>
</template>

<script>
import { line, curveBasis } from 'd3-shape'
import { colorValidator } from '@/components/pg/utils/validators'
import { colorMaker } from '@/components/pg/utils/colorable'

const ROW_MULTIPLIER = 4
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
    }
  },

  data: () => ({
    d3CurvedLine: line().curve(curveBasis),

    paths: [],

    maxPiecesCount: 0
  }),

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

      if (Number.isInteger(parseInt(this.uncover))) {
        const rowsToFill = (this.rows * ROW_MULTIPLIER) - this.rows
        Array(parseInt(this.uncover * ROW_MULTIPLIER + 1))
          .fill()
          .forEach((_, i) => {
            uncover.push(i)
            for (i = 1; i < rowsToFill + 1; i++) {
              uncover.push((i * this.maxPiecesCount))
            }
          })
      } else if (Array.isArray(this.uncover)) {
        uncover = this.uncover.map(parseInt)
      }

      return new Set(uncover)
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
    }
  },

  created () {
    this.maxPiecesCount = this.rows * this.columns
    this.buildPaths()
  },

  methods: {
    buildPaths () {
      this.maxPiecesCount = this.rows * this.columns
      this.paths = this.buildPiecePaths(
        this.buildPieces(parseInt(this.rows * ROW_MULTIPLIER, 10), parseInt(this.columns, 10))
      )
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
</style>
