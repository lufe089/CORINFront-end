<template>
  <b-alert variant="danger" >
    <ul class="error-messages">
      <li v-for="(value, key) in errorMsg" :key="key">
        <span v-text="key" />
        <span v-for="err in value" :key="err" v-text="err" />
      </li>
    </ul>
  </b-alert>
</template>

<script>
import { mapState } from 'vuex'
/* eslint-disable */
/* Copied from https://github.com/gothinkster/vue-realworld-example-app/blob/master/src/components/ListErrors.vue */
export default {
  name: "TheErrorsList",
  computed: {
    ...mapState({
      errorMsg: state => state.auth.errors
      // customized_instrument(state){ return state.auth.customized_instrument}
    })
  }
};
</script>
