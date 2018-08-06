import Mock from 'mockjs'

const Random = Mock.Random
const questionList = []
const answerList = []
const commentList = []

for (let i = 0; i < 10; i++) {
    questionList.push(Mock.mock({
        id: '@increment',
        avatar: () => Random.image('640x640', Random.color(), '#FFF', 'png', 'avatar'),
        name: '@cname',
        time: () => Random.now('second'),
        title: '@ctitle',
        text: '@cparagraph(10,12)',
        "answerNum|2-2": 2,
        'attentionActived|1': [true, false]
    }))
}

for (let i = 0; i < 2; i++) {
    answerList.push(Mock.mock({
        id: '@increment',
        avatar: () => Random.image('640x640', Random.color(), '#FFF', 'png', 'avatar'),
        name: '@cname',
        time: () => Random.now('second'),
        text: '@cparagraph(8,12)',
        "likeNum|1-100": 100,
        'likeActived|1': [true, false],
        "commentNum|2-2": 2
    }))
}

for (let i = 0; i < 2; i++) {
    commentList.push(Mock.mock({
        id: '@increment',
        avatar: () => Random.image('640x640', Random.color(), '#FFF', 'png', 'avatar'),
        name: '@cname',
        time: () => Random.now('second'),
        text: '@cparagraph(2)',
        "likeNum|1-100": 100,
        'likeActived|1': [true, false]
    }))
}

export default {
    getQuestionList: () => {
        return questionList
    },
    getAnswerList: () => {
        return answerList
    }
}