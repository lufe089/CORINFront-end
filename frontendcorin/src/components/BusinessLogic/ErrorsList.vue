<template>
 <b-alert :show="hasErrors" variant="danger" >
  <ul class="error-messages">
    <li v-for="(value, key) in getErrors" :key="key">
      <span v-text="value" />
      {{value}}
    </li>
  </ul>
  </b-alert>
</template>

<script>
/* eslint-disable */
/* Copied from https://github.com/gothinkster/vue-realworld-example-app/blob/master/src/components/ListErrors.vue */
import { mapGetters } from 'vuex'
export default {
  name: "ErrorsList",
  computed: {
    ...mapGetters(['getErrors','hasErrors']) // Trae los getters del store
  }
};
</script>
