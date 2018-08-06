import Mock from 'mockjs'
import discuss from './data/discuss'

// 讨论区相关
Mock.mock(/\/ajax_analysis/, 'post', discuss.getQuestionList)
Mock.mock(/\/ajax_account/, 'post', discuss.getAnswerList)

Mock.setup({
    timeout: '500-1000' //模拟响应延时
})

export default Mock