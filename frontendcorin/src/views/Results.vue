<template>
  <div class="animated fadeIn">
    <!-- Card to select which client to consult -->
    <b-row>
    <b-col md="12">
      <client-selector @client-selector:change='changeClient' v-show="!isClient || !isParticipant"></client-selector>
    </b-col>
    </b-row>
       <!-- End Card to select which client to consult -->
    <div v-show="!isLoading">
      <b-alert :show="noResponses"><h4>{{$t("message.no_resultados")}}</h4></b-alert>
      <!-- Si existen resultados para mostrar -->
      <div id="results" v-show="!noResponses && showResponses">
       <!-- Results by categories only-->
       <div id="result-by-categories" v-show="showView('/result-by-categories')">
        <b-row>
        <b-col sm="12" md="12">
          <b-card :no-body="true">
            <b-card-body class="p-4 clearfix">
              <div :class="calculateVariantResults('bg',overall_average)" class=" h1 p-4 px-5 font-2xl mr-3 float-left">{{overall_average}} </div>
              <div>
                <div class="h2 text-primary mb-0 mt-2" >
                  <div v-show="overall_average>=7">{{$t("message.resultado_alta_tendencia")}}
                    <div class="text-muted font-weight-bold font-xs"> {{$t("message.average_7to9")}} </div>
                  </div>
                  <div v-show="overall_average<=3">{{$t("message.resultado_baja_tendencia")}}
                    <div class="text-muted font-weight-bold font-xs"> {{$t("message.average_1to3")}} </div>
                  </div>
                  <div v-show="overall_average> 3 && overall_average< 7">{{$t("message.resultado_media_tendencia")}}
                    <div class="text-muted font-weight-bold font-xs"> {{$t("message.average_4to6")}} </div>
                  </div>
                </div>
                <b-progress height={} class="progress-xs my-1" :variant="calculateVariantResults('bar',promedioBarra)" :max=max :value="promedioBarra"/>
                <div class="text-muted font-weight-bold font-s"> {{$t("message.answer_number")}}: {{n}}
                  <div class="float-right"><small class="text-muted"> {{$t("message.value1to9")}} </small></div>
                </div>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
        </b-row>
        <b-row>
          <!-- Resultados por categorias -->
          <b-col md="12">
            <b-card>
              <b-row>
                <b-col>
                <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{$t("message.resultado_categorias") + ' ('+$t("message.n") +' = '+ this.n +' )'}}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-card >
                  <div class="chart-wrapper">
                     <div class="radarStyle" ref="chartByCategories"> </div>
                  </div>
                  </b-card>
                </b-col>
                <b-col md="12"  sm="12">
                  <!--<base-table hover  :items="average_by_categories" columnsDetail=3 ></base-table>-->
                  <!-- Se muestra la tabla anidada -->
                  <base-table :filterValues=false :columnsDetail=3 hover :items="nested_average" :caption ="$t('message.categorias')"></base-table>
                </b-col>
              </b-row>
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
            <!--<base-table :caption="$t('message.resultado_categorias_directivos')"  hover  :items="categories_average_by_directives"></base-table>-->
             <base-table :filterValues=false :columnsDetail=3 hover :items="categories_average_by_directives" :caption ="$t('message.resultado_categorias_directivos')"></base-table>
          </b-col>
          <b-col md="6"  sm="12">
            <!--<base-table :caption="$t('message.resultado_categorias_no_directivos')"  hover  :items="categories_average_by_no_directives"></base-table>-->
            <!-- Se muestra la tabla anidada -->
            <base-table :filterValues=false :columnsDetail=3 hover :items="categories_average_by_no_directives" :caption ="$t('message.resultado_categorias_no_directivos')"></base-table>
          </b-col>
        </b-row>
        </div> <!-- End result-by-directives-div-->
         <!-- Results by areas-->
        <div id="result-by-areas" v-show="showView('/result-by-areas')">
        <b-row>
          <b-col md="12">
            <b-card>
              <b-row>
                <b-col>
                <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{$t("message.rendimiento_areas")}}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="4"  sm="12">
                  <base-table :items="average_by_areas"></base-table>
                </b-col>
                <b-col md="8">
                  <b-card >
                  <div class="chart-wrapper">
                    <div class="radarStyle" ref="chartCategoriesByArea"> </div>
                  </div>
                  </b-card>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <!-- Tabla de areas x categorias -->
          <b-col md="12"  sm="12">
            <b-card class="card-body">
            <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{$t("message.areas_by_categories_average")}}</div>
            <hr>
            <b-table hover responsive='md' :items='categories_average_by_area' :fields='area_table_columns'>
              <!-- Si se cambian los nombres de las categorias esto va a hacer un problema-->
              <template slot='Capacidades organizacionales' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Capacidades organizacionales']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Capacidades organizacionales'])"  :value= "data.item['Capacidades organizacionales']" :max="max"/>
              </template>
              <template slot='Competencias organizacionales' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Competencias organizacionales']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Competencias organizacionales'])"  :value= "data.item['Competencias organizacionales']" :max="max"/>
              </template>
              <template slot='Formadores de cultura' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Formadores de cultura']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Formadores de cultura'])"  :value= "data.item['Formadores de cultura']" :max="max"/>
              </template>
              <template slot='Liderazgo y métricas' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Liderazgo y métricas']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Liderazgo y métricas'])"  :value= "data.item['Capacidades organizacionales']" :max="max"/>
              </template>
              <template slot='Entorno y estrategia' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Entorno y estrategia']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Entorno y estrategia'])"  :value= "data.item['Entorno y estrategia']" :max="max"/>
              </template>
              <template slot='Rasgos culturales para la innovación' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Rasgos culturales para la innovación']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Rasgos culturales para la innovación'])"  :value= "data.item['Rasgos culturales para la innovación']" :max="max"/>
              </template>
              <template slot='Roles comportamentales' slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item['Roles comportamentales']"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults('bar', data.item['Roles comportamentales'])"  :value= "data.item['Roles comportamentales']" :max="max"/>
              </template>
              <!-- No funciono
                <template v-for='category in categories_names' :slot="category.name" slot-scope='data'>
                <strong><vue-numeric v-bind:precision="2" read-only v-model="data.item[category.name]"></vue-numeric></strong>
                <b-progress height={} class="progress-xs my-0" :variant="calculateVariantResults(data.item[category.name])"  :value= "data.item[category.name]" :max="max"/>
              </template>-->
            </b-table>
            </b-card>
          </b-col>
        </b-row>
        </div> <!-- End result-by-areas-div-->
        <!-- Results by dimensions and components-->
        <div id="results_by_dim_comp" v-show="showView('/results_by_dim_comp')">
          <b-row>
            <b-col md="12">
            <b-card>
              <b-row>
                <b-col>
                <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{$t("message.resultado_dimensiones")+ ' ('+$t("message.n") +' = '+ this.n +' )'}}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="5"  sm="12">
                  <base-table :filterValues=true :columnsDetail=2 hover :items="average_by_dimensions"></base-table>
                </b-col>
                <b-col md="7">
                  <b-card >
                  <div class="chart-wrapper">
                    <div class="chartDimensionStyle" ref="chartByDimensions"> </div>
                  </div>
                  </b-card>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <!-- Tabla con resultados dimensiones y componentes -->
        <b-row>
          <b-col md="12">
            <b-card>
              <b-row>
                <b-col>
                <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{$t("message.resultado_componentes")+ ' ('+$t("message.n") +' = '+ this.n +' )'}}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="4"  sm="12">
                  <base-table :filterValues=true hover :items="average_by_components"></base-table>
                </b-col>
                <b-col md="8">
                  <b-card >
                  <div class="chart-wrapper">
                    <div class="chartComponentStyle" ref="chartByComponents"> </div>
                  </div>
                  </b-card>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row><!--/.row-->
        </div><!-- End results_by_dim_comp-div-->
        <!-- tabla que agrupa todos los valores -->
        <div id="results_by_dim_comp_table" v-show="showView('/results_by_dim_comp_table')">
          <b-row>
            <b-col md="12">
            <b-card>
              <b-row>
                <b-col>
                <div class="h5 text-info mb-3 pt-3 text-center text-uppercase font-weight-bold font-md">{{$t("message.resultado_detallados")+ ' ('+$t("message.n") +' = '+ this.n +' )'}}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12"  sm="12">
                  <!-- Se muestra la tabla anidada -->
                  <base-table :filterValues=false :columnsDetail=3 hover :items="nested_average" :caption ="$t('message.categorias')"></base-table>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        </div><!-- End tabla que agrupa todos los valores-div-->
      </div>
    </div>
  </div>
