<template>
  <div class="animated fadeIn">
    <p class="text-info">Hello World</p>
    <b-card-group columns class="card-columns cols-2">
      <b-card header="Bar Chart">
        <div class="chart-wrapper">
          <bar-example/>
        </div>
      </b-card>
      <b-card header="AMChart">
        <div class="chart-wrapper">
          <am-chart></am-chart>
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
  </div>
</template>

<script>

import BarExample from '@/views/charts/barExample.vue'
import AMChart from '@/views/charts/AMChart.vue'
import PerformanceByCriteriaChart from '@/views/charts/PerformanceByCriteriaChart'

export default {
  name: 'dashboard',
  components: {
    /* tag, component name */
    BarExample,
    'am-chart': AMChart,
    'performance-by-criterion-chart': PerformanceByCriteriaChart
  }
}
</script>
