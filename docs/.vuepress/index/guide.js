// // 互联网全栈工程师
// const index = [
//     {
//         title: '指南',
//         collapsable: false,
//         children: [
//             ['', '开篇'],
//             ['develop/', '开发技术栈'],
//             ['cloudservice/', '云计算服务'], 
//             ['datascience/', '大数据分析'], 
//             ['smartmart/', '人工智能'],
//             ['metaverse/', '物联网'],
//             ['interview/','面试宝典'],
//         ]
//     },
//     {

//         title: '专题',
//         collapsable: false,
//         children: [
//             ['topic/','算法与数据'],
//             ['startup/','软件工程'],
//         ]
//     },
// ]

// module.exports.index = index

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

//Java
const java = [
    {
        title: '指南',
        collapsable: false,
        children: [
            ['', '开篇'],
            ['quickstart/', '快速开始'],
            ['grammer/', 'Java编程入门'],
            ['framework/', 'Spring轻量级Web框架'],
            ['microservice/', '微服务解决复杂问题'],
        ]
    },
    {
        title: '专题',
        collapsable: false,
        children: [
            ['springboot/', 'SpringBoot生态'],
            ['topic/', '数据交互'],
        ]
    },
    {
        title: '实战',
        collapsable: false,
        children: [
            ['project/', '项目演练'],
        ]
    },
]
module.exports.java = java
