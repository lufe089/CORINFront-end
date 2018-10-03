<template>
  <div class="animated fadeIn">
    <b-card-group columns class="card-columns cols-2">
      <b-card header="Radar chart">
        <div >
           <div class="chartStyle" ref="chartRadar"> </div>
        </div>R
      </b-card>
      <b-card header="AMChart">
        <div class="chart-wrapper">
          <div class="chartStyle" ref="chartdiv"> </div>
        </div>
      </b-card>
    </b-card-group>
    <b-card-group columns class="card-columns cols-1">
      <b-card header="PerformanceByCriterion">
        <div class="chart-wrapper">
          <performance-by-criterion-chart></performance-by-criterion-chart>
        </div>
      </b-card>
    </b-card-group>
    {{responsesList}}
  </div>
</template>

<script>

import BarExample from '@/views/charts/barExample.vue'
import PerformanceByCriteriaChart from '@/views/charts/PerformanceByCriteriaChart'
import axios from 'axios'
import i18n from '../../lang/config'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

// Le da un comportanemiento animado al chart
am4core.useTheme(am4themesAnimated)
export default {
  name: 'results-module',
  components: {
    /* tag, component name */
    BarExample,
    'performance-by-criterion-chart': PerformanceByCriteriaChart
  },
  data () {
    return {
      participantResponse: {},
      serviceResult: {},
      result: '',
      isSurveyVisible: false,
      // parameters: BDData.parameters,
      urlResponses: 'http://127.0.0.1:8000/participantsResponse/',
      urlDimensions: 'http://127.0.0.1:8000/dimensions/',
      urlCategories: 'http://127.0.0.1:8000/categories/',
      urlComponents: 'http://127.0.0.1:8000/components/',
      responsesList: [],
      scoresByDimensions: [],
      scoresByCategories: [],
      scoresByComponents: []

    }
  },
  mounted () {
    axios(
      { // Este servicio retorna una arreglo de un solo elemento
        method: 'GET', 'url': this.urlResponses
      }).then(result => {
      console.info('LOG: consultó las respuestas')
      this.responsesList = result.data[0].responsesList
      axios.get(this.urlDimensions).then(response => {
        this.scoresByDimensions = response.data
        console.info('LOG: consultó lista de dimensiones')
        axios.get(this.urlCategories).then(response => {
          this.scoresByCategories = response.data
          console.info('LOG: consultó lista de categorias')
          axios.get(this.urlComponents).then(response => {
            this.scoresByComponents = response.data
            console.info('LOG: consultó lista de componentes')
            this.prepareData()
            this.drawChart()
            this.drawRadarChart(this.scoresByCategories)
          }, error => {
            // FIXME
            console.error(error)
            console.error(i18n.tc('message.error_consuming_service_dimensions', this.urlDimensions))
            console.error('Service path:' + this.urlCategories)
            alert(i18n.tc('message.error_consuming_service'))
          })
        }, error => {
          // FIXME
          console.error(error)
          console.error(i18n.tc('message.error_consuming_service_dimensions', this.urlDimensions))
          console.error('Service path:' + this.urlCategories)
          alert(i18n.tc('message.error_consuming_service'))
        })
      }, error => {
        // FIXME
        console.error(error)
        console.error(i18n.tc('message.error_consuming_service_dimensions', this.urlDimensions))
        console.error('Service path:' + this.urlDimensions)
        alert(i18n.tc('message.error_consuming_service'))
      })
    }, error => {
      console.error(error)
      console.error(i18n.tc('message.error_consuming_service_instructions'))
      console.error('Service path:' + this.urlGetItems)
      alert(i18n.tc('message.error_consuming_service'))
    }
    )
  },
  methods: {
    prepareData: function () {
      // Calculo el score por dimensiones
      for (var i = 0; i < this.scoresByDimensions.length; i++) {
        var agrupador = this.scoresByDimensions[i]
        var contAgrupador = 0
        var acumDimension = 0
        for (var j = 0; j < this.responsesList.length; j++) {
          var response = this.responsesList[j]
          if (response.item.dimension.id === agrupador.id && response.answer_numeric != null) {
            contAgrupador = 1 + contAgrupador
            acumDimension = acumDimension + response.answer_numeric
          }
        }
        if (contAgrupador > 0 && acumDimension > 0) {
          agrupador.promedio = acumDimension / contAgrupador
          agrupador.cantItems = contAgrupador
        } else {
          agrupador.promedio = 0
          agrupador.cantItems = 0
        }
      }
      // Calculo del score por categorias
      for (var s = 0; s < this.scoresByCategories.length; s++) {
        var agrupadorCategoria = this.scoresByCategories[s]
        var contCategoria = 0
        var acumCategoria = 0
        for (var t = 0; t < this.responsesList.length; t++) {
          var responseCategoria = this.responsesList[t]
          if (responseCategoria.item.category.id === agrupadorCategoria.id && responseCategoria.answer_numeric != null) {
            contCategoria = 1 + contCategoria
            acumCategoria = acumCategoria + responseCategoria.answer_numeric
          }
        }
        if (contCategoria > 0 && acumCategoria > 0) {
          agrupadorCategoria.promedio = acumCategoria / contCategoria
          agrupadorCategoria.cantItems = contCategoria
        } else {
          agrupadorCategoria.promedio = 0
          agrupadorCategoria.cantItems = 0
        }
      }

      console.log(this.scoresByCategories)
    },
    drawChart: function () {
      // we will create the chart here
      let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = 'Dimensiones'
      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      valueAxis.min = 0
      valueAxis.max = 9
      valueAxis.calculateTotals = false
      valueAxis.strictMinMax = true

      var middleLine = chart.plotContainer.createChild(am4core.Line)
      middleLine.strokeOpacity = 1
      middleLine.stroke = am4core.color('#DC3545')
      middleLine.strokeDasharray = '2,2'
      middleLine.align = 'center'
      middleLine.zIndex = 1
      middleLine.adapter.add('y2', function (y2, target) {
        return target.parent.pixelHeight
      })

      var axisRange = valueAxis.axisRanges.create()
      axisRange.value = 300
      axisRange.grid.strokeOpacity = 0.1
      axisRange.label.text = 'Goal'
      axisRange.label.align = 'righ'
      axisRange.label.verticalCenter = 'bottom'
      axisRange.label.fillOpacity = 0.8

      // Customize labels appareance
      // valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92')
      // valueAxis.renderer.labels.template.fontSize = 15

      // Disable grid values
      categoryAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.grid.template.disabled = true
      chart.data = this.scoresByDimensions
      /* Series */
      var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueX = 'promedio'
      // Instead of graph.valueField = 'value'
      series.dataFields.categoryY = 'name'
      series.name = 'Dimensiones'
      // Instead of ballonText graph.balloonText='[[category]]: <b>[[value]]'
      // It holds a 'template' object of type RoundedRectangle which we can use to set a 'default' column appearance for our series.
      series.columns.template.tooltipText = 'Dimension: {categoryY}\nValor: {valueX}'
      // series.columns.template.fill = am4core.color('#104547')
      // series.columns.template.stroke = am4core.color('#ff0000') // red outline
      // series.columns.template.fill = am4core.color('#00ff00') // green fill // red outline
      var columnTemplate = series.columns.template
      columnTemplate.height = am4core.percent(20)
      /* Degrade de colores segun el puntaje */
      // series.heatRules.push({ target: columnTemplate, property: 'fill', dataField: 'valueX', min: am4core.color('#e5dc36'), max: am4core.color('#5faa46') })

      // Preload style for doing circular bulltets
      var circleBullet = columnTemplate.createChild(am4charts.CircleBullet)
      circleBullet.circle.radius = 10
      circleBullet.valign = 'middle'
      circleBullet.align = 'right'
      circleBullet.isMeasured = true
      circleBullet.mouseEnabled = false
      circleBullet.verticalCenter = 'middle'

      /* var bullet1 = series.bullets.push(new am4charts.LabelBullet())
      bullet1.label.text = '{valueX.litres.formatNumber("#.00")}%'
      bullet1.label.fill = am4core.color('#ccccff')
      bullet1.locationX = 0.5 */
      var labelBullet = series.bullets.push(new am4charts.LabelBullet())
      labelBullet.label.text = 'algo'
      labelBullet.label.fill = am4core.color('#ccccff')
      labelBullet.locationY = 0.5
      // Etiqueta para el bullet que muestra el valor del gráfico
      // var labelBullet = new am4charts.LabelBullet()
      // series.bullets.push(labelBullet)
      // labelBullet.label.text = '{valueX.value.formatNumber("#.")}'
      // labelBullet.label.text = 'otro'
      // labelBullet.strokeOpacity = 0
      // labelBullet.stroke = am4core.color('#dadada')
      // labelBullet.dy = -20
      // Cursor
      /* var cursor = new am4charts.XYCursor()
      cursor.behavior = 'panX'
      cursor.lineY.disabled = true
      chart.cursor = cursor */

      // And, for a good measure, let's add a legend
      chart.legend = new am4charts.Legend()

      this.setGeneralChartProperties(chart)
    },
    drawRadarChart: function (data) {
      let chart = am4core.create(this.$refs.chartRadar, am4charts.RadarChart)
      chart.data = data
      chart.padding(10, 10, 10, 10)
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.dataFields.category = 'name'
      categoryAxis.renderer.minGridDistance = 60
      chart.yAxes.push(new am4charts.ValueAxis())

      let series = chart.series.push(new am4charts.RadarSeries())
      series.dataFields.categoryX = 'name'
      series.dataFields.valueY = 'promedio'
      series.tooltipText = 'Dimension: {categoryY}\nValor: {valueX}'
      // series.columns.template.fill = am4core.color('#CDA2AB')
      // series.columns.template.radarColumn.cornerRadius = 30
      series.fillOpacity = 0.6
      chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarY = new am4core.Scrollbar()
      this.setGeneralChartProperties(chart)
    },
    setGeneralChartProperties: function (chart) {
      chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarY = new am4core.Scrollbar()
      chart.cursor = new am4charts.RadarCursor()
      chart.cursor.lineY.disabled = true
      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()
    }
  }
}
</script>
<style scoped>
.chartStyle {
  width: 100%;
  height: 100%;
}
</style>
