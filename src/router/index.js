import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import home from '@/views/home.vue'
import index from '@/views/components/index'
import test from '@/views/test.vue'

import getUserInfo from '@/utils/request'
import {
    MessageBox
} from 'element-ui'

const login = () =>
    import ( /* webpackChunkName: "login" */ '@/views/components/login')

//账号管理相关
const account = () =>
    import ( /* webpackChunkName: "account" */ '@/views/people/account/index')
const profile = () =>
    import ( /* webpackChunkName: "profile" */ '@/views/people/account/profile')
const accountManage = () =>
    import ( /* webpackChunkName: "accountManage" */ '@/views/people/account/account-manage')

//教师管理相关
const teacher = () =>
    import ( /* webpackChunkName: "teacher" */ '@/views/people/teacher/index')
const questionBankManage = () =>
    import ( /* webpackChunkName: "questionBankManage" */ '@/views/people/teacher/question-bank-manage')
const manageResource = () =>
    import ( /* webpackChunkName: "manageResource" */ '@/views/people/teacher/manage-resource')
const academic = () =>
    import ( /* webpackChunkName: "academic" */ '@/views/people/teacher/academic')

//搜索相关
const search = () =>
    import ( /* webpackChunkName: "search" */ '@/views/search/index')
const searchContent = () =>
    import ( /* webpackChunkName: "search" */ '@/views/search/content')
const searchDiscuss = () =>
    import ( /* webpackChunkName: "search" */ '@/views/search/discuss')

//算法相关
const algorithmHome = () =>
    import ( /* webpackChunkName: "algorithmHome" */ '@/views/components/algorithm-home')
const algorithmReview = () =>
    import ( /* webpackChunkName: "algorithmReview" */ '@/views/components/algorithm-review')
const algorithmDemo = () =>
    import ( /* webpackChunkName: "algorithmDemo" */ '@/views/components/algorithm-demo')
const algorithmResource = () =>
    import ( /* webpackChunkName: "algorithmResource" */ '@/views/components/algorithm-resource')
const onlineExercise = () =>
    import ( /* webpackChunkName: "onlineExercise" */ '@/views/components/online-exercise')

//讨论相关
const discuss = () =>
    import ( /* webpackChunkName: "discuss" */ '@/views/discuss/index')
const forum = () =>
    import ( /* webpackChunkName: "forum" */ '@/views/discuss/forum')
const originatedDiscuss = () =>
    import ( /* webpackChunkName: "originatedDiscuss" */ '@/views/discuss/originated-discuss')
const attendedDiscuss = () =>
    import ( /* webpackChunkName: "attendedDiscuss" */ '@/views/discuss/attended-discuss')
const singleDiscuss = () =>
    import ( /* webpackChunkName: "singleDiscuss" */ '@/views/discuss/single-discuss')

//其他
const manual = () =>
    import ( /* webpackChunkName: "manual" */ '@/views/components/manual')

Vue.use(Router)

const routes = [{
    path: '/',
    redirect: {
        name: 'home'
    },
    component: index,
    children: [{
        path: '/home',
        name: 'home',
        component: home
    }, {
        path: '/account/:id',
        component: account,
        meta: {
            requireAuth: true
        },
        children: [{
            path: 'profile',
            name: 'profile',
            component: profile,
        }, {
            path: 'account-manage',
            component: accountManage,
            meta: {
                onlyAdmin: true
            }
        }]
    }, {
        path: '/teacher/:id',
        component: teacher,
        meta: {
            requireAuth: true,
            onlyAdmin: true
        },
        children: [{
            path: 'question-bank-manage',
            name: 'questionBankManage',
            component: questionBankManage,
        }, {
            path: 'manage-resource',
            component: manageResource,
        }, {
            path: 'academic',
            component: academic,
        }]
    }, {
        name: 'search',
        path: '/search',
        component: search,
        children: [{
            path: 'content',
            name: 'content',
            component: searchContent
        }, {
            path: 'discuss',
            name: 'discuss',
            component: searchDiscuss
        }]
    }, {
        path: '/semester-test',
        component: onlineExercise
    }, {
        path: '/discuss',
        component: discuss,
        children: [{
            path: 'forum',
            name: 'forum',
            component: forum
        }, {
            path: 'originated-discuss',
            name: 'originatedDiscuss',
            component: originatedDiscuss
        }, {
            path: 'attended-discuss',
            name: 'attendedDiscuss',
            component: attendedDiscuss
        }]
    }, {
        path: '/discuss/:id',
        name: 'singleDiscuss',
        component: singleDiscuss
    }, {
        path: '(processorSchedule|banker|memoryPartition|pageReplace|diskSchedule|encryptDecode)',
        component: algorithmHome,
        children: [{
            path: 'algorithm-review',
            component: algorithmReview
        }, {
            path: 'algorithm-demo',
            component: algorithmDemo
        }, {
            path: 'algorithm-resource',
            component: algorithmResource
        }, {
            path: 'online-exercise',
            component: onlineExercise
        }]
    }]
}, {
    path: '/login',
    component: login
}, {
    path: '/test',
    component: test
}, {
    path: '/manual',
    name: 'manual',
    component: manual
}, {
    path: '*',
    redirect: {
        name: 'home'
    }
}]

const router = new Router({
    routes: routes
})

if (window.localStorage.getItem('adminIdentity')) {
    store.commit('loginIn', {
        accountIdentity: 'admin',
        account: window.localStorage.getItem('adminAccount'),
        password: window.localStorage.getItem('adminPassword')
    });
}
if (window.localStorage.getItem('studentIdentity')) {
    store.commit('loginIn', {
        accountIdentity: 'student',
        account: window.localStorage.getItem('studentAccount'),
        password: window.localStorage.getItem('studentPassword')
    });
}

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        next()
    } else {
        getUserInfo();
        if (to.matched.some(r => r.meta.requireAuth)) {
            if (store.getters.accountIdentity == 'student') {
                if (to.matched.some(r => r.meta.onlyAdmin)) {
                    MessageBox.confirm('您无权访问，请先登录教师账号', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        next({
                            path: '/login',
                        })
                    }).catch(() => {
                        next({
                            path: ''
                        })
                    })
                } else {
                    next();
                }
            } else if (store.getters.accountIdentity == 'admin') {
                next();
            } else {
                MessageBox.confirm('请先进行登录', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    next({
                        path: '/login',
                    })
                }).catch(() => {
                    next({
                        path: ''
                    })
                })
            }
        } else {
            next();
        }
    }
})

export default router