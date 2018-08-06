import axios from 'axios'
import config from './config'

const serverRequest = axios.create({
    baseURL: config.domain,
    timeout: 20000
})

export default {
    login(params) {
        return serverRequest.get('/ajax_account', { params }).then(({ data }) => data)
    },
    getAvatar(params) {
        return serverRequest.get('/ajax_file', { params }).then(({ data }) => data)
    },
    changeAvatar(params) {
        return serverRequest.post('/ajax_upload', params).then(({ data }) => data)
    },
    manageAccount(params) {
        return serverRequest.post('/ajax_account', params).then(({ data }) => data)
    },
    batchImport(params) {
        return serverRequest.post('/ajax_upload', params).then(({ data }) => data)
    }
}