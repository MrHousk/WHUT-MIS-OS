import axios from 'axios'
import config from './config'

const serverRequest = axios.create({
    baseURL: config.domain,
    timeout: 20000
})

export default {
    viewResource(params) {
        return serverRequest.get('/ajax_file', { params }).then(({ data }) => data)
    },
    getAllResource(params) {
        return serverRequest.post('/ajax_file', params).then(({ data }) => data)
    },
    upload(params) {
        return serverRequest.post('/ajax_upload', params).then(({ data }) => data)
    },
    deleteResource(params) {
        return serverRequest.post('/ajax_file', params).then(({ data }) => data)
    },
}