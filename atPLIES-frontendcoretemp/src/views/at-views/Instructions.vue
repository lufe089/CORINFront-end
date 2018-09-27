<template>
 <div class="wrapper">
    <div class="animated fadeIn">
      <b-jumbotron bg-variant="light">
        <template slot="header">
          <b-img fluid center src="https://applies.variamos.com/wp-content/uploads/2018/06/cropped-APPLIES-logo-8.png" height="40%"/>
          <span class="text-center" v-html="$t('message.welcome_to_applies')"></span>
          <hr class="my-4">
        </template>
        <template slot="lead">
           <b-row fluid>
             <b-col md="12">
               <b-card class="mx-auto" border-variant="info">
                <span v-html="$t('message.applies_instructions')"></span>
                <div slot="footer">
                  <small class="text-muted" v-html="$t('message.applies_contact')"></small>
                </div>
                </b-card>
             </b-col>
           </b-row>
        </template>
        <b-btn variant="primary" href="#" class="float-right">{{$t("message.lets_start")}}</b-btn>
      </b-jumbotron>
  </div>
 </div>
</template>

<script>
export default {
  name: 'instrument-instructions',
  data () {
    return {
    }
  },
  methods: { },
  created () {
  },
  computed: {
  },
  filter: { },
  directives: { },
  mixins: []
}
</script>

<style scoped>
</style>
