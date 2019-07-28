import Vue from 'vue'
import App from './App.vue'

import Validate from '../packages/validate'

Vue.use(Validate);

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
