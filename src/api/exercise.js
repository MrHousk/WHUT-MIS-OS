import axios from 'axios'
import config from './config'

const serverRequest = axios.create({
    baseURL: config.domain,
    timeout: 20000
})

export default {
    onlineExercise(params) {
        return serverRequest.get('/request_test', { params }).then(({ data }) => data)
    },
    onlineExerciseWithLogin(params) {
        return serverRequest.post('/request_test', params).then(({ data }) => data)
    },
    updateExercise(params) {
        return serverRequest.post('/ajax_question', params).then(({ data }) => data)
    },
    importExercise(params) {
        return serverRequest.post('/ajax_upload', params).then(({ data }) => data)
    },
    academic(params) {
        return serverRequest.post('/ajax_analysis', params).then(({ data }) => data)
    },
    preAcademic(params) {
        return serverRequest.get('/ajax_analysis', { params }).then(({ data }) => data)
    },
    exportAcademic(params) {
        return serverRequest.post('/ajax_analysis', params).then(({ data }) => data)
    }
}