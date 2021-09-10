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
        title: '专题',
        collapsable: false,
        children: [
            ['topic/vue.md','GitFlow工作流'],
            ['topic/gitflow.md','Vue渐进式JavaScript框架'],
            ['topic/springsecurityoauth2.md','Spring Security Oauth2'],
        ]
    },
    {
        title: '实战',
        collapsable: false,
        children: [
            ['myshop/','MyShop实战'],
            ['itoken/','微服务实战之iToken'],
        ]
    },
]

module.exports.funtl = funtl


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
