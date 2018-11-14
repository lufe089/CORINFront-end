<template>
  <div class="animated fadeIn">
    <loading :isLoading="isLoading"></loading>
    <div v-show="!isLoading">
      <b-alert :show="noResponses"><h4>{{$t("message.no_resultados")}}</h4></b-alert>
      <!-- Si existen resultados para mostrar -->
      <div id="results" v-show="!noResponses">
        <!-- Results by categories only-->
        <div id="result-by-categories" v-show="showView('/result-by-categories')">
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
          <!-- Resultados por categorias -->
          <b-col md="4"  sm="12">
            <c-table-results :caption="$t('message.resultado_categorias')"  hover  :items="average_by_categories"></c-table-results>
          </b-col>
          <b-col sm="12" md="8">
            <b-card >
            <div class="chart-wrapper" height="100%">
              <div class="radarStyle" ref="chartByCategories"> </div>
            </div>
            </b-card>
          </b-col>
        </b-row>
        </div> <!-- End result-by-categories-div-->
        <!-- Results by directives and no directives-->
        <div id="result-by-directives" v-show="showView('/result-by-directives')">
        <b-row>
           <b-col md="12">
            <b-card >
            <div class="chart-wrapper">
               <div class="radarStyle" ref="chartByDirectivesNoDirectives"> </div>
            </div>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6"  sm="12">
            <c-table-results :caption="$t('message.resultado_categorias_directivos')"  hover  :items="categories_average_by_directives"></c-table-results>
          </b-col>
          <b-col md="6"  sm="12">
            <c-table-results :caption="$t('message.resultado_categorias_no_directivos')"  hover  :items="categories_average_by_no_directives"></c-table-results>
          </b-col>
        </b-row>
        </div> <!-- End result-by-directives-div-->
         <!-- Results by areas-->
        <div id="result-by-areas" v-show="showView('/result-by-areas')">
        <b-row>
          <b-col md="4"  sm="12">
            <c-table-results :caption="$t('message.rendimiento_areas')"  hover  :items="average_by_areas"></c-table-results>
          </b-col>
           <b-col md="8">
            <b-card >
            <div class="chart-wrapper">
               <div class="radarStyle" ref="chartCategoriesByArea"> </div>
            </div>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12"  sm="12">
            <b-table :hover='hover' :bordered='bordered' :small='small'  responsive='sm' :items='items' :fields='fields' :current-page='currentPage' :per-page="perPage">
                <template slot='average' slot-scope='data'>
                  <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item.average"></vue-numeric></strong>
                  <b-progress height={} class="progress-xs my-0" :variant="info"  :value= "data.item.average" :max="max"/>
                </template>
            </b-table>
          </b-col>
        </b-row>
        </div> <!-- End result-by-areas-div-->
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
// import am4themesKelly from '@amcharts/amcharts4/themes/kelly'
import ResultsTable from './ResultsTable'
import BDData from './_BDData.js'

