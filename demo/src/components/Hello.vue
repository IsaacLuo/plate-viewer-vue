<template lang='pug'>
div
  .hello
  PlateViewer(
    :wellData="JSON.parse(wellData)"
    :wellDataStyleDict="JSON.parse(wellDataStyleDict)"
    :indexStyle="JSON.parse(indexStyle)"
    :width="width*10"
    :height="height*10"
    :rows="rows"
    :columns="columns"
    :onRenderWellStyle="onRenderWellStyle"
    :wellInfo="wellToolTips"
  )
  el-row
    el-col(:span=12 :offset=6)
      div wellData
      el-input(
        type='textarea'
        autosize
        v-model='wellData'
      )
      div wellDataDict
      el-input(
        type='textarea'
        autosize
        v-model='wellDataStyleDict'

      )
      div rows
      el-slider(v-model="rows")
      div columns
      el-slider(v-model="columns")
      div width
      el-slider(
        v-model="width"
      )
      div height
      el-slider(
        v-model="height"
      )


</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      wellData: JSON.stringify({B4: 'wrong', A5: 'correct', A4: 'unknown', C6: 'whatever'}),
      wellDataStyleDict: JSON.stringify({unknown: 'yellow', whatever: 'pink'}),
      wellStyle: JSON.stringify({stroke: 'green', scale: 0.7}),
      borderStyle: JSON.stringify({padding: 15, strokeWidth: 2}),
      indexStyle: JSON.stringify({align: 15, fill: 'black'}),
      width: 80,
      height: 60,
      rows: 8,
      columns: 12,
      wellToolTips: {},
    }
  },
  computed: {
    wellDataJSON: {
      get: () => {
        console.log(this.wellData)
        return JSON.stringify(this.wellData)
      },
      set: (val) => {
        this.wellData = JSON.parse(val)
      },
    }
  },
  methods: {
    onRenderWellStyle (name) {
      if (name === 'A12') {
        return {fill: 'purple'}
      }
    }
  },
  mounted: function () {
    console.log(this)
    this.$http.post(
      'http://ice.dev.genomefoundry.org/ICE-REST/rest/plates/EP1703200001?plate_fields=storage_location,current_location,plate_id,plate_barcode,sampleList&sample_fields=plates_id,plates_barcode,plates_name,wells_id,wells_index,wells_name, tubes_id,tubes_barcode,tubes_name,samples_id,samples_creation_time,storage_location ,current_location,locationList,samples_notes,samples_entries_id,entries_name,additionalAttributes',
      {
        json: JSON.stringify({
          plate_barcode: 'EP1703200001',
          token: '882B6245450ACE95C8FE6502495F4CD5D2EAD1993409CC945E60DEC147AE6D5AD93A04443F96E2B43C3376E7BB399DC569B0962C3E15EA468C727958BE36AB658B382B5FDFFD885383D5F101A7269942',
        }),
        sessionIdForm: '8b5fae94-7595-49ed-ab51-4dcb0724c418',
        userIdForm: 'visitor',
      },
      {
        emulateJSON: true,
      },
    ).then((response) => {
      if (response.status === 200) {
        let {data} = response.body
        let newToolTips = {}
        for (let sample of data.sampleList) {
          newToolTips[sample.wells_index] = sample.entries_name
          this.wellToolTips = newToolTips
        }
      }
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.inputPanel
{
  width: 800;
}
</style>
