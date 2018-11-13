<template>
  <b-card>
    <div slot="header">
      <b-row >
        <b-col md="12">
            <strong>{{ $t("message.download_data") }}</strong>
        </b-col>
      </b-row>
    </div>
    <b-row fluid>
      <b-col md="6">
        <b-list-group>
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center">  <div class="font-weight-bold font-lg"> {{ $t("message.download_parametric_data") }} </div></b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.items") }}
              <download-excel
                :data   = "json_data" :fields = "json_fields" :name= "exportFileNames.items">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.clients") }}
              <download-excel
                :data   = "json_data" :fields = "json_fields" :name= "exportFileNames.clients">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="6">
        <b-list-group>
          <b-list-group-item variant="secondary"  class="d-flex justify-content-center"><div class="font-weight-bold font-lg"> {{ $t("message.download_answers_data") }} </div></b-list-group-item>
            <b-list-group-item button class="d-flex justify-content-between align-items-center">
              {{ $t("message.all") }}
              <download-excel
                :data   = "json_data" :fields = "json_fields" :name= "exportFileNames.responses">
                <a href="#"> <i class="fa fa-download fa-lg mt-4"></i></a>
              </download-excel>
            </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>

import BDData from './_BDData.js'

export default {
  name: 'results-module',
  components: {
    DownloadExcel: () => import('vue-json-excel'),
    i18n: () => import('../../lang/config')
  },
  data () {
    return {
      exportFileNames: BDData.exportFileNames,
      json_fields: {
        'Complete name': 'name',
        'City': 'city',
        'Telephone': 'phone.mobile',
        'Telephone 2': {
          field: 'phone.landline',
          callback: (value) => {
            return `Landline Phone - ${value}`
          }
        }
      },
      json_data: [
        {
          'name': 'Tony Peña',
          'city': 'New York',
          'country': 'United States',
          'birthdate': '1978-03-15',
          'phone': {
            'mobile': '1-541-754-3010',
            'landline': '(541) 754-3010'
          }
        },
        {
          'name': 'Thessaloniki',
          'city': 'Athens',
          'country': 'Greece',
          'birthdate': '1987-11-23',
          'phone': {
            'mobile': '+1 855 275 5071',
            'landline': '(2741) 2621-244'
          }
        }
      ],
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ]
    }
  },
  created: function () {
  },
  watch: {
  },
  methods: {
  }
}
</script>
