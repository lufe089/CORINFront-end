<template>
  <div class="animated fadeIn">
    <div v-show="noResponses">
      <b-card class="mx-auto" border-variant="info">
        <h4> {{ $t("message.no_resultados") }}</h4>
      </b-card>
    </div>
    <!-- Si existen resultados para mostrar -->
    <div id="results" v-show="!noResponses">
      <b-row>
      <b-col sm="12" md="12">
        <b-card :no-body="true">
          <b-card-body class="p-4 clearfix">
            <div class="h1 bg-success p-4 px-5 font-2xl mr-3 float-left">8.5 </div>
            <div>
              <div class="h2 text-primary mb-0 mt-2">{{$t("message.resultado_alta_tendencia")}}</div>
              <div class="text-muted font-weight-bold font-xs float-right"> Promedio entre 6 y 9 </div>
              <div class="text-muted font-weight-bold font-s"> Numero de respuestas: 3  </div>
              <b-progress height={} class="progress-xs my-1" variant="success" :value="85"/>
              <small class="text-muted">Valor mínimo 1  -- Valor máximo 9 </small>
            </div>
          </b-card-body>
        </b-card>
      </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" md="12">
          <b-card >
          <div class="chart-wrapper">
            <div class="chartStyle" ref="chartByCategories"> </div>
          </div>
        </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" md="6">
          <b-card >
          <div class="chart-wrapper">
            <div class="chartStyle" ref="chartByDimensions"> </div>
          </div>
          </b-card>
        </b-col>
        <b-col sm="12" md="6">
          <b-card >
          <div class="chart-wrapper">
           <div class="chartStyle" ref="chartByComponents"> </div>
          </div>
          </b-card>
        </b-col>
      </b-row>
      </div>
    <!-- Tabla con resultados -->
    <b-row v-show="showResponsesSummaryTables">
      <b-col md="4">
        <c-table-results :caption="$t('message.resultado_dimensiones')" hover :items="scoresByDimensions"></c-table-results>
      </b-col><!--/.col-->
      <b-col md="4">
        <c-table-results :caption="$t('message.resultado_componentes')"  hover :items="scoresByComponents"></c-table-results>
      </b-col><!--/.col-->
      <b-col md="4">
        <c-table-results :caption="$t('message.resultado_categorias')"  hover :items="scoresByCategories"></c-table-results>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
  </div>
</template>

<script>

import axios from 'axios'
import i18n from '../../lang/config'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import ResultsTable from './ResultsTable'

