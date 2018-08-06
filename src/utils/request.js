import api_account from '@/api/account'
import api_exercise from '@/api/exercise'
import store from '@/store'
import router from '@/router'
import {
    MessageBox
} from 'element-ui'

export default function getUserInfo() {
    if (store.getters.accountIdentity) {
        let param = {
            user_name: store.getters.account,
            option_type: 'profile_picture',
        }
        api_account.getAvatar(param)
            .then(avatarUrl => {
                store.commit("setAvatar", avatarUrl);
            })

        let param2 = {
            user_name: store.getters.account,
            password: store.getters.password,
            user_type: store.getters.accountIdentity
        };
        api_account.login(param2)
            .then(data => {
                if (data === 'disallow') {
                    MessageBox.confirm('账号登录状态失效，请重新登录', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        router.push('/login')
                    }).catch(() => {
                        store.commit("loginOut");
                    })
                } else {
                    store.commit('setName', data);
                }
            })

        let param3 = {
            user_name: store.getters.account,
            password: store.getters.password,
            user_type: store.getters.accountIdentity
        }
        api_exercise.preAcademic(param3);
    }
}