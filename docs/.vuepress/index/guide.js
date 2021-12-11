//千锋教育-李卫民
const funtl = [
    {
        title: '指南',
        collapsable: false,
        children: [
            ['', '开篇'],
            ['framework/', '走进单体地狱'],
            ['microservice/', '微服务解决复杂问题'],
            ['datascience/', '价值互联网'],
            ['interview/', '面试宝典'],
        ]
    },
    {
        title: '实战',
        collapsable: false,
        children: [
            ['microservice/devops.md','持续集成与交付'],
            ['project/README_MYSHOP.md','MyShop实战'],
            ['project/README_ITOKEN.md','微服务实战之iToken'],
        ]
    },
    {
        title: '专题',
        collapsable: false,
        children: [
            ['topic/gitflow.md','GitFlow工作流'],
            ['topic/vue.md','Vue渐进式JavaScript框架'],
            ['topic/springsecurityoauth2.md','Spring Security Oauth2'],
        ]
    },
]

module.exports.funtl = funtl

//LeetCode
const leetcode = [
    {
        title: '学习',
        collapsable: false,
        children: [
            ['', '开篇'],
            ['learn/linelist/', '线性表'],
            ['learn/tree/', '树与二叉树'],
            ['learn/graph/', '图论'],
            ['learn/arithmetic/', '算法分析'],
        ]
    },
    {
        title: '题库',
        collapsable: false,
        children: [
            ['problems/arithmetic/', '算法'],
            ['problems/database/', '数据库'],
            ['problems/shell/', 'Shell'],
            ['problems/thread/', '多线程'],
        ]
    },
    {
        title: '专题',
        collapsable: false,
        children: [
            ['interview/', '名企面试题'],
            ['contest/', '竞赛'],
        ]
    },
]

module.exports.leetcode = leetcode

//黑马程序员
const itheima = [
    {
        title: '指南',
        collapsable: false,
        children: [
            ['', '开篇'],
            ['webapp/','前端开发'],
            ['javaee/','JavaEE'],
            ['bigdata/', '大数据分析'],
            ['cloudservice/', '云计算服务'],
            ['intelligent/', '人工智能'],
            ['blockchain/', '区块链'],
        ]
    },
    {
        title: '专题',
        collapsable: false,
        children: [
            ['topic/media/','新媒体运营'],
            // ['','智能机器人'],
        ]
    },
    {
        title: '实战',
        collapsable: false,
        children: [
            ['project/tensquare/','十次方'],
        ]
    },
]

module.exports.itheima = itheima
