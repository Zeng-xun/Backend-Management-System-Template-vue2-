import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './icons'
import './utils'
import '@/styles/index.scss'
import './api/http'

import '../mock'

import '@/components/common'

import LayoutStore from '@/layouts/index'
import { resetRouter } from './router/index'

import 'default-passive-events'

Vue.use(LayoutStore, {
  state: {
    isFixedNavBar: true,
    layoutMode: localStorage.getItem('THEME_LAYOUT_STYLE') || 'ltr',
    themeColor: localStorage.getItem('THEME_COLOR_STYLE') || 'theme_color_blue',
    theme: localStorage.getItem('THEME_STYLE') || 'light',
  },
  actions: {
    onLogout() {
      resetRouter()
      Cookies.remove('admin-token')
      router.replace({ name: 'login' })
    },
    toPersonalCenter() {
      router.push('/personal/center')
    },
  },
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
