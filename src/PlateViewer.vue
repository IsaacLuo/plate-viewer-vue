<template lang='pug'>
  .plate-viewer
    svg.plate-viewer-svg(
      v-bind:width='width+20'
      v-bind:height='height+20'
      transform="translate(10,10)"
      v-on:mousemove="onMouseMove"
      margin-left="-10"
      margin-top="-10"
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
          text.plate-viewer-row-index(
            v-for="i in rows"
            :x='rowIndexPosX(i)'
            :y='rowIndexPosY(i)'
            :text-anchor="'end'"
            :alignment-baseline="'middle'"
          ) {{String.fromCharCode(64+i)}}
          text.plate-viewer-col-index(
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
                :rx="wellRadius * finalBaseWellStyle.scale"
                :ry="wellRadius * finalBaseWellStyle.scale"
                :cx="0"
                :cy="0"
                :style="finalWellStyle(i-1,j-1)"
                v-on:click="onClickWell"
                :data-row="(i-1)"
                :data-col="(j-1)"
                :data-well-name="wellName(i-1,j-1)"
                v-on:mouseenter="onMouseEnterWell(i-1, j-1)"
                v-on:mouseleave="showTooltip=false"
              )
        g(
          :transform="`translate(${tooltipX}, ${tooltipY})`"
          v-if="showTooltip"
        )
          //- rect.tooltip-rect(
          //-   :x="0"
          //-   :y="0"
          //-   :width="tooltipWidth"
          //-   :height="tooltipHeight"
          //- )
          //- text(
          //-   :alignment-baseline="'before-edge'"
          //- ) {{wellToolTip(i-1, j-1)}}
                //- title.plate-viewer-well-title {{wellToolTip(i-1, j-1)}}
          foreignObject(
            :width="tooltipWidth"
            :height="tooltipHeight"
          )
            div.tooltip
              .tooltipHeader {{tooltipHeader}}
              .tooltipText {{tooltipText}}
</template>

<script>
export default {
  name: 'PlateViewer',
  data () {
    return {
      msg: 'plate viewer',
      defaultIndexStyle: {
        align: 0,
      },
      defaultBorderStyle: {
        padding: 15,
      },
      defaultWellStyle: {
        scale: 0.7,
      },
      defaultWellDataStyleDict: {
        correct: 'green',
        wrong: 'red',
        undefined: 'white',
      },
      mouseX: 0,
      mouseY: 0,
      showTooltip: false,
      tooltipWidth: 150,
      tooltipHeight: 75,
      tooltipText: '',
      tooltipHeader: '',
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
    finalBaseWellStyle () {
      return {...this.defaultWellStyle, ...this.wellStyle}
    },
    wellToolTipDict () {
      let ret = {}
      console.log(this.wellInfo)
      for (let i in this.wellInfo) {
        let rowLetter = i.match(/^[A-z]/)[0]
        let colLetter = i.match(/\d+$/)[0]
        let row = rowLetter.charCodeAt(0) - 65
        if (row >= 32) row -= 32
        let col = parseInt(colLetter) - 1
        let realIndex = row * 12 + col
        ret[realIndex.toString()] = this.wellInfo[i]
      }
      console.log(ret)
      return ret
    },
    tooltipX () {
      if (this.mouseX > this.width - this.tooltipWidth) {
        return this.mouseX - this.tooltipWidth - 10
      } else return this.mouseX + 10
    },
    tooltipY () {
      if (this.mouseY > this.height - this.tooltipHeight) {
        return this.mouseY - this.tooltipHeight - 20
      } else return this.mouseY + 20
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
      let customFunctionResult = this.onRenderWellStyle(this.wellName(i, j))
      if (customFunctionResult) {
        return {...this.finalBaseWellStyle, ...customFunctionResult}
      } else {
        let fill = this.finalWellDataStyleDict[this.wellDataStyle[(i) * this.columns + (j)]]
        return {...this.finalBaseWellStyle, fill}
      }
    },
    wellName (row, col) {
      let ret = String.fromCharCode(65 + row)
      ret += (col + 1)
      return ret
    },
    onClickWell (event) {
      const wellName = event.target.dataset.wellName
      this.$emit('clickWell', wellName)
    },
    wellToolTip (row, col) {
      let ret = ''
      let info = this.wellToolTipDict[row * this.columns + col]
      if (info) ret += info
      return ret
    },
    onMouseMove (event) {
      console.log(event.offsetX, event.offsetY)
      this.mouseX = event.offsetX
      this.mouseY = event.offsetY
    },
    onMouseEnterWell (row, col) {
      this.showTooltip = true
      this.tooltipHeader = this.wellName(row, col)
      this.tooltipText = this.wellToolTip(row, col)
    }
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
      default: 20,
    },
    indexHeight: {
      type: Number,
      default: 20,
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
    onRenderWellStyle: {
      type: Function,
      default (data, row, col) {

      }
    },

    wellInfo: {
      type: Object,
      default () {
        return {}
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.plate-viewer-index
{
  text
  {
    fill: #00aa00;
    font-size: 20px;
  }
  text.plate-viewer-row-index
  {
    margin-right:15px;
  }
  text.plate-viewer-col-index
  {
    margin-bottom:15px;
  }
}
.plate-viewer-border
{
  stroke: #009900;
  stroke-width: 1;
  fill: none;
}
.plate-viewer-well
{
  stroke: #009900;
  stroke-width: 1;
  fill: #fff;
  cursor: pointer;

}

.plate-viewer-well-title
{
  fill: #009900;
}

.tooltip-rect
{
  fill: yellow;
  stroke:black;
  stroke-width:1;
}
div.tooltip
{
  background: yellow;
  border: solid 1px;
  word-break: break-all;
  overflow: hidden;
}
</style>
