import Vue from 'vue'
import App from './App'

import ElementUI from 'element-ui'
import axios from 'axios'
import store from './store'
// import '@/mock'

import '@/styles/index.scss'
import router from './router' //放在elemnt-ui样式后，可解决打包后样式无法显示的问题
import '@/assets/icons/iconfont'
import 'vue2-animate/dist/vue2-animate.min.css'
import 'highlight.js/styles/tomorrow.css'
import VueLazyload from 'vue-lazyload'

import mReturn from "@/components/m-return"
import mIcon from '@/components/m-icon.vue'
import mButton from '@/components/m-button.vue'
import mLoading from '@/components/m-loading.vue'

Vue.use(axios)
Vue.use(ElementUI)
Vue.use(VueLazyload, {
    preLoad: 1,
    error: 'static/pic/avatar.png',
    loading: 'static/pic/loading.png',
    attempt: 1
})

Vue.component(mReturn.name, mReturn)
Vue.component(mIcon.name, mIcon)
Vue.component(mButton.name, mButton)
Vue.component(mLoading.name, mLoading)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})