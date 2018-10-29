<template>
  <div class="animated fadeIn">
    <loading :isLoading="isLoading"></loading>
    <div v-show="!isLoading">
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
              <div :class="calculateVariantResults('bg')" class=" h1 p-4 px-5 font-2xl mr-3 float-left">{{overall_average}} </div>
              <div>
                <div class="h2 text-primary mb-0 mt-2" >
                  <div v-show="overall_average>=7">{{$t("message.resultado_alta_tendencia")}}
                    <div class="text-muted font-weight-bold font-xs"> Promedio entre 7 y 9 </div>
                  </div>
                  <div v-show="overall_average<=3">{{$t("message.resultado_baja_tendencia")}}
                    <div class="text-muted font-weight-bold font-xs"> Promedio entre 1 y 3 </div>
                  </div>
                  <div v-show="overall_average> 3 && overall_average< 7">{{$t("message.resultado_media_tendencia")}}
                    <div class="text-muted font-weight-bold font-xs"> Promedio entre 4 y 6 </div>
                  </div>
                </div>
                <b-progress height={} class="progress-xs my-1" :variant=calculateVariantResults()  :max=max :value="promedioBarra"/>
                <div class="text-muted font-weight-bold font-s"> Numero de respuestas: {{n}}
                  <div class="float-right"><small class="text-muted">Valor mínimo 1  -- Valor máximo 9 </small></div>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
        </b-row>
        <b-row>
          <b-col sm="12" md="12">
            <b-card >
            <div class="chart-wrapper">
              <div class="radarStyle" ref="chartByCategories"> </div>
            </div>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <!-- Resultados por categorias -->
          <b-col md="4"  sm="12">
            <c-table-results :caption="$t('message.resultado_categorias')"  hover  :items="average_by_categories"></c-table-results>
          </b-col>
          <b-col md="4"  sm="12">
            <c-table-results :caption="$t('message.resultado_categorias_directivos')"  hover  :items="categories_average_by_directives"></c-table-results>
          </b-col>
          <b-col md="4"  sm="12">
            <c-table-results :caption="$t('message.resultado_categorias_no_directivos')"  hover  :items="categories_average_by_no_directives"></c-table-results>
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
        <!-- Tabla con resultados dimensiones y componentes -->
        <b-row>
          <b-col md="6">
            <c-table-results :caption="$t('message.resultado_dimensiones')" hover :items="average_by_dimensions"></c-table-results>
          </b-col><!--/.col-->
          <b-col md="6">
            <c-table-results :caption="$t('message.resultado_componentes')"  hover :items="average_by_components"></c-table-results>
          </b-col><!--/.col-->
        </b-row><!--/.row-->
        <!-- Tabla que muestra los participantes que han contestado -->
        <b-row>
          <b-col md="12">
             <!--<c-table-results :caption="$t('message.resultado_componentes')"  hover :items="responsesHeadersList"></c-table-results> -->
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import i18n from '../../lang/config'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import ResultsTable from './ResultsTable'
import BDData from './_BDData.js'

