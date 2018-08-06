import axios from 'axios'
import config from './config'

const serverRequest = axios.create({
    baseURL: config.domain,
    timeout: 5000
})

export default {
    getQuestionPage(params) {
        return serverRequest.get('/ajax_comment', { params }).then(({
            data
        }) => data)
    },
    getQuestionList(params) {
        return serverRequest.get('/ajax_comment', { params }).then(({
            data
        }) => data)
    },
    getMyQuestion(params) {
        return serverRequest.get('/ajax_comment', { params }).then(({
            data
        }) => data)
    },
    getAttendQuestion(params) {
        return serverRequest.get('/ajax_comment', { params }).then(({
            data
        }) => data)
    },
    getAnswerList(params) {
        return serverRequest.get('/ajax_comment', { params }).then(({
            data
        }) => data)
    },
    createQuestion(params) {
        return serverRequest.post('/ajax_comment', params).then(({
            data
        }) => data)
    },
    adminDeleteQuestion(params) {
        return serverRequest.post('/ajax_comment', params).then(({
            data
        }) => data)
    },
    writeAnswer(params) {
        return serverRequest.post('/ajax_comment', params).then(({
            data
        }) => data)
    },
    adminDeleteAnswer(params) {
        return serverRequest.post('/ajax_comment', params).then(({
            data
        }) => data)
    },
}