// Le da un comportanemiento animado al chart
am4core.useTheme(am4themesAnimated)
// am4core.useTheme(am4themesKelly)
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
      average_by_area: [],
      categories_average_by_directives: [],
      categories_average_by_no_directives: [],
      errorConsultingData: false,
      noResponses: false,
      showResponsesSummaryTables: false, // Controla la visualizacion de las tablas que resumen los resultados por categoria dimension y componente
      responsesHeadersList: [],
      overall_average: 0.0,
      promedioBarra: 0.0,
      max: 9,
      isLoading: true,
      requestPath: '', // Controla cual es la ruta para la que se quieren ver los resultados
      areaFields: [
        {key: 'area', label: 'Nombre', sortable: true, class: 'widthColumn'},
        {key: 'name', label: 'Promedio', sortable: true}
        /* {key: 'email', label: 'Email', sortable: true, class: 'widthColumn'},
        {key: 'comments', label: 'Comentarios', sortable: true},
        {key: 'area', label: 'Area', sortable: true},
        {key: 'is_directive', label: 'Es directivo?', sortable: true},
        {key: 'posicion', label: 'Es directivo?', sortable: true},
        {key: 'promedio', sortable: true} */ ],
    }
  },
  created: function () {
    this.requestPath = this.$route.path
    console.log(this.requestPath)
  },
  mounted: function () {
    this.consultAverageData()
  },
  watch: {
    '$route' (to, from) {
      this.requestPath = this.$route.path
      console.log('cambio la ruta')
      console.log(this.requestPath)
      this.drawCharts()
    }
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
          this.average_by_areas = averageChartsData['average_by_area']
          this.categories_average_by_directives = averageChartsData['categories_average_by_directives']
          this.categories_average_by_no_directives = averageChartsData['categories_average_by_no_directives']
          // Se cambia la bandera que controla si se muestran las tablas de resultados para indicar que si se pueden mostrar
          this.showResponsesSummaryTables = true
          this.drawCharts()
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
    drawCharts: function () {
      if (this.requestPath === '/result-by-categories') {
        this.sortJSON(this.average_by_categories, 'name', 'asc')
        this.drawRadarChart(this.$refs.chartByCategories, i18n.tc('message.rendimiento_categoria'), this.average_by_categories)
      }
      if (this.requestPath === '/result-by-directives') {
        this.drawDirectivesNoDirectivesChart('Categorías', this.$refs.chartByDirectivesNoDirectives, i18n.tc('message.rendimiento_dir_no_dir'))
      }
      if (this.requestPath === '/result-by-areas') {
        this.sortJSON(this.average_by_areas, 'average', 'asc')
        this.drawRadarChart(this.$refs.chartCategoriesByArea, i18n.tc('message.rendimiento_areas'), this.average_by_areas)
      }
    },
    drawRadarChart: function (div, titleText, data) {
      let chart = am4core.create(div, am4charts.RadarChart)
      if (div === this.$refs.chartByCategories) {
        chart.data = this.average_by_categories
      } else if (div === this.$refs.chartCategoriesByArea) {
        chart.data = this.average_by_areas
      }
      chart.padding(10, 10, 10, 10)
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.dataFields.category = 'name'
      categoryAxis.renderer.minGridDistance = 5

      var labelAxis = categoryAxis.renderer.labels.template
      labelAxis.wrap = true
      labelAxis.maxWidth = 150
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
    drawDirectivesNoDirectivesChart: function (label, div, titleText) {
      // we will create the chart here
      // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      let chart = am4core.create(div, am4charts.XYChart)
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = label
      categoryAxis.title.fontWeight = 'bold'
      // Value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      // valueAxis.min = 0
      valueAxis.max = 9
      valueAxis.calculateTotals = false
      valueAxis.strictMinMax = true
      // Customize labels appareance
      valueAxis.renderer.labels.template.fill = am4core.color('#000000')
      valueAxis.renderer.labels.template.fontSize = 15

      // Disable grid values
      categoryAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.grid.template.disabled = false
      // Separacion entre los elementos que se dibujan
      categoryAxis.renderer.minGridDistance = 3
      categoryAxis.renderer.labels.template.rotation = 330
      categoryAxis.renderer.labels.template.verticalCenter = 'middle'
      categoryAxis.renderer.labels.template.horizontalCenter = 'middle'

      // Controla el largo de las etiquetas para que se puedan leer
      var labelAxis = categoryAxis.renderer.labels.template
      // labelAxis.wrap = true
      // labelAxis.maxWidth = 120
      labelAxis.truncate = true
      labelAxis.maxWidth = 160
      labelAxis.tooltipText = '{name}'

      // Title
      var title = chart.titles.create()
      title.text = titleText
      title.fontSize = 25
      title.marginBottom = 30

      this.sortJSON(this.categories_average_by_directives, 'name', 'asc')
      this.sortJSON(this.categories_average_by_no_directives, 'name', 'asc')
      /* Series */
      /*
      var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = 'average'
      series.dataFields.categoryX = 'name'
      series.columns.template.tooltipText = '{categoryX}\nValor: {valueY}'
      series.name = label + ' (n = ' + this.n + ')'
      var columnTemplate = series.columns.template
      columnTemplate.height = am4core.percent(25) */

      // Series no directores
      if (this.categories_average_by_no_directives.length > 0) {
        chart.data = this.categories_average_by_no_directives
        let seriesNoDirectors = chart.series.push(new am4charts.LineSeries())
        seriesNoDirectors.data = this.categories_average_by_no_directives
        seriesNoDirectors.dataFields.categoryX = 'name'
        seriesNoDirectors.dataFields.valueY = 'average'
        seriesNoDirectors.strokeWidth = 5
        // Suaviza los lineas de la serie
        seriesNoDirectors.tensionX = 0.8
        // seriesNoDirectors.stroke = am4core.color('#ff0000')
        seriesNoDirectors.name = 'No directivos (n = ' + this.categories_average_by_no_directives[0].n + ')'
        seriesNoDirectors.bullets.push(new am4charts.CircleBullet())
        seriesNoDirectors.tooltipText = '{categoryX}: [bold]{valueY}[/]'

        // label bullet
        /* var labelBullet = new am4charts.LabelBullet()
        seriesNoDirectors.bullets.push(labelBullet)
        labelBullet.label.text = '{valueY.value.formatNumber("#.")}'
        labelBullet.strokeOpacity = 0
        labelBullet.stroke = am4core.color('#dadada')
        labelBullet.dy = -20 */
      }
      // Series directores
      if (this.categories_average_by_directives.length > 0) {
        chart.data = this.categories_average_by_directives
        let seriesDirectors = chart.series.push(new am4charts.LineSeries())
        seriesDirectors.data = this.categories_average_by_directives
        seriesDirectors.dataFields.categoryX = 'name'
        seriesDirectors.dataFields.valueY = 'average'
        seriesDirectors.strokeWidth = 5
        seriesDirectors.tensionX = 0.8
        seriesDirectors.name = 'Directivos (n = ' + this.categories_average_by_directives[0].n + ')'
        seriesDirectors.bullets.push(new am4charts.CircleBullet())
      }
      // Label
      /* var columnLabel = columnTemplate.createChild(am4core.Label)
      columnLabel.text = '{valueX}'
      columnLabel.textAlign = 'end'
      columnLabel.fontSize = 14
      columnLabel.valign = 'middle' */
      // And, for a good measure, let's add a legend
      chart.legend = new am4charts.Legend()
      chart.scrollbarY = new am4core.Scrollbar()

      // Cursor
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.behavior = 'none'
      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()
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
    },
    showView: function (id) {
      if (id === this.requestPath) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.radarStyle {
  width: 95%;
  height: 700px;
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