// Le da un comportanemiento animado al chart
am4core.useTheme(am4themesAnimated)
export default {
  name: 'results-module',
  components: {
    /* tag, component name */
    'c-table-results': ResultsTable,
    loading: () => import('./Loading')
  },
  data () {
    return {
      participantResponse: {},
      serviceResult: {},
      result: '',
      isSurveyVisible: false,
      urlResponses: BDData.apiURL + 'participantsResponse/',
      urlAverageData: BDData.apiURL + 'averageFilters/',
      responsesList: [],
      n: 0,
      average_by_dimensions: [],
      average_by_categories: [],
      average_by_components: [],
      categories_average_by_directives: [],
      categories_average_by_no_directives: [],
      errorConsultingData: false,
      noResponses: false,
      showResponsesSummaryTables: false, // Controla la visualizacion de las tablas que resumen los resultados por categoria dimension y componente
      responsesHeadersList: [],
      overall_average: 0.0,
      promedioBarra: 0.0,
      max: 9,
      isLoading: true
    }
  },
  created: function () {
    this.consultAverageData()
    /* axios(
      { // Este servicio retorna una arreglo de un solo elemento
        method: 'GET', 'url': this.urlResponses
      }).then(result => {
      console.info('LOG: consultó las respuestas')
      // Se verifica que halla al menos un valor en la respuesta
      if (result.data.length > 0) {
        this.nlt.data
        for (var i = 0; i < result.data.length; i++) {
          Array.prototype.push.apply(this.responsesList, result.data[i].responsesList)
        }
        // Se consultan los datos del promedio
        this.consultAverageData()
      } else {
        this.noResponses = true
      }
    }, error => {
      console.error(error)
      console.error(i18n.tc('message.error_consuming_service_instructions'))
      console.error('Service path:' + this.urlGetItems)
      alert(i18n.tc('message.error_consuming_service'))
      this.errorConsultingData = true
      this.isLoading = false
    }
    ) */
  },
  methods: {
    consultAverageData: function () {
      axios.get(this.urlAverageData).then(response => {
        var averageChartsData = response.data
        console.info('LOG: consultó average data')
        if (averageChartsData['n'] > 0) {
          this.overall_average = averageChartsData['overall_average'].toFixed(2)
          this.n = averageChartsData['n']
          this.promedioBarra = averageChartsData['overall_average']
          this.average_by_categories = averageChartsData['average_by_categories']
          this.average_by_dimensions = averageChartsData['average_by_dimensions']
          this.average_by_components = averageChartsData['average_by_components']
          this.categories_average_by_directives = averageChartsData['categories_average_by_directives']
          this.categories_average_by_no_directives = averageChartsData['categories_average_by_no_directives']
          // this.average_by_categories = averageChartsData['average_by_categories']
          this.drawChart(this.average_by_dimensions, 'Dimensiones', this.$refs.chartByDimensions, i18n.tc('message.rendimiento_dimension'))
          // this.drawColumnChart(this.average_by_dimensions, 'Dimensiones', this.$refs.chartByDimensionsFull, i18n.tc('message.rendimiento_dimension'))
          this.drawChart(this.average_by_components, 'Componentes', this.$refs.chartByComponents, i18n.tc('message.rendimiento_componente'))
          this.drawRadarChart('Categorias', this.$refs.chartByCategories, i18n.tc('message.rendimiento_categoria'))
          // Se cambia la bandera que controla si se muestran las tablas de resultados para indicar que si se pueden mostrar
          this.showResponsesSummaryTables = true
          this.isLoading = false
          // Se ordenan los resultados para mostrarlos ordenados en las tablas que resumen los resultados
          // this.sortJSON(this.average_by_dimensions, 'average', 'asc')
          // this.sortJSON(this.average_by_components, 'average', 'asc')
          // this.sortJSON(this.average_by_categories, 'average', 'asc')
        } else {
          this.noResponses = true
          this.isLoading = false
        }
      }, error => {
        // FIXME
        console.error(JSON.stringify(error))
        console.error(i18n.tc('message.error_consuming_service', this.urlAverageData))
        console.error('Service path:' + this.urlAverageData)
        alert(i18n.tc('message.error_consuming_service'))
        this.errorConsultingData = true
        this.isLoading = false
      })
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
      series.dataFields.valueX = 'average'
      series.dataFields.categoryY = 'name'
      series.columns.template.tooltipText = '{categoryY}\nValor: {valueX}'
      series.name = label + ' (n = ' + this.n + ')'
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
      columnLabel.fontSize = 12
      // Alinea la etiqueta con las barras para que se vea bonito
      columnLabel.dy = -5
      columnLabel.dx = 15
      // Cursor
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.behavior = 'none'
      chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarY = new am4core.Scrollbar()

      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()

      // And, for a good measure, let's add a legend
      chart.legend = new am4charts.Legend()
    },
    drawRadarChart: function (label, div, titleText) {
      let chart = am4core.create(div, am4charts.RadarChart)
      // Organiza la categorias para que se pinten todos enel mismo orden y se vea bien el area
      this.sortJSON(this.categories_average_by_no_directives, 'name', 'asc')
      this.sortJSON(this.categories_average_by_directives, 'name', 'asc')
      this.sortJSON(this.average_by_categories, 'name', 'asc')
      chart.data = this.average_by_categories
      chart.padding(10, 10, 10, 10)
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.dataFields.category = 'name'
      // categoryAxis.title.text = label + ' ( ' + (data.length) + ' ) '
      categoryAxis.renderer.minGridDistance = 5
      // Values
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.min = 0
      valueAxis.max = 9
      let series = chart.series.push(new am4charts.RadarSeries())
      // chart.toolTip = axisTooltip
      series.dataFields.categoryX = 'name'
      series.dataFields.valueY = 'average'
      // Le pone fondo al area
      series.fillOpacity = 0.1
      series.name = 'Todos (n =' + this.n + ')'
      // Da el grosor de la linea
      series.strokeWidth = 3

      // Series no directores
      if (this.categories_average_by_no_directives.length > 0) {
        let seriesNoDirectors = chart.series.push(new am4charts.RadarSeries())
        seriesNoDirectors.data = this.categories_average_by_no_directives
        seriesNoDirectors.dataFields.categoryX = 'name'
        seriesNoDirectors.dataFields.valueY = 'average'
        seriesNoDirectors.strokeWidth = 2
        seriesNoDirectors.name = 'No directores (n = ' + this.categories_average_by_no_directives[0].n + ')'
        seriesNoDirectors.bullets.push(new am4charts.CircleBullet())
      }
      // Series directores
      if (this.categories_average_by_directives.length > 0) {
        let seriesDirectors = chart.series.push(new am4charts.RadarSeries())
        seriesDirectors.data = this.categories_average_by_directives
        seriesDirectors.dataFields.categoryX = 'name'
        seriesDirectors.dataFields.valueY = 'average'
        seriesDirectors.strokeWidth = 2
        seriesDirectors.name = 'Directores (n = ' + this.categories_average_by_directives[0].n + ')'
        seriesDirectors.bullets.push(new am4charts.CircleBullet())
      }

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
      series.dataFields.valueY = 'average'
      series.dataFields.categoryX = 'name'
      series.columns.template.tooltipText = '{categoryX}\nValor: {valueY}'
      series.name = label + ' (n = ' + this.n + ')'
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
    },
    calculateVariantResults: function (type) {
      var variant = ''
      if (this.overall_average >= 7) {
        variant = 'success'
      } else if (this.overall_average <= 3) {
        variant = 'danger'
      } else {
        variant = 'warning'
      }
      if (type === 'bg') {
        return 'bg-' + variant
      } else {
        return variant
      }
    },
    sortJSON: function (data, key, orden) {
      return data.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        if (orden === 'asc') {
          return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        }

        if (orden === 'desc') {
          return ((x > y) ? -1 : ((x < y) ? 1 : 0))
        }
      })
    }
  }
}
</script>
<style scoped>
.radarStyle {
  width: 95%;
  height: 500px;
}
.chartStyle {
  width: 95%;
  height: 700px;
}
.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
