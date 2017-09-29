<template lang='pug'>
  .plate-viewer
    svg.plate-viewer-svg(
      v-bind:width='width+200'
      v-bind:height='height+200'
      transform="translate(100,100)"
    )
      g
        rect.plate-viewer-border(
          :x='borderStartX'
          :y='borderStartY'
          :width='borderWidth'
          :height='borderHeight'
          :style='finalBorderStyle'
        )
        g.plate-viewer-index(
          :style="finalIndexStyle"
        )
          text(
            v-for="i in rows"
            :x='rowIndexPosX(i)'
            :y='rowIndexPosY(i)'
            :text-anchor="'end'"
            :alignment-baseline="'middle'"
          ) {{String.fromCharCode(64+i)}}
          text(
            v-for="i in columns"
            :x='columnIndexPosX(i)'
            :y='columnIndexPosY(i)'
            :text-anchor="'middle'"
          ) {{i}}
        g(
          :transform="`translate(${borderStartX + this.finalBorderStyle.padding},${borderStartY + this.finalBorderStyle.padding})`"
        )
          g(
            v-for="i in rows"
            :transform="`translate(0, ${(i-1)*rowIndexSpan + rowIndexSpan/2})`"
          )
            g(
              v-for="j in columns"
              :transform="`translate(${(j-1)*columnIndexSpan + columnIndexSpan/2}, 0)`"
            )
              ellipse.plate-viewer-well(
                :rx="wellRadius * finalWellStyle(i,j).scale"
                :ry="wellRadius * finalWellStyle(i,j).scale"
                :cx="0"
                :cy="0"
                :style="finalWellStyle(i,j)"
              )
</template>

<script>
export default {
  name: 'PlateViewer',
  data () {
    return {
      msg: 'plate viewer',
      defaultIndexStyle: {
        fill: '#00aa00',
        fontSize: '20px',
        align: 15,
      },
      defaultBorderStyle: {
        stroke: '#009900',
        strokeWidth: 1,
        fill: 'none',
        padding: 15,
      },
      defaultWellStyle: {
        stroke: '#009900',
        strokeWidth: 1,
        scale: 0.7,
        fill: '#fff',
      },
      defaultWellDataStyleDict: {
        correct: 'green',
        wrong: 'red',
        undefined: 'white',
      },
    }
  },
  computed: {
    borderStartX () {
      if (this.showColumnIndex) {
        return this.indexWidth
      } else return 0
    },
    borderStartY () {
      if (this.showRowIndex) {
        return this.indexHeight
      } else return 0
    },
    borderWidth () {
      if (this.showColumnIndex) {
        return this.width - this.indexWidth
      } else return this.width
    },
    borderHeight () {
      if (this.showRowIndex) {
        return this.height - this.indexHeight
      } else return this.height
    },
    rowIndexSpan () {
      return (this.borderHeight - this.finalBorderStyle.padding * 2) / this.rows
    },
    columnIndexSpan () {
      return (this.borderWidth - this.finalBorderStyle.padding * 2) / this.columns
    },
    wellRadius () {
      return Math.min(this.rowIndexSpan, this.columnIndexSpan) / 2
    },
    wellDataStyle () {
      let ret = Array(this.rows * this.columns)
      for (let i in this.wellData) {
        if (isNaN(+i) && /^[A-z]\d+$/.test(i)) {
          let rowLetter = i.match(/^[A-z]/)[0]
          let colLetter = i.match(/\d+$/)[0]
          let row = rowLetter.charCodeAt(0) - 65
          if (row >= 32) row -= 32
          let col = parseInt(colLetter) - 1
          let realIndex = row * 12 + col
          ret[realIndex.toString()] = this.wellData[i]
        } else {
          ret[i] = this.wellData[i]
        }
      }
      return ret
    },
    finalBorderStyle () {
      return {...this.defaultBorderStyle, ...this.borderStyle}
    },
    finalIndexStyle () {
      return {...this.defaultIndexStyle, ...this.indexStyle}
    },
    finalWellDataStyleDict () {
      return {...this.defaultWellDataStyleDict, ...this.wellDataStyleDict}
    },
  },
  methods: {
    columnIndexPosX (index) {
      return this.borderStartX + (index - 1) * this.columnIndexSpan + this.columnIndexSpan / 2 + this.finalBorderStyle.padding
    },
    columnIndexPosY (index) {
      return this.borderStartY - this.finalIndexStyle.align
    },
    rowIndexPosY (index) {
      return this.borderStartY + (index - 1) * this.rowIndexSpan + this.rowIndexSpan / 2 + this.finalBorderStyle.padding
    },
    rowIndexPosX (index) {
      return this.borderStartX - this.finalIndexStyle.align
    },
    finalWellStyle (i, j) {
      let fill = this.finalWellDataStyleDict[this.wellDataStyle[(i - 1) * this.columns + (j - 1)]]
      return {...this.defaultWellStyle, ...this.wellStyle, fill}
    },
  },
  props: {
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 600,
    },
    rows: {
      type: Number,
      default: 8,
    },
    columns: {
      type: Number,
      default: 12,
    },
    indexWidth: {
      type: Number,
      default: 80,
    },
    indexHeight: {
      type: Number,
      default: 80,
    },
    showRowIndex: {
      type: Boolean,
      default: true,
    },
    showColumnIndex: {
      type: Boolean,
      default: true,
    },
    indexStyle: {
      type: Object,
      default () {
        return {}
      },
    },
    borderStyle: {
      type: Object,
      default () {
        return {}
      },
    },
    wellStyle: {
      type: Object,
      default () {
        return {}
      },
    },
    wellData: {

    },
    wellDataStyleDict: {
      type: Object,
      default () {
        return {
          correct: 'green',
          wrong: 'red',
          undefined: 'white',
        }
      },
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
