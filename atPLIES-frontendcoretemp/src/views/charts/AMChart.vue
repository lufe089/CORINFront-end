<template>
 <div class="wrapper">
    <div class="animated fadeIn">
      <div class="card-deck">
        <div class="card">
          <div class="card-block">
            <!--<h4 class="card-title">Card title</h4>-->
             <div class="hello" ref="chartdiv">
             </div>
          </div>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

// Le da un comportanemiento animado al chart
am4core.useTheme(am4themesAnimated)

export default {
  name: 'instrument-instructions',
  data () {
    return {
    }
  },
  mounted () {
    // we will create the chart here
    // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    // chart.paddingRight = 20
    // let data = []
    // let visits = 10
    // for (let i = 1; i < 366; i++) {
    //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10)
    //   data.push({ date: new Date(2018, 0, i), name: 'name' + i, value: visits })
    // }

    // chart.data = data

    // let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    // dateAxis.renderer.grid.template.location = 0

    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    // valueAxis.tooltip.disabled = true
    // valueAxis.renderer.minWidth = 35

    // let series = chart.series.push(new am4charts.LineSeries())
    // series.dataFields.dateX = 'date'
    // series.dataFields.valueY = 'value'

    // series.tooltipText = '{valueY.value}'
    // chart.cursor = new am4charts.XYCursor()

    // let scrollbarX = new am4charts.XYChartScrollbar()
    // scrollbarX.series.push(series)
    // chart.scrollbarX = scrollbarX
    // let pieChart = am4core.create(this.$refs.pieChart, am4charts.PieChart)
    // Create pie series
    // let seriesPieChart = chart.series.push(new am4charts.ColumnSeries())
    // seriesPieChart.dataFields.valueY = 'country'
    // seriesPieChart.dataFields.valueX = 'litres'
    // AXES
    // category
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
    categoryAxis.dataFields.category = 'country'
    categoryAxis.title.text = 'Countries'
    // categoryAxis.autoGridCount = false
    // categoryAxis.gridCount = 10

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text = 'Litres sold (M)'
    valueAxis.title.fontWeight = 'bold'
    /* valueAxis.min = 0
    valueAxis.max = 800
    valueAxis.calculateTotals = true
    valueAxis.strictMinMax = true */

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

    // Add data si es general se pone chart.data
    chart.data = [{
      'country': 'Lithuania',
      'litres': 501.9
    }, {
      'country': 'Czech Republic',
      'litres': 301.9
    }, {
      'country': 'Ireland',
      'litres': 201.1
    }, {
      'country': 'Germany',
      'litres': 165.8
    }, {
      'country': 'Australia',
      'litres': 139.9
    }, {
      'country': 'Austria',
      'litres': 128.3
    }, {
      'country': 'UK',
      'litres': 99
    }, {
      'country': 'Belgium',
      'litres': 60
    }, {
      'country': 'The Netherlands',
      'litres': 50
    },
    {
      'country': 'Peru',
      'litres': 50
    }]
    /* Series */
    var series = chart.series.push(new am4charts.ColumnSeries())
    /* series.data = [{
      'country': 'Lithuania',
      'litres': 501.9
    }, {
      'country': 'Czech Republic',
      'litres': 301.9
    }, {
      'country': 'Ireland',
      'litres': 201.1
    }, {
      'country': 'Germany',
      'litres': 165.8
    }, {
      'country': 'Australia',
      'litres': 139.9
    }, {
      'country': 'Austria',
      'litres': 128.3
    }, {
      'country': 'UK',
      'litres': 99
    }, {
      'country': 'Belgium',
      'litres': 60
    }, {
      'country': 'The Netherlands',
      'litres': 50
    }] */
    series.dataFields.valueX = 'litres'
    // Instead of graph.valueField = 'value'
    series.dataFields.categoryY = 'country'
    series.name = 'Sales'
    // Instead of ballonText graph.balloonText='[[category]]: <b>[[value]]'
    // It holds a 'template' object of type RoundedRectangle which we can use to set a 'default' column appearance for our series.
    series.columns.template.tooltipText = 'Series: {name}\nCategory: {categoryX}\nValue: {valueY}'
    // series.columns.template.fill = am4core.color('#104547')
    // series.columns.template.stroke = am4core.color('#ff0000') // red outline
    // series.columns.template.fill = am4core.color('#00ff00') // green fill // red outline
    var columnTemplate = series.columns.template
    columnTemplate.height = am4core.percent(20)
    /* var series2 = chart.series.push(new am4charts.ColumnSeries())
    series2.data2 = [{
      'country': 'Lithuania',
      'litres': 501.9
    }, {
      'country': 'Czech Republic',
      'litres': 301.9
    }, {
      'country': 'Peru',
      'litres': 201.1
    }]

    series2.dataFields.valueX = 'litres'
    // Instead of graph.valueField = 'value'
    series2.dataFields.categoryY = 'country'
    series2.name = 'Sales'
    // Instead of ballonText graph.balloonText='[[category]]: <b>[[value]]'
    // It holds a 'template' object of type RoundedRectangle which we can use to set a 'default' column appearance for our series.
    series2.columns.template.tooltipText = 'Series: {name}\nCategory: {categoryX}\nValue: {valueY}'
    series2.columns.template = columnTemplate
    series2.columns.template.label = 'Hola ' */

    /* Ejemplo de como poner colores diferentes */
    /* columnTemplate.adapter.add("fill", function (fill, target) {
        var dataItem = target.dataItem;
        if (dataItem.valueY > 6000) {
            return am4core.color("#78b711");
        }
        else {
            return am4core.color("#a8b3b7");
        }
    }) */
    /* Degrade de colores segun el puntaje */
    // series.heatRules.push({ target: columnTemplate, property: 'fill', dataField: 'valueX', min: am4core.color('#e5dc36'), max: am4core.color('#5faa46') })

    // Preload style for doing circular bulltets
    var circleBullet = columnTemplate.createChild(am4charts.CircleBullet)
    circleBullet.circle.radius = 12
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

    // Export the chart
    chart.exporting.menu = new am4core.ExportMenu()
    // Cursor
    var cursor = new am4charts.XYCursor()
    cursor.behavior = 'panX'
    cursor.lineY.disabled = true
    chart.cursor = cursor

    // And, for a good measure, let's add a legend
    chart.legend = new am4charts.Legend()
    // series.legendSettings.valueText = '{valueX}'

    // this.chart = chart
  },
  methods: {
  },
  created () {
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  computed: {},
  filter: {},
  directives: {},
  mixins: []
}
</script>

<style scoped>
.hello {
  width: 100%;
  height: 500px;
}
</style>