</template>

<script>

import i18n from '../lang/config'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import BaseTable from '../components/BaseComponents/BaseTable'
import BDData from '@/common/_BDData.js'
import api from '@/services/api.js'
import { mapGetters } from 'vuex'
import { SET_LOADING, SET_ERROR, CLEAR_ERRORS } from '@/store/mutations.type'

// Le da un comportanemiento animado al chart
am4core.useTheme(am4themesAnimated)
// am4core.useTheme(am4themesKelly)
export default {
  name: 'results-module',
  components: {
    /* tag, component name */
    'base-table': BaseTable,
    clientSelector: () => import('@/components/BusinessLogic/ClientSelector')
  },
  data () {
    return {
      participantResponse: {},
      serviceResult: {},
      result: '',
      isSurveyVisible: false,
      responsesList: [],
      n: 0,
      average_by_dimensions: [],
      average_by_categories: [],
      average_by_components: [],
      average_by_areas: [],
      nested_average: [],
      categories_average_by_directives: [],
      categories_average_by_no_directives: [],
      categories_average_by_area: [], // Sirve para mostrar el promedio relacionado de cada categoria por area
      area_table_columns: [{key: 'area', sortable: true}], // El area mas el nombre de las columnas que viene del servicio
      categories_names: [],
      errorConsultingData: false,
      noResponses: false,
      showResponses: false, // Controla la visualizacion de las tablas que resumen los resultados por categoria dimension y componente
      responsesHeadersList: [],
      overall_average: 0.0,
      promedioBarra: 0.0,
      max: 9,
      requestPath: '', // Controla cual es la ruta para la que se quieren ver los resultados,
      idClient: null, // Controla para que cliente ser hará la consulta de los datos
      clients_by_company: [], // Clientes asociados a la compania para la que se hara la consulta,
      idCompany: null
    }
  },
  created: function () {
    this.requestPath = this.$route.path
  },
  mounted: function () {
    this.$store.commit(CLEAR_ERRORS)
    if (this.isClient) {
      // Se inicializa el cliente a partir del cliente del usuario autenticado
      this.idClient = this.currentUser.client_id
      this.idCompany = this.currentUser.company_id
      // Se llama la consulta de los datos para mostrar los resultadospp
      this.consultAverageData(this.idClient)
    } else if (this.isCompany) {
      this.idCompany = this.currentUser.company_id
    }
  },
  watch: {
    '$route' (to, from) {
      this.requestPath = this.$route.path
      this.drawCharts()
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'isAdmin', 'isCompany', 'currentUser', 'isClient', 'isParticipant']) // Trae los getters
  },
  methods: {
    changeClient: function (idClient) {
      this.$store.commit(SET_LOADING, true)
      this.consultAverageData(idClient)
    },
    async consultAverageData (idClient) {
      var data = {idClient: idClient}
      try {
        var response = await api.post(data, BDData.endPoints.urlAverageData)
        // Estuvo exitosa la busqueda
        if (response !== undefined && response.status === 200) {
          this.$store.commit(CLEAR_ERRORS)
          var averageChartsData = response.data
          console.info('LOG: consultó average data')
          if (averageChartsData['n'] > 0) {
            this.noResponses = false
            this.overall_average = averageChartsData['overall_average'].toFixed(2)
            this.n = averageChartsData['n']
            this.promedioBarra = averageChartsData['overall_average']
            this.average_by_categories = averageChartsData['average_by_categories']
            this.average_by_dimensions = averageChartsData['average_by_dimensions']
            // console.log(JSON.stringify(this.average_by_dimensions))
            // Se ajusta el nombre de las dimensiones para concaternar la categoria
            this.average_by_dimensions.map((obj) => {
              var cat = obj['category'].substring(0, 4)
              obj['name'] = `${cat} - ${obj['name']}`
              return obj
            })
            this.average_by_components = averageChartsData['average_by_components']
            this.average_by_areas = averageChartsData['average_by_area']
            this.categories_average_by_directives = averageChartsData['categories_average_by_directives']
            this.categories_average_by_no_directives = averageChartsData['categories_average_by_no_directives']
            this.categories_average_by_area = averageChartsData['categories_average_by_area']
            this.categories_names = averageChartsData['category_names']
            this.nested_average = averageChartsData['nested_average']
            /* No voy a hacer esto sino que voy a dejar el espacio por facilidad
            this.categories_average_by_area.map((obj) => {
              obj.sortable = 'true'
              if (obj['Capacidades organizacionales'] === undefined) {
                obj['Capacidades organizacionales'] = '--'
              }
              return obj
            }) */
            this.area_table_columns = this.area_table_columns.concat(averageChartsData['category_names'])
            // Se modifican las columna para que todos los campos tengan el atributo de sortable
            this.area_table_columns.map((obj) => {
              obj.sortable = 'true'
              return obj
            })
            // Se cambia la bandera que controla si se muestran las tablas de resultados para indicar que si se pueden mostrar
            this.showResponses = true
            this.drawCharts()
          } else {
            this.noResponses = true
          }
        }
      } catch (exception) {
        this.$store.commit(SET_ERROR, exception.message)
      }
      this.$store.commit(SET_LOADING, false)
    },
    drawCharts: function () {
      if (this.requestPath === '/result-by-categories') {
        // this.sortJSON(this.average_by_categories, 'name', 'asc')
        this.drawRadarChart(this.$refs.chartByCategories, i18n.tc('message.rendimiento_categoria'), this.average_by_categories)
      }
      if (this.requestPath === '/result-by-directives') {
        this.drawDirectivesNoDirectivesChart('Categorías', this.$refs.chartByDirectivesNoDirectives, i18n.tc('message.rendimiento_dir_no_dir'))
      }
      if (this.requestPath === '/result-by-areas') {
        // this.sortJSON(this.average_by_areas, 'average', 'asc')
        this.drawRadarChart(this.$refs.chartCategoriesByArea, i18n.tc('message.rendimiento_areas'), this.average_by_areas)
      }
      if (this.requestPath === '/results_by_dim_comp') {
        // this.average_by_categories = averageChartsData['average_by_categories']
        // Uso el mismo metodo para dibujar dimensiones y componentes pq el que comence a cambiar para dibujar las dimensiones no me gusto como se veia aunque eventualmente podria verse bn
        this.drawComponentsChart(this.average_by_dimensions, i18n.tc('message.dimensions'), this.$refs.chartByDimensions, i18n.tc('message.rendimiento_dimension'))
        this.drawComponentsChart(this.average_by_components, i18n.tc('message.components'), this.$refs.chartByComponents, i18n.tc('message.rendimiento_componente'))
      }
      if (this.requestPath === '/results_by_dim_comp_table') {
        this.makeNestedResultsTable()
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
      // chart.responsive.enabled = true
      var labelAxis = categoryAxis.renderer.labels.template
      labelAxis.wrap = true
      labelAxis.maxWidth = 150
      labelAxis.verticalCenter = 'top'
      // labelAxis.template.horizontalCenter = 'top'
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
      // chart.legend = new am4charts.Legend()
      // Le pone bolitas en cada cambio de valor
      // series.bullets.push(new am4charts.CircleBullet())
      var bulletCategorias = series.bullets.push(new am4charts.Bullet())
      var circle = bulletCategorias.createChild(am4core.Circle)
      circle.width = 8
      circle.height = 8
      // Tooltip with the info
      circle.tooltipText = '{categoryX}: [bold]{valueY}[/]'
      // chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarY = new am4core.Scrollbar()
      // Title
      /* var title = chart.titles.create()
      title.text = titleText
      title.fontSize = 25
      title.marginBottom = 30 */
      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()
    },
    drawDirectivesNoDirectivesChart: function (label, div, titleText) {
      // we will create the chart here
      // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      let chart = am4core.create(div, am4charts.XYChart)
      chart.responsive.enabled = true
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = label
      categoryAxis.title.fontWeight = 'bold'
      // Value axis
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      valueAxis.min = 0
      valueAxis.max = 10
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
      categoryAxis.renderer.labels.template.horizontalCenter = 'midlle'

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

      // this.sortJSON(this.categories_average_by_directives, 'name', 'asc')
      // this.sortJSON(this.categories_average_by_no_directives, 'name', 'asc')
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
        var seriesNoDirectors = chart.series.push(new am4charts.LineSeries())
        seriesNoDirectors.data = this.categories_average_by_no_directives
        seriesNoDirectors.dataFields.categoryX = 'name'
        seriesNoDirectors.dataFields.valueY = 'average'
        seriesNoDirectors.strokeWidth = 3
        seriesNoDirectors.properties.strokeDasharray = '5.5'
        seriesNoDirectors.properties.stroke = am4core.color('#845EC2')
        seriesNoDirectors.properties.fill = am4core.color('#845EC2')
        // Suaviza los lineas de la serie
        seriesNoDirectors.tensionX = 0.8
        // seriesNoDirectors.stroke = am4core.color('#ff0000')
        seriesNoDirectors.name = 'No directivos (n = ' + this.categories_average_by_no_directives[0].n + ')'
        var bullet = seriesNoDirectors.bullets.push(new am4charts.Bullet())
        var circle = bullet.createChild(am4core.Circle)
        circle.width = 8
        circle.height = 8
        // Tooltip with the info
        circle.tooltipText = '{categoryX}: [bold]{valueY}[/]'

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
        seriesDirectors.strokeWidth = 3
        seriesDirectors.tensionX = 0.8
        seriesDirectors.name = 'Directivos (n = ' + this.categories_average_by_directives[0].n + ')'
        var bulletDirectivos = seriesDirectors.bullets.push(new am4charts.Bullet())
        circle = bulletDirectivos.createChild(am4core.Circle)
        circle.width = 8
        circle.height = 8
        // Tooltip with the info
        circle.tooltipText = '{categoryX}: [bold]{valueY}[/]'
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
    drawComponentsChart: function (data, label, div, titleText) {
      // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      let chart = am4core.create(div, am4charts.XYChart)
      chart.responsive.enabled = true
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = label + ' ( ' + (data.length) + ' ) '
      categoryAxis.title.fontWeight = 'bold'
      categoryAxis.renderer.inside = true
      categoryAxis.renderer.labels.template.dy = -14
      // Separacion entre los elementos que se dibujan
      categoryAxis.renderer.minGridDistance = 25
      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      var axisRange = valueAxis.axisRanges.create()
      axisRange.value = 50
      axisRange.grid.strokeOpacity = 0.1
      axisRange.label.text = 'Goal'
      axisRange.label.align = 'righ'
      axisRange.label.verticalCenter = 'bottom'
      axisRange.label.fillOpacity = 0.8
      valueAxis.renderer.minGridDistance = 25
      valueAxis.renderer.min = 0
      valueAxis.renderer.max = 9
      valueAxis.strictMinMax = true
      // Customize labels appareance
      valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92')
      valueAxis.renderer.labels.template.fontSize = 12

      // Disable grid values
      categoryAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.grid.template.disabled = true
      var labelAxis = categoryAxis.renderer.labels.template
      // labelAxis.wrap = true
      labelAxis.truncate = true
      labelAxis.maxWidth = 250
      labelAxis.fontSize = 14
      labelAxis.tooltipText = '{name}'
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
      // Label que muestra el puntaje al lado de la barra
      var columnLabel = circleBullet.createChild(am4core.Label)
      columnLabel.text = ' {valueX}'
      columnLabel.fontSize = 10
      // Alinea la etiqueta con las barras para que se vea bonito
      columnLabel.dy = -5
      columnLabel.dx = 15
      // Cursor
      // chart.cursor = new am4charts.XYCursor()
      // chart.cursor.behavior = 'none'
      // chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarX = new am4core.Scrollbar()

      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()
      chart.legend = new am4charts.Legend()
    },
    // Pintaba cada categoria de un color diferente, pero igual no se veia bonito
    drawDimensionsChart: function (data, label, div, titleText) {
      // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      let chart = am4core.create(div, am4charts.XYChart)
      chart.responsive.enabled = true
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'name'
      categoryAxis.title.text = label + ' ( ' + (data.length) + ' ) '
      categoryAxis.title.fontWeight = 'bold'
      categoryAxis.renderer.inside = true
      categoryAxis.renderer.labels.template.dy = -8
      // Separacion entre los elementos que se dibujan
      categoryAxis.renderer.minGridDistance = 22
      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'Promedio'
      valueAxis.title.fontWeight = 'bold'
      var axisRange = valueAxis.axisRanges.create()
      axisRange.value = 50
      axisRange.grid.strokeOpacity = 0.1
      axisRange.label.text = 'Goal'
      axisRange.label.align = 'righ'
      axisRange.label.verticalCenter = 'bottom'
      axisRange.label.fillOpacity = 0.8
      valueAxis.renderer.minGridDistance = 25
      valueAxis.renderer.min = 0
      valueAxis.renderer.max = 9
      // Customize labels appareance
      valueAxis.renderer.labels.template.fill = am4core.color('#A0CA92')
      valueAxis.renderer.labels.template.fontSize = 12
      // Disable grid values
      categoryAxis.renderer.grid.template.disabled = true
      valueAxis.renderer.grid.template.disabled = true
      var labelAxis = categoryAxis.renderer.labels.template
      // labelAxis.wrap = true
      labelAxis.truncate = true
      labelAxis.maxWidth = 250
      labelAxis.fontSize = 14
      labelAxis.tooltipText = '{name}'
      chart.data = data
      /* Series */
      /* var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueX = 'average'
      series.dataFields.categoryY = 'name'
      series.columns.template.tooltipText = '{categoryY}\nValor: {valueX}'
      series.name = label + ' (n = ' + this.n + ')' */
      for (var i = 0; i < this.categories_names.length; i++) {
        var series1 = chart.series.push(new am4charts.ColumnSeries())
        series1.dataFields.valueX = 'average'
        series1.dataFields.categoryY = 'name'
        series1.columns.template.tooltipText = '{categoryY}\nValor: {valueX}'
        series1.name = this.categories_names[i]['key'] + ' (n = ' + this.n + ')'
        series1.data = data.filter(result => result.category === this.categories_names[i]['key'])
        var columnTemplate = series1.columns.template
        columnTemplate.height = am4core.percent(2)
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
        columnLabel.fontSize = 10
        // Alinea la etiqueta con las barras para que se vea bonito
        columnLabel.dy = -5
        columnLabel.dx = 15
      }
      // Cursor
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.behavior = 'none'
      // chart.scrollbarX = new am4core.Scrollbar()
      chart.scrollbarX = new am4core.Scrollbar()

      // Export the chart
      chart.exporting.menu = new am4core.ExportMenu()
      chart.legend = new am4charts.Legend()
    },
    calculateVariantResults: function (type, number) {
      var variant = ''
      if (number >= 7) {
        variant = 'success'
      } else if (number <= 3) {
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
      // Controla cuando se ven o no las vistas de resultados
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
  width: 98%;
  height: 500px;
}
.chartDimensionStyle {
  width: 95%;
  height: 1200px;
}
.chartComponentStyle {
  width: 95%;
  height:650px;
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
