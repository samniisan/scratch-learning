import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import JF from 'json-formatter-js'

Vue.use(Vuetify);

window.TJ = require('textile-js');
window.JF = JF;

new Vue({
  el: '#app',
  render: h => h(App)
});
