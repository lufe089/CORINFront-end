<template>
 <div class='wrapper'>
    <div class='animated fadeIn'>
      <div ref='chartdiv'>
      </div>
    </div>
 </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

am4core.useTheme(am4themesAnimated)

export default {
  name: 'performance-by-criterion-chart',
  data () {
    return {}
  },
  created () {
    alert('Entre a pintar')
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    // Cursor
    chart.cursor = new am4charts.XYCursor()
    chart.legend = new am4charts.Legend()
    // Add data
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
    }]
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    categoryAxis.dataFields.category = 'country'
    categoryAxis.title.text = 'Countries'

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
    valueAxis.title.text = 'Litres sold (M)'

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.valueY = 'litres'
    series.dataFields.categoryX = 'country'
    series.name = 'Sales'
    series.columns.template.tooltipText = 'Series: {name}\nCategory: {categoryX}\nValue: {valueY}'
    series.columns.template.fill = am4core.color('#104547') // fill

    var series2 = chart.series.push(new am4charts.LineSeries())
    series2.name = 'Units'
    series2.stroke = am4core.color('#CDA2AB')
    series2.strokeWidth = 3
    series2.dataFields.valueY = 'units'
    series2.dataFields.categoryX = 'country'
  }
}
