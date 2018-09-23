<template>
 <div id="item-justification">
   <!-- this component will show the justification that explains why a criterion or subcriterion is important in the instrument -->
    <b-card :no-body="true">
        <b-card-body class="p-3 clearfix">
          <i class="fa fa-comments-o bg-primary p-3 font-2xl mr-3 float-left" id='justification_item'></i>
          <b-tooltip  target='justification_item' placement='top'>
              {{$t("message.justification")}}
          </b-tooltip>
          <div class="h5 text-primary mb-0 mt-2 text-uppercase">{{itemName}}</div>
          <div class="text-muted font-weight-bold font-xs">
            <small>
              {{justification}}
            </small>
          </div>
        </b-card-body>
      </b-card>
 </div>
</template>

<script>
/* Este componente sirve para mostrar la justificación asociada a cualquier item */

export default {
  name: 'item-justification',
  data () {
    return { }
  },
  props: {
    justification: {
      type: String,
      required: true,
      default: 'default'
    },
    itemName: {
      type: String,
      required: false
    }
  },
  methods: {},
  /* El metodo created se llama enel hock antes de dibujar los componentes */
  created () {},
  computed: {},
  filter: {},
  directives: {}
}
</script>

<style scoped>
</style>
