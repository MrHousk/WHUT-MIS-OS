import axios from 'axios'
import config from './config'

const serverRequest = axios.create({
    baseURL: config.domain,
    timeout: 5000
})

export default {
    search(params) {
        return serverRequest.get('/ajax_search', { params }).then(({ data }) => data)
    },
}