// Le da un comportanemiento animado al chart
am4core.useTheme(am4themesAnimated)
export default {
  name: 'results-module',
  components: {
    /* tag, component name */
    'c-table-results': ResultsTable
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
      scoresByComponents: [],
      errorConsultingData: false,
      noResponses: false,
      showResponsesSummaryTables: false, // Controla la visualizacion de las tablas que resumen los resultados por categoria dimension y componente
      responsesHeadersList: [],
      chartsVisualParameters: []

    }
  },
  created () {
    axios(
      { // Este servicio retorna una arreglo de un solo elemento
        method: 'GET', 'url': this.urlResponses
      }).then(result => {
      console.info('LOG: consultó las respuestas')
      // Se verifica que halla al menos un valor en la respuesta
      if (result.data.length > 0) {
        this.responsesHeadersList = result.data
        for (var i = 0; i < result.data.length; i++) {
          Array.prototype.push.apply(this.responsesList, result.data[i].responsesList)
        }
      } else {
        this.noResponses = true
      }
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
            this.drawChart(this.scoresByDimensions, 'Dimensiones', this.$refs.chartByDimensions, i18n.tc('message.rendimiento_dimension'))
            // this.drawColumnChart(this.scoresByDimensions, 'Dimensiones', this.$refs.chartByDimensionsFull, i18n.tc('message.rendimiento_dimension'))
            this.drawChart(this.scoresByComponents, 'Componentes', this.$refs.chartByComponents, i18n.tc('message.rendimiento_componente'))
            this.drawRadarChart(this.scoresByCategories, 'Categorias', this.$refs.chartByCategories, i18n.tc('message.rendimiento_categoria'))
            // Se cambia la bandera que controla si se muestran las tablas de resultados para indicar que si se pueden mostrar
            this.showResponsesSummaryTables = true
          }, error => {
            // FIXMEscoresByComponents
            console.error(error)
            console.error(i18n.tc('message.error_consuming_service_dimensions', [this.urlDimensions]))
            console.error('Service path:' + this.urlCategories)
            alert(i18n.tc('message.error_consuming_service'))
            this.errorConsultingData = true
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
        this.errorConsultingData = true
      })
    }, error => {
      console.error(error)
      console.error(i18n.tc('message.error_consuming_service_instructions'))
      console.error('Service path:' + this.urlGetItems)
      alert(i18n.tc('message.error_consuming_service'))
      this.errorConsultingData = true
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
          agrupador.promedio = (acumDimension / contAgrupador).toFixed(2)
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
          agrupadorCategoria.promedio = (acumCategoria / contCategoria).toFixed(2)
          agrupadorCategoria.cantItems = contCategoria
        } else {
          agrupadorCategoria.promedio = 0
          agrupadorCategoria.cantItems = 0
        }
      }
      // Calulo de score por componente
      for (var c = 0; c < this.scoresByComponents.length; c++) {
        var agrupadorComponente = this.scoresByComponents[c]
        var contComponente = 0
        var acumComponente = 0
        for (var o = 0; o < this.responsesList.length; o++) {
          var responseComponent = this.responsesList[o]
          // El criterio tiene componentes
          if (responseComponent.item.component != null) {
            if (responseComponent.item.component.id === agrupadorComponente.id && responseComponent.answer_numeric != null) {
              contComponente = 1 + contComponente
              acumComponente = acumComponente + responseComponent.answer_numeric
            }
          }
        }
        if (contComponente > 0 && acumComponente > 0) {
          agrupadorComponente.promedio = (acumComponente / contComponente).toFixed(2)
          agrupadorComponente.cantItems = contComponente
        } else {
          agrupadorComponente.promedio = 0
          agrupadorComponente.cantItems = 0
        }
      }
    },
    drawChart: function (data, label, div, titleText) {
      // we will create the chart here
      // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      let chart = am4core.create(div, am4charts.XYChart)
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = label + ' ( ' + (data.length) + ' ) '
      categoryAxis.title.fontWeight = 'bold'
      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      valueAxis.min = 0
      valueAxis.max = 9
      valueAxis.calculateTotals = false
      valueAxis.strictMinMax = true

      /* Linea de referencia
      var middleLine = chart.plotContainer.createChild(am4core.Line)
      middleLine.strokeOpacity = 1
      middleLine.stroke = am4core.color('#DC3545')
      middleLine.strokeDasharray = '2,2'
      middleLine.align = 'center'
      middleLine.zIndex = 1
      middleLine.adapter.add('y2', function (y2, target) {
        return target.parent.pixelHeight
      })

      */
      var axisRange = valueAxis.axisRanges.create()
      axisRange.value = 300
      axisRange.grid.strokeOpacity = 0.1
      axisRange.label.text = 'Goal'
      axisRange.label.align = 'righ'
      axisRange.label.verticalCenter = 'bottom'
      axisRange.label.fillOpacity = 0.8

      // Customize labels appareance
      valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92')
      valueAxis.renderer.labels.template.fontSize = 15

      // Disable grid values
      categoryAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.grid.template.disabled = true
      // Separacion entre los elementos que se dibujan
      categoryAxis.renderer.minGridDistance = 10

      // Title
      var title = chart.titles.create()
      title.text = titleText
      title.fontSize = 25
      title.marginBottom = 30

      chart.data = data
      /* Series */
      var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueX = 'promedio'
      series.dataFields.categoryY = 'name'
      series.columns.template.tooltipText = '{categoryY}\nValor: {valueX}'
      series.name = 'Rendimiento por ' + label + ' (n = ' + this.responsesHeadersList.length + ')'
      var columnTemplate = series.columns.template
      columnTemplate.height = am4core.percent(25)
      // Preload style for doing circular bulltets
      var circleBullet = columnTemplate.createChild(am4charts.CircleBullet)
      circleBullet.circle.radius = 8
      circleBullet.valign = 'middle'
      circleBullet.align = 'right'
      circleBullet.isMeasured = true
      circleBullet.mouseEnabled = false
      circleBullet.verticalCenter = 'middle'
      // Label
      var columnLabel = circleBullet.createChild(am4core.Label)
      columnLabel.text = ' {valueX}   '
      columnLabel.textAlign = 'end'
      columnLabel.fontSize = 10
      // Alinea la etiqueta con las barras para que se vea bonito
      columnLabel.dy = -5
      columnLabel.dx = 15
      // Cursor
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.behavior = 'none'

      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()

      // And, for a good measure, let's add a legend
      chart.legend = new am4charts.Legend()
    },
    drawRadarChart: function (data, label, div, titleText) {
      let chart = am4core.create(div, am4charts.RadarChart)
      chart.data = data
      chart.padding(10, 10, 10, 10)
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.dataFields.category = 'name'
      // categoryAxis.title.text = label + ' ( ' + (data.length) + ' ) '
      categoryAxis.renderer.minGridDistance = 10
      // Values
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.min = 0
      valueAxis.max = 9

      let axisTooltip = valueAxis.tooltip
      axisTooltip.value = '{categoryX}\nValor: {valueY}'
      let series = chart.series.push(new am4charts.RadarSeries())
      series.dataFields.categoryX = 'name'
      series.dataFields.valueY = 'promedio'
      // Le pone fondo al area
      series.fillOpacity = 0.1
      series.name = 'Rendimiento por ' + label + ' (n = ' + this.responsesHeadersList.length + ')'
      // Da el grosor de la linea
      series.strokeWidth = 4
      chart.legend = new am4charts.Legend()
      // Le pone bolitas en cada cambio de valor
      series.bullets.push(new am4charts.CircleBullet())
      chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarY = new am4core.Scrollbar()
      // Title
      var title = chart.titles.create()
      title.text = titleText
      title.fontSize = 25
      title.marginBottom = 30
      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()
    },
    drawColumnChart: function (data, label, div, titleText) {
      // we will create the chart here
      // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      let chart = am4core.create(div, am4charts.XYChart)
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = label + ' ( ' + (data.length) + ' ) '
      categoryAxis.title.fontWeight = 'bold'
      categoryAxis.labelRotation = '45'
      // Value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      valueAxis.min = 0
      valueAxis.max = 9
      valueAxis.calculateTotals = false
      valueAxis.strictMinMax = true

      /* Linea de referencia
      var middleLine = chart.plotContainer.createChild(am4core.Line)
      middleLine.strokeOpacity = 1
      middleLine.stroke = am4core.color('#DC3545')
      middleLine.strokeDasharray = '2,2'
      middleLine.align = 'center'
      middleLine.zIndex = 1
      middleLine.adapter.add('y2', function (y2, target) {
        return target.parent.pixelHeight
      })

      */
      // Customize labels appareance
      valueAxis.renderer.labels.template.fill = am4core.color('#000000')
      valueAxis.renderer.labels.template.fontSize = 15

      // Disable grid values
      categoryAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.grid.template.disabled = true
      // Separacion entre los elementos que se dibujan
      categoryAxis.renderer.minGridDistance = 10

      // Title
      var title = chart.titles.create()
      title.text = titleText
      title.fontSize = 25
      title.marginBottom = 30

      chart.data = data
      /* Series */
      var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = 'promedio'
      series.dataFields.categoryX = 'name'
      series.columns.template.tooltipText = '{categoryX}\nValor: {valueY}'
      series.name = 'Rendimiento por ' + label + ' (n = ' + this.responsesHeadersList.length + ')'
      var columnTemplate = series.columns.template
      columnTemplate.height = am4core.percent(25)
      // Label
      var columnLabel = columnTemplate.createChild(am4core.Label)
      columnLabel.text = '{valueX}'
      columnLabel.textAlign = 'end'
      columnLabel.fontSize = 14
      columnLabel.valign = 'middle'
      // Cursor
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.behavior = 'zoomXY'

      // And, for a good measure, let's add a legend
      chart.legend = new am4charts.Legend()
      // this.setGeneralChartProperties(chart)
    }
  }
}
</script>
<style scoped>
.chartStyle {
  width: 95%;
  height: 800px;
}
</style>
