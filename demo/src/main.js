// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import PlateViewer from 'plate-viewer-vue'
import 'plate-viewer-vue/dist/plate-viewer.css'

Vue.use(VueResource)
// Vue.config.productionTip = false
Vue.use(PlateViewer)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
