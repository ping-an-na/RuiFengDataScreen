import echarts from '@/components/echarts/common'

export const eventAnalysisLineOption = {
    grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        top: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'none'
        },
        formatter: function (params) {
            return (
                params[0].name +
                '<br/>' +
                "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                params[0].seriesName +
                ' : ' +
                Number((params[0].value.toFixed(4) / 10000).toFixed(2)).toLocaleString() +
                ' 万元<br/>'
            )
        }
    },
    backgroundColor: 'rgb(20,28,52)',
    xAxis: {
        show: false,
        type: 'value'
    },
    yAxis: [
        {
            type: 'category',
            inverse: true,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: ['大米', '玉米', '蔬菜', '鸡蛋', '坚果']
        },
        {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: '12'
                },
                formatter: function (value) {
                    if (value >= 10000) {
                        return (value / 10000).toLocaleString() + '万'
                    } else {
                        return value.toLocaleString()
                    }
                }
            },
            data: [50000000, 22000000, 10000000, 5000000, 1]
        }
    ],
    series: [
        {
            name: '金额',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
                normal: {
                    barBorderRadius: 30,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                            offset: 0,
                            color: 'rgb(57,89,255,1)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(46,200,207,1)'
                        }
                    ])
                }
            },
            barWidth: 20,
            data: [50000000, 22000000, 10000000, 5000000, 1]
        },
        {
            name: '背景',
            type: 'bar',
            barWidth: 20,
            barGap: '-100%',
            data: [50000000, 50000000, 50000000, 50000000, 1],
            itemStyle: {
                normal: {
                    color: 'rgba(24,31,68,1)',
                    barBorderRadius: 30
                }
            }
        }
    ]
}

/** ***8888888888 */
const yAxisDataLeft = ['中央补助资金支持项目', '地方自筹自建项目', '其他部门实施项目']
const yAxisDataRight = ['70', '80', '10']
export const colorList = [
    '#66A6FF',
    '#FBA980',
    '#AEFFAE',
    '#EE9201',
    '#29AAE3',
    '#B74AE5',
    '#0AAF9F',
    '#E89589',
    '#16A085',
    '#4A235A',
    '#C39BD3 ',
    '#F9E79F',
    '#BA4A00',
    '#ECF0F1',
    '#616A6B',
    '#EAF2F8',
    '#4A235A',
    '#3498DB'
]

// 十六进制颜色转RBG 拼接为rgba返回
function colorRgb(val) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 把颜色值变成小写
    var color = val.toLowerCase()
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = '#'
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
            }
            color = colorNew
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = []
        for (let i = 1; i < 7; i += 2) {
            colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
        }
        return 'rgba(' + colorChange.join(',') + ',0.4)'
    } else {
        return color
    }
}

// const attachData = [120, 100, 90, 60, 30]

export const rankBarChartOption = {
    // backgroundColor: "#031038",

    grid: {
        left: 20,
        bottom: -10,
        right: 20,
        top: 10
    },
    yAxis: [
        {
            inverse: true,
            data: yAxisDataLeft,
            axisLabel: {
                show: true,
                inside: true,
                textStyle: {
                    color: '#fff',
                    fontSize: 14,
                    align: 'left'
                },
                formatter: '{value}\n{a|占位}\n{a|占位}',
                rich: {
                    a: {
                        color: 'transparent',
                        lineHeight: 15
                    }
                }
            },
            // offset: 30,
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        },
        {
            inverse: true,
            data: yAxisDataRight,
            axisLabel: {
                // inside: true,
                textStyle: {
                    color: '#fff',
                    fontSize: 14,
                    align: 'right'
                },
                formatter: '{value}个\n{a|占位}\n{a|占位}',
                rich: {
                    a: {
                        color: 'transparent',
                        lineHeight: 15,
                        fontFamily: 'digital'
                    }
                }
            },
            offset: 0,
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            }
        }
    ],
    xAxis: {
        max: 300,
        show: false
    },
    series: [
        {
            // 辅助系列
            type: 'bar',
            barGap: '-100%',
            silent: true,
            itemStyle: {
                color: 'rgba(255, 255, 254, 0.2)',
                barBorderRadius: [15, 15, 15, 15]
            },
            barWidth: 6,
            data: [300, 300, 300]
        },
        {
            type: 'bar',
            data: yAxisDataRight,
            barWidth: 6,
            label: {
                position: [10, 10],
                normal: {
                    position: [800, -24],
                    show: true,
                    textStyle: {
                        color: '#8db0ff',
                        fontSize: 16
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: [15, 15, 15],
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: colorRgb(colorList[params.dataIndex])
                            },
                            {
                                offset: 1,
                                color: colorList[params.dataIndex]
                            }
                        ])
                    }
                }
            }
        },
        {
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            data: null,
            effect: {
                show: true,
                period: 3,
                trailLength: 0.3, //控制拖尾长度
                symbolSize: 10,
                symbol: 'circle',
                loop: true,
                color: '#fff' //流光颜色
            },
            lineStyle: {
                width: 0,
                opacity: 0.6,
                curveness: 0
            },
            z: 99
        }
    ]
}

/** ****第三部分饼状图 */
// var colorList = ['#FBAC7F', '#45F4F5', '#07A6FF', '#FFFFFF', '#00C2FF', '#46FFE9', '#A3F9FE', '#0084FF', '#0578B9'];
// 颜色值配置一个空，用于显示间距
const colorList1 = ['#FBAC7F', '', '#45F4F5', '', '#07A6FF', '', '#FFFFFF', '', '#00C2FF', '', '#46FFE9', '', '#A3F9FE', '', '#0084FF', '', '#0578B9', '']
let colorListAA = ['#6cb6ff', '', '#fcac80', '', '#a1ffb9', '', '#86eefe', '', '#f7c76d', '', '#55ffd8', '']
const colorList3 = ['#77cdfe', '', '#f8b976', '', '#07A6FF', '', '#FFFFFF', '', '#00C2FF', '', '#46FFE9', '', '#A3F9FE', '', '#0084FF', '', '#0578B9', '']

var data = [
    {
        name: '公共设施',
        value: '3.47',
        percent: '1.16'
    },
    {
        name: '其他',
        value: '32.58',
        percent: '10.89'
    },
    {
        name: '出借',
        value: '6.67',
        percent: '2.23'
    },
    {
        name: '出租',
        value: '23.33',
        percent: '7.8'
    }
]
let sum = 0
const optionData = []
data.forEach(item => {
    sum += Number(item.value)
})
data.forEach(item => {
    optionData.push({
        value: item.value,
        name: item.name,
        labelLine: {
            normal: {
                length: 15
            }
        },
        label: {
            normal: {
                formatter: params => {
                    return '{value|' + params.value + '}'
                },
                // padding: [0, -100, 25, -100],
                rich: {
                    value: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#fff'
                    }
                }
            }
        }
    })

    // 配置一个空值
    optionData.push({
        value: sum / 100, // 控制每个环形之间的间隙
        name: '',
        itemStyle: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
        }
    })

    // optionData.push({ name: '', value: sum / 100, itemStyle: { color: 'transparent' } });
})

export const barProjectOptions = {
    // backgroundColor: '#243c54',
    tooltip: {
        // trigger: 'item'
        trigger: 'none'
    },
    title: {
        text: sum,
        left: '34%',
        top: '45%',
        itemGap: 10,
        textStyle: {
            color: '#c0d7e1',
            fontSize: 19,
            fontWeight: 900,
            textShadowColor:'#53c4e7',
            textShadowBlur:"9",
        },
        textAlign: 'center',
        subtext: `万元`,
        subtextStyle: {
            color: '#c0e0fb',
            fontSize: 12,
            padding: [20, 0, 0, 0]
        }
    },

    legend: {
        icon: 'roundRect',
        orient: 'vertical',
        top: 'middle',
        right: 10,
        itemWidth: 17, // 设置宽度
        itemHeight: 6, // 设置高度

        itemStyle: {
            borderColor: 'transparent'
        },
        formatter: name => {
            // const obj = data.find((item) => item.name === name)
            const arr = [`{name|${name}}`]
            return arr.join('')
        },
        textStyle: {
            color: '#FFF',
            fontSize: 12,
            rich: {
                name: {
                    color: '#FFF',
                    fontSize: 12,
                    padding: [0, 0, 0, 6]
                }
            }
        },
        data: data.map((dItem, dIndex) => {
            return {
                ...dItem,
                textStyle: {
                    rich: {
                        iconName: {
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            backgroundColor: colorList[dIndex]
                        },
                        percent: {
                            color: colorList[dIndex]
                        }
                    }
                }
            }
        })
    },

    series: [
        {
            // 饼图圈
            type: 'pie',
            zlevel: 0,
            radius: ['68%', '78%'],
            center: ['35%', '50%'],

            itemStyle: {
                normal: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                // color: colorRgb(colorListAA[params.dataIndex])
                                color: colorListAA[params.dataIndex]
                                // color: colorList2[params.dataIndex],
                            },
                            {
                                offset: 1,
                                color: colorListAA[params.dataIndex + 6]
                            }
                        ])
                    }
                }
            },
            label: {
                show: true,
                // width:100,
                // position: 'outside', // 标签显示在外部
                // overflow:'break'
            },
            // labelLine: {
            //     show: true,
            //     length: 20, // 标签线长度
            //     length2: 30, // 第二段线长度
            //     smooth: 0.2, // 标签线平滑度
            // },
            data: optionData
        },
        {
            // 最外圆圈
            type: 'pie',
            zlevel: 0,
            startAngle: 30,
            clockwise: false,
            silent: true, // 取消高亮
            radius: ['57%', '63%'],
            center: ['35%', '50%'],

            itemStyle: {
                normal: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(1, 0, 0, 1, [
                            {
                                offset: 0,
                                // color: colorRgb(colorList1[params.dataIndex]),
                                // color: colorList2[params.dataIndex],
                                color: 'transparent' // 0% 处的颜色，上
                            },
                            {
                                offset: 1,
                                color: colorListAA[params.dataIndex]
                                // color: colorList1[params.dataIndex]
                            }
                        ])
                    },
                    borderRadius: 10
                }
            },
            label: {
                show: false
            },
            data: optionData
        },
        // 最里面圆环
        {
            type: 'pie',
            radius: ['50%', '51%'],
            center: ['35%', '50%'],
            animation: false,
            hoverAnimation: false,
            data: [
                {
                    value: 100
                }
            ],
            label: {
                show: false
            },
            itemStyle: {
                color: '#026C89'
            }
        },
        // 最里面圆环内的背景圆
        {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: '50%',
            animation: false,
            hoverAnimation: false,
            center: ['35%', '50%'],
            itemStyle: {
                labelLine: {
                    show: false
                },
                color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 1,
                    colorStops: [
                        {
                            offset: 1,
                            color: 'rgba(2,108,137, 0)'
                        },
                        {
                            offset: 0.5,
                            color: 'rgba(2,108,137, .4)'
                        },
                        {
                            offset: 0,
                            color: 'rgba(2,108,137, 0)'
                        }
                    ],
                    global: false // 缺省为 false
                },
                shadowBlur: 60
            },
            data: [
                {
                    value: 100
                }
            ]
        }
    ]
}
const colorListNum = ['1', '', '2', '']
export const setBarProjectOptionsSe2New = (sum, data, optionData, middleYunObj = {}) => {
    return {
        series: [
            {
                // 饼图圈
                type: 'pie',
                zlevel: 1,
                radius: ['45%', '64%'],
                center: ['50%', '50%'],
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // console.log(params, 'paramsparams')
                            if (sum) {
                                return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        color: colorListNum[params.dataIndex] === '1' ? '#71c1ff' : '#f6ac7f'
                                        // color: colorList3[params.dataIndex],
                                    },
                                    {
                                        offset: 1,
                                        color: colorListNum[params.dataIndex] === '1' ? '#85eefe' : '#f6c66d' //
                                        // colorList3[params.dataIndex]
                                    }
                                ])
                            } else {
                                return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        // color: colorRgb(colorList3[params.dataIndex * 2])
                                        color: colorListNum[params.dataIndex * 2] === '1' ? '#71c1ff' : '#f6ac7f'
                                        // color: colorList3[params.dataIndex],
                                    },
                                    {
                                        offset: 1,
                                        color: colorListNum[params.dataIndex] === '1' ? '#85eefe' : '#f6c66d' //
                                        // color: colorList3[params.dataIndex * 2]
                                    }
                                ])
                            }

                        }
                    }
                },
                data: optionData,

            }
        ],
        tooltip: {
            // trigger: 'item'
            trigger: 'none',
        },
        title: {
            // text: `总金额 \n \n \n 万元'`,
            text: sum ? sum : "0",
            left: '48.9%',
            top: '45%',
            itemGap: 10,
            textStyle: {
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                textShadowColor:'#FFF',
                textShadowBlur:"10",
            },
            textAlign: 'center',
        },
        graphic: [
            {
                type: 'image',
                id: 'logo',
                left: 'center',
                top: 'center',
                z: -10,
                bounding: 'raw',
                rotation: 0, //旋转
                origin: [40, 4], //中心点
                scale: [1.0, 1.0], //缩放
                //设置图片样式
                style: {
                    image: require('@/assets/agriculture/FullCircleCopy.png'),
                    width: middleYunObj.width || 110,
                    height: middleYunObj.height || 110,
                    opacity: 1
                }
            }
        ],
        legend: {
            icon: 'roundRect',
            orient: 'horizontal', // 设置为横向排列
            // top: 'bottom', // 将图例放置在底部
            bottom: '-5',
            left: 'center',
            right: '20', // 将图例居中
            itemWidth: 17, // 设置宽度
            itemHeight: 6, // 设置高度
            itemStyle: {
                borderColor: 'transparent'
            },
            // formatter: name => {
            //     // const obj = data.find((item) => item.name === name)
            //     const arr = [`{name|${name}}`]
            //     return arr.join('')
            // },
            textStyle: {
                color: '#FFF',
                fontSize: 10,
                rich: {
                    name: {
                        color: '#FFF',
                        fontSize: 6,
                        padding: [0, 0, 0, 6]
                    }
                }
            },
            data: data.map((dItem, dIndex) => {
                return {
                    ...dItem,
                    textStyle: {
                        rich: {
                            iconName: {
                                width: 16,
                                height: 16,
                                borderRadius: 2,
                                backgroundColor: colorList[dIndex]
                            },
                            percent: {
                                color: colorList[dIndex]
                            }
                        }
                    }
                }
            })
        },

    }
}

export const setBarProjectOptionsSe2 = (sum, data, optionData, middleYunObj = {}) => {
    return {
        tooltip: {
            // trigger: 'item'
            trigger: 'none'
        },
        // title: {
        //     text: `总量`,
        //     left: '40%',
        //     top: '35%',
        //     itemGap: 10,
        //     textStyle: {
        //         // color: 'rgba(255,255,255,0.5)',
        //         color: '#FFF',
        //         fontSize: 22,
        //         fontWeight: 400
        //     },
        //     textAlign: 'center',
        //     subtext: sum ? sum : "0",
        //     subtextStyle: {
        //         // color: '#c0d7e1',
        //         color: '#FFF',
        //         textShadowColor:'rgba(255,255,255,0.5)',
        //         fontSize: 28,
        //         fontWeight: 900
        //     }
        // },
        graphic: [
            {
                type: 'image',
                id: 'logo',
                // left: 'center',
                // top: 'center',
                left: '21%', //调整图片位置
                top: 'center', //调整图片位置
                z: -10,
                bounding: 'raw',
                rotation: 0, //旋转
                origin: [40, 40], //中心点
                scale: [1.0, 1.0], //缩放
                //设置图片样式
                style: {
                    image: require('@/assets/agriculture/FullCircleCopy.png'),
                    width: middleYunObj.width || 160,
                    height: middleYunObj.height || 160,
                    opacity: 1
                }
            }
        ],
        legend: {
            icon: 'roundRect',
            orient: 'rect', // 设置为横向排列
            top: 'middle', // 将图例放置在底部
            right: '20', // 将图例居中
            itemWidth: 17, // 设置宽度
            itemHeight: 6, // 设置高度
            itemStyle: {
                borderColor: 'transparent'
            },
            // formatter: name => {
            //     // const obj = data.find((item) => item.name === name)
            //     const arr = [`{name|${name}}`]
            //     return arr.join('')
            // },
            textStyle: {
                color: '#FFF',
                fontSize: 12,
                rich: {
                    name: {
                        color: '#FFF',
                        fontSize: 12,
                        padding: [0, 0, 0, 6]
                    }
                }
            },
            data: data.map((dItem, dIndex) => {
                return {
                    ...dItem,
                    textStyle: {
                        rich: {
                            iconName: {
                                width: 16,
                                height: 16,
                                borderRadius: 2,
                                backgroundColor: colorList[dIndex]
                            },
                            percent: {
                                color: colorList[dIndex]
                            }
                        }
                    }
                }
            })
        },

        series: [
            {
                // 饼图圈
                type: 'pie',
                zlevel: 1,
                // minAngle: 15,//最小角度
                // startAngle:270, //起始角度
                radius: ['65%', '85%'],
                center: ['40%', '50%'],
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // console.log(params, 'paramsparams')
                            if (sum) {
                                return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        color: colorRgb(colorList1[params.dataIndex])
                                        // color: colorList2[params.dataIndex],
                                    },
                                    {
                                        offset: 1,
                                        color: colorList1[params.dataIndex]
                                    }
                                ])
                            } else {
                                return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        color: colorRgb(colorList1[params.dataIndex * 2])
                                        // color: colorList2[params.dataIndex],
                                    },
                                    {
                                        offset: 1,
                                        color: colorList1[params.dataIndex * 2]
                                    }
                                ])
                            }

                        }
                    }
                },
                data: optionData
            }
        ]
    }
}

export const barProjectOptionsSe2 = {
    tooltip: {
        // trigger: 'item'
        trigger: 'none'
    },
    title: {
        text: sum,
        left: '48.9%',
        top: '40%',
        itemGap: 10,
        textStyle: {
            color: '#fff',
            fontSize: 12,
            fontWeight: 500
        },
        textAlign: 'center',
        subtext: `总量`,
        subtextStyle: {
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            fontWeight: 600
        }
    },
    graphic: [
        {
            type: 'image',
            id: 'logo',
            left: 'center',
            top: 'center',
            z: -10,
            bounding: 'raw',
            rotation: 0, //旋转
            origin: [40, 4], //中心点
            scale: [1.0, 1.0], //缩放
            //设置图片样式
            style: {
                image: require('@/assets/agriculture/FullCircleCopy.png'),
                width: 70,
                height: 70,
                opacity: 1
            }
        }
    ],
    legend: {
        icon: 'roundRect',
        // orient: 'vertical',
        // bottom: 0,
        orient: 'horizontal', // 设置为横向排列
        top: 'bottom', // 将图例放置在底部
        left: 'center', // 将图例居中

        // left: 250,
        itemWidth: 17, // 设置宽度
        itemHeight: 6, // 设置高度

        itemStyle: {
            borderColor: 'transparent'
        },
        formatter: name => {
            // const obj = data.find((item) => item.name === name)
            const arr = [`{name|${name}}`]
            return arr.join('')
        },
        textStyle: {
            color: '#FFF',
            fontSize: 12,
            rich: {
                name: {
                    color: '#FFF',
                    fontSize: 12,
                    padding: [0, 0, 0, 6]
                }
            }
        },
        data: data.map((dItem, dIndex) => {
            return {
                ...dItem,
                textStyle: {
                    rich: {
                        iconName: {
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            backgroundColor: colorList[dIndex]
                        },
                        percent: {
                            color: colorList[dIndex]
                        }
                    }
                }
            }
        })
    },

    series: [
        {
            // 饼图圈
            type: 'pie',
            zlevel: 1,
            radius: ['40%', '60%'],
            center: ['50%', '50%'],
            itemStyle: {
                normal: {
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: colorRgb(colorList1[params.dataIndex])
                                // color: colorList2[params.dataIndex],
                            },
                            {
                                offset: 1,
                                color: colorList1[params.dataIndex]
                            }
                        ])
                    }
                }
            },
            data: optionData
        }
    ]
}
/** **** */
// var dataList = [
//     { name: '基础建设', value: 73, max: 100 },
//     { name: '高效节水', value: 18, max: 100 },
//     { name: '改造提升', value: 43, max: 100 }
// ]
var colorListArea1 = ['rgba(38, 138, 255, 0.9)', 'rgba(30, 214, 255, 0.9)', 'rgba(61, 255, 220, 0.9)', 'rgba(54, 240, 151, 0.9)']
var colorListArea2 = ['#1A60B1', '#1691B3', '#2AAB9C', '#25A270']
var colorListArea3 = ['#268AFF', '#1ED6FF', '#3DFFDC', '#36F097']
var colorListArea4 = ['rgba(38, 138, 255, 0.2)', 'rgba(30, 214, 255, 0.2)', 'rgba(61, 255, 220, 0.2)', 'rgba(54, 240, 151, 0.2)']

// export const areaOption = {
//     // legend: {
//     //   icon: 'roundRect',
//     //   orient: "vertical",
//     //   top: "middle",
//     //   left: 250,
//     //   itemWidth: 17, // 设置宽度
//     //   itemHeight: 6, // 设置高度

//     //   itemStyle: {
//     //     borderColor: "transparent",
//     //   },
//     //   formatter: (name) => {
//     //     let obj = dataList.find(item => item.name === name)
//     //     const arr = [
//     //       `{name|${name}}`
//     //     ];
//     //     return arr.join('')
//     //   },
//     //   textStyle: {
//     //     color: '#FFF',
//     //     fontSize: 12,
//     //     rich: {
//     //       name: {
//     //         color: '#FFF',
//     //         fontSize: 12,
//     //         padding: [0, 0, 0, 6],
//     //       },

//     //     }
//     //   },
//     //   data: dataList.map((dItem, dIndex) => {
//     //     return {
//     //       ...dItem,
//     //       textStyle: {
//     //         rich: {
//     //           iconName: {
//     //             width: 16,
//     //             height: 16,
//     //             borderRadius: 2,
//     //             backgroundColor: colorListArea1[dIndex],
//     //           },
//     //           percent: {
//     //             color: colorListArea1[dIndex],
//     //           },
//     //         }
//     //       },

//     //     }
//     //   }),
//     // },
//     // tooltip: {
//     //     trigger: 'item',
//     //     backgroundColor: 'rgba(0,0,0,0.5)',
//     //     borderColor: 'rgba(89,211,255,1)',
//     //     borderWidth: 2,
//     //     padding: 5,
//     //     textStyle: {
//     //         color: 'rgba(89,211,255,1)',
//     //         fontSize: 18,
//     //         width: 300,
//     //         height: 40
//     //     },
//     //     formatter: '{c}' + '%',
//     //     extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
//     //     // 自定义的 CSS 样式
//     // },
//     grid: {
//         bottom: '20%',
//         top: '20',
//         right: '40%',
//         left: '0%'
//     },
//     xAxis: {
//         data: ['基础建设', '高效节水', '改造提升'],
//         axisTick: {
//             show: false
//         },
//         axisLine: {
//             show: false
//         },
//         axisLabel: {
//             show: true,
//             textStyle: {
//                 color: '#fff'
//             },
//             margin: 30 // 刻度标签与轴线之间的距离。
//         }
//     },
//     yAxis: {
//         splitLine: {
//             show: false
//         },
//         axisTick: {
//             show: false
//         },
//         axisLine: {
//             show: false
//         },
//         axisLabel: {
//             show: false
//         }
//     },
//     series: [
//         // 头
//         {
//             name: '',
//             type: 'pictorialBar',
//             symbolSize: [40, 10],
//             symbolOffset: [0, -5],
//             z: 12,
//             data: topData
//         },
//         // 底部立体柱
//         {
//             stack: '1',
//             type: 'bar',
//             silent: true,
//             barWidth: 40,
//             data: bottomBar
//         },
//         // 最底下的圆片
//         {
//             // name: '',
//             type: 'pictorialBar',
//             symbolSize: [40, 15],
//             symbolOffset: [0, 8],
//             z: 12,

//             data: bottomCircle
//         },
//         // 中间圆片
//         {
//             // name: '',
//             type: 'pictorialBar',
//             symbolSize: [40, 15],
//             symbolOffset: [0, -10],

//             z: 12,
//             data: middleCircle
//         },
//         // 上部立体柱
//         {
//             // 上部立体柱
//             stack: '1',
//             type: 'bar',
//             label: {
//                 show: true,
//                 position: 'inside', // top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
//                 distance: 30,
//                 color: '#fff',
//                 fontSize: 14,
//                 formatter: function (item) {
//                     var a = 100
//                     return a - item.value + '%'
//                 }
//             },
//             silent: true,
//             barWidth: 40,
//             // barGap: '-100%', // Make series be overlap
//             data: upBar,
//             z: 10
//         }
//     ]
// }

export function setAreaOption(dataList, totals) {
    // 头部数据
    const topData = dataList.map((item, index) => {
        return {
            name: '',
            z: 1,
            value: item.max,
            symbolPosition: 'end',
            itemStyle: {
                // color: colorListArea1[index]
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: item.color ? item.color + 'E5' : colorListArea1[index]
                            },
                            {
                                offset: 1,
                                color: item.color || colorListArea2[index]
                            }
                        ],
                        false
                    )
                }
            }
        }
    })
    // 底部立体柱子
    const bottomBar = dataList.map((item, index) => {
        return {
            value: item.value,
            itemStyle: {
                normal: {
                    color: {
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        type: 'linear',
                        global: false,
                        // color:colorListArea2[index]
                        colorStops: [
                            {
                                // 第一节下面
                                offset: 0,
                                color: item.color ? item.color + '33' : colorListArea4[index]
                            },
                            {
                                offset: 1,
                                color: item.color || colorListArea2[index]
                            }
                        ]
                    }
                }
            }
        }
    })
    // 底下圆片
    const bottomCircle = dataList.map((item, index) => {
        return {
            name: '',
            value: item.max,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                        {
                            offset: 0,
                            color: item.color || colorListArea2[index]
                        },
                        {
                            offset: 1,
                            color: item.color ? item.color + 'E5' : colorListArea3[index]
                        }
                    ],
                    false
                )
            }
        }
    })
    // 中间圆片
    const middleCircle = dataList.map((item, index) => {
        return {
            name: '',
            value: item.value,
            symbolPosition: 'end',
            itemStyle: {
                color: item.color ? item.color + 'E5' : colorListArea3[index]
            }
        }
    })
    // 上边的柱子
    const upBar = dataList.map((item, index) => {
        return {
            name: item.name,
            value: item.max - item.value,
            itemStyle: {
                color: item.color ? item.color + '33' : colorListArea4[index]
            }
        }
    })
    const options = {
        // legend: {
        //   icon: 'roundRect',
        //   orient: "vertical",
        //   top: "middle",
        //   left: 250,
        //   itemWidth: 17, // 设置宽度
        //   itemHeight: 6, // 设置高度

        //   itemStyle: {
        //     borderColor: "transparent",
        //   },
        //   formatter: (name) => {
        //     let obj = dataList.find(item => item.name === name)
        //     const arr = [
        //       `{name|${name}}`
        //     ];
        //     return arr.join('')
        //   },
        //   textStyle: {
        //     color: '#FFF',
        //     fontSize: 12,
        //     rich: {
        //       name: {
        //         color: '#FFF',
        //         fontSize: 12,
        //         padding: [0, 0, 0, 6],
        //       },

        //     }
        //   },
        //   data: dataList.map((dItem, dIndex) => {
        //     return {
        //       ...dItem,
        //       textStyle: {
        //         rich: {
        //           iconName: {
        //             width: 16,
        //             height: 16,
        //             borderRadius: 2,
        //             backgroundColor: colorListArea1[dIndex],
        //           },
        //           percent: {
        //             color: colorListArea1[dIndex],
        //           },
        //         }
        //       },

        //     }
        //   }),
        // },
        // tooltip: {
        //     trigger: 'item',
        //     backgroundColor: 'rgba(0,0,0,0.5)',
        //     borderColor: 'rgba(89,211,255,1)',
        //     borderWidth: 2,
        //     padding: 5,
        //     textStyle: {
        //         color: 'rgba(89,211,255,1)',
        //         fontSize: 18,
        //         width: 300,
        //         height: 40
        //     },
        //     formatter: '{c}' + '%',
        //     extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        //     // 自定义的 CSS 样式
        // },
        grid: {
            bottom: '20%',
            top: '20',
            right: '40%',
            left: '0%'
        },
        xAxis: {
            data: ['基础建设', '高效节水', '改造提升'],
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
                margin: 30 // 刻度标签与轴线之间的距离。
            }
        },
        yAxis: {
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            }
        },
        series: [
            // 头
            {
                name: '',
                type: 'pictorialBar',
                symbolSize: [40, 10],
                symbolOffset: [0, -5],
                z: 0,
                data: topData
            },
            // 底部立体柱
            {
                stack: '1',
                type: 'bar',
                silent: true,
                barWidth: 40,
                data: bottomBar
            },
            // 最底下的圆片
            {
                // name: '',
                type: 'pictorialBar',
                symbolSize: [40, 15],
                symbolOffset: [0, 8],
                z: 12,
                data: bottomCircle
            },
            // 中间圆片
            {
                // name: '',
                type: 'pictorialBar',
                symbolSize: [40, 15],
                symbolOffset: [0, -10],
                z: 12,
                data: middleCircle
            },
            // 上部立体柱
            {
                // 上部立体柱
                stack: '1',
                type: 'bar',
                label: {
                    show: true,
                    position: 'insideBottom', // top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
                    distance: 30,
                    color: '#fff',
                    fontSize: 14,
                    formatter: function (item) {
                        const num = totals - item.value
                        return parseFloat(num.toFixed(1))
                    }
                },
                silent: true,
                barWidth: 40,
                // barGap: '-100%', // Make series be overlap
                data: upBar,
                z: 10
            }
        ],
    }
    return options
}

/**  */
const ziProcessData = [
    {
        name: '如东',
        value1: 900,
        value2: 400
    },
    {
        name: '海安',
        value1: 300,
        value2: 400
    },
    {
        name: '通州区',
        value1: 400,
        value2: 400
    },
    {
        name: '启动市',
        value1: 100,
        value2: 400
    },
    {
        name: '通州区',
        value1: 400,
        value2: 400
    },
    {
        name: '启动市',
        value1: 100,
        value2: 400
    }
]
const keyDataList = ziProcessData.map(item => item.name)
const firListData = ziProcessData.map(item => item.value1)
const secListData = ziProcessData.map(item => item.value2)
export const moneyProcess = {
    legend: {
        data: ['报账金额', '拨帐金额'],
        orient: 'horizontal',
        x: '20', // 可设定图例在左、右、居中
        y: '0', // 可设定图例在上、下、居中
        // align: 'left',
        // top: '0',
        icon: 'circle', // 设置显示为矩形
        textStyle: {
            // 图例文字的样式
            color: '#ffffff',
            fontSize: 14,
            padding: [1, 10],
            fontWeight: 'normal',
            fontStretch: 'normal',
            letterSpacing: 0,
            fontFamily: 'SourceHanSansCN-Regular'
        },
        itemWidth: 11,
        itemHeight: 11,
        itemGap: 40, // 图例之间的距离
        padding: [0, 0, 0, 0]
    }, // 图例的设置
    grid: {
        left: '30',
        right: '15',
        bottom: '10%',
        top: '15%',
        containLabel: true
    },
    xAxis: {

        type: 'category',
        data: keyDataList,
        // max:4,
        axisTick: {
            // 去除刻度线
            show: false
        },
        splitLine: {
            // 去除刻度线
            show: false
        },
        axisLine: {
            // 轴线样式
            lineStyle: {
                color: '#00B4D6',
                width: 1 // 这里是为了突出显示加上的
            }
        },
        axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
                color: '#fff', // 更改坐标轴文字颜色
                fontSize: 14,
                fontFamily: 'Source Han Sans CN',
                fontWeight: 'normal',
                fontStretch: 'normal',
                lineHeight: 19,
                letterSpacing: 0
            }
        }
    },
    yAxis: {

        type: 'value',
        // name:"(亿元)",
        splitNumber: 4,
        nameTextStyle: {
            // y轴上方单位的颜色
            color: '#fff',
            fontFamily: 'SourceHanSansSC-Regular',
            fontSize: 14,
            fontWeight: 'normal',
            fontStretch: 'normal',
            lineHeight: 19,
            letterSpacing: 0,
            padding: [0, 40, 0, 0]
        },
        axisTick: {
            // 去除刻度线
            show: false
        },

        splitLine: {
            // 设置网格颜色
            show: true,
            lineStyle: {
                color: ['rgba(0, 180, 214,0.3)'],
                width: 0.8  ,
                type: 'solid'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#00B4D6',
                width: 2 // 这里是为了突出显示加上的
            },
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff', // 更改坐标轴文字颜色
                fontFamily: 'SourceHanSansSC-Regular',
                fontSize: 14,
                fontWeight: 'normal',
                fontStretch: 'normal',
                lineHeight: 19,
                letterSpacing: 0
            }
        }
    },
    series: [
        {
            name: '报账金额',
            type: 'bar',
            barWidth: '15px',
            data: firListData,
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(0,198,255,0.9)',
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#00A2FF'
                        },
                        {
                            offset: 1,
                            color: 'rgba(34,117,255,0.8)'
                        }
                    ]),
                    opacity: 1
                }
            } // 设置柱形渐变
        },

        {
            name: '拨帐金额',
            type: 'bar',
            barWidth: '15px',
            barCategoryGap: '30%',
            barGap: '30%',
            data: secListData,
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#b8f5e6e8',
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#0882A0'
                        },
                        {
                            offset: 1,
                            color: '#20D9AA'
                        }
                    ])
                    // opacity: 0.6,
                }
            } // 设置柱形渐变
        }
    ],
    tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'none',
        borderColor: 'none',
        borderWidth: 0,
        formatter: function (param) {
            // <div>${param[0].name}</div>
            return `
                <div>
                    <div style="color: #049afb;">${param[0].seriesName}: ${param[0].value}万元</div>
                    <div style="color: #21e8ba;">${param[1].seriesName}: ${param[1].value}万元</div>
                </div>
            `;
        },
        axisPointer: {
            lineStyle: {
                color: '#21e8ba'
            }
        },
        textStyle: {
            color: "#fff"
        },
    },

}

/** 年度建设投资金额 */
export const yearBuildMoneyOption = {
    // backgroundColor: '#002653',
    tooltip: {
        trigger: 'axis',
        confine: true,
        position: (point) => [point[0], point[1]],
        backgroundColor: 'none',
        borderColor: 'none',
        borderWidth: 0,
        formatter: function (params) {
            return `
          <div style="background-color:none;font-size: 16px;font-weight: 600;color: #39EAED;margin-top: -50px">
          ${params[0].value}
          <span style="font-size: 12px;font-weight: 400">万元</span>
          </div>`
        },
        axisPointer: {
            lineStyle: {
                color: '#3FFFFF'
            }
        }
    },

    grid: {
        left: '4%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        // color: "yellow",
        // backgroundColor: 'red',
        containLabel: true
    },
    // toolbox: {
    //     feature: {
    //         saveAsImage: {},
    //     },
    // },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
            show: false // 不显示 y 轴线
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '100', // 坐标轴字体颜色
                fontSize: 10 // 坐标轴字体大小
            }
        },
        boundaryGap: false // 不留白，从原点开始
    },
    yAxis: {
        type: 'value',
        name: '单位：万元',
        nameTextStyle: {
            color: '#C0C4CC',
            fontSize: 12
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#C0C4CC'
            }
        },
        // data: [1, 2, 3],
        axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
                color: '#C0C4CC'
            }
        },
        // 虚线
        splitLine: {
            show: true,
            lineStyle: {
                color: '#303133',
                // 虚线间距
                type: [6, 3],
                dashOffset: 2
            }
        },
        axisLabel: {
            padding: [0, 5, 0, 0],
            fontSize: 12,
            textStyle: {
                color: '#C0C4CC',
                fontFamily: 'Microsoft YaHei'
            }
        }
    },
    series: [
        {
            name: 'Step Middle',
            type: 'line',
            step: 'middle',
            data: [
                {
                    value: 220,
                    itemStyle: {
                        normal: {
                            color: '#fff' // 第二条线的颜色 #fff
                        }
                    }
                },
                282,
                201,
                234,
                290,
                430,
                410
            ],
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: '#3FFFFF' // 第二条线的颜色
                    }
                }
            },
            areaStyle: {
                // 区域填充样式
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(32,255,231, 0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(32,255,231, 0)'
                        }
                    ])
                }
            }
        }
    ]
}

/** 平台活跃度 */
export const ptActive = {
    tooltip: {
        trigger: 'axis',
        confine: true,
        position: (point) => [point[0], point[1] - 50],
        backgroundColor: 'none',
        borderColor: 'none',
        border: 0,
        borderWidth: 0,
        formatter: function (params) {
            return `
         <div style="background-color:none;font-size: 16px;font-weight: 600;color: #1d7aff;">
         ${params[0].value}</div>`
        },
        axisPointer: {
            lineStyle: {
                color: '#1d7aff'
            }
        }
    },
    // title: {
    //     text: '近六个月',
    //     top: 0,
    //     right: '8%',
    //     textStyle: {
    //         fontSize: 12,
    //         color: '#fff'
    //     }
    // },
    grid: {
        left: '12%',
        right: '12%',
        bottom: '15%',
        top: '15%'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
            lineStyle: {
                color: '#dddddd'
            }
        },
        axisTick: {
            show: false,
            alignWithLabel: true,
            lineStyle: {
                color: '#f3f3f3'
            }
        },
        axisLabel: {
            fontSize: 12,
            textStyle: {
                color: '#C0C4CC',
                fontFamily: 'Microsoft YaHei'
            }
        }
    },

    yAxis: {
        name: '人次',
        position: 'left',
        nameTextStyle: {
            color: '#C0C4CC',
            fontSize: 12
        },
        type: 'value',
        axisLine: {
            show: false,
            lineStyle: {
                color: '#C0C4CC'
            }
        },
        // data: [1, 2, 3],
        axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
                color: '#C0C4CC'
            }
        },
        // 虚线
        splitLine: {
            show: true,
            lineStyle: {
                color: '#303133',
                // 虚线间距
                type: [6, 3],
                dashOffset: 2
            }
        },
        axisLabel: {
            padding: [0, 5, 0, 0],
            fontSize: 12,
            textStyle: {
                color: '#C0C4CC',
                fontFamily: 'Microsoft YaHei'
            }
        }
    },
    series: [
        {
            type: 'bar',
            barWidth: 16,
            data: [200, 240, 300, 340, 100, 280, 123],
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#b9cdf1fa',
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: '#2275FF'
                        },
                        {
                            offset: 1,
                            color: '#00A2FF'
                        }
                    ])
                }
            }
        },
        {
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            data: null,
            effect: {
                show: true,
                period: 2.5,
                trailLength: 0.5, //控制拖尾长度
                symbolSize: 10,
                symbol: 'circle',
                loop: true,

                color: '#fff' //流光颜色
            },
            lineStyle: {
                width: 0,
                opacity: 0.6,
                curveness: 0
            },
            z: 99
        }
    ]
}

/** 项目竣工数 */

const yLabelImage = require('@/assets/agriculture/diqvbeijing.png')

var rankPic = {
    first: 'https://statics.888ppt.com/Upload/imgs/a30067ac8119ac20/1.jpg!800'
}

var data1 = [
    {
        id: 1,
        rank: 1,
        itemName: '南京市',
        itemValue: null,
        total: 6
    },
    {
        id: 2,
        rank: 1,
        itemName: '无锡市',
        itemValue: 1,
        total: 3
    },
    {
        id: 3,
        rank: 1,
        itemName: '无锡市',
        itemValue: null,
        total: 7
    }
]
var dataTitle = data1.map(item => {
    return item.itemName
})

export const finishProject = {
    // tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //         type: 'shadow'
    //     }
    // },
    tooltip: {
        trigger: 'none'
    },
    legend: {
        show: false
    },
    grid: {
        top: '0',
        left: '-15px',
        right: 8,
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        show: false,
        type: 'value',
        boundaryGap: [0, 0.01],
        axisTick: {
            // 轴刻度线
            show: false
        },
        splitLine: {
            // 网格线
            show: false
        }
    },
    yAxis: [
        {
            type: 'category',
            inverse: true,
            axisLabel: {
                margin: 30,
                color: '#fff',
                fontSize: 14,
                textStyle: {
                    align: 'middle'
                },
                offset: 50,
                formatter: function (value) {
                    return '{' + value + '|' + dataTitle[value - 1] + '}'
                },
                rich: {
                    1: {
                        height: 50,
                        width: 50,
                        align: 'center',
                        backgroundColor: {
                            image: yLabelImage
                        }
                    }
                }
            },
            data: data1.map(item => item.rank),
            axisTick: {
                // 轴刻度线
                show: false
            },
            splitLine: {
                // 网格线
                show: false
            },
            axisLine: {
                // y轴线
                show: false
            }
        },
        {
            type: 'category',
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: -60,
                textStyle: {
                    fontSize: 10,
                    color: '#64AFCB',
                    verticalAlign: 'top',
                    padding: [8, 0, 0, -4]
                },
                formatter: function (value, index) {
                    return data1[index].itemValue + '/ ' + data1[index].total
                }
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: data1.map(item => item.rank)
        }
    ],
    series: [
        {
            name: '数据内框',
            type: 'bar',
            itemStyle: {
                normal: {
                    barBorderRadius: 3,
                    color: function (params) {
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: '#FBA980'
                            },
                            {
                                offset: 1,
                                color: '#F7CB6B'
                            }
                        ])
                    }
                }
            },
            barWidth: 6,
            data: data1.map(item => item.itemValue)
        },
        {
            name: '外框',
            type: 'bar',
            itemStyle: {
                normal: {
                    barBorderRadius: 3,
                    color: '#1d2137'
                }
            },
            barGap: '-100%',
            z: 0,
            barWidth: 6,
            data: data1.map(item => item.total)
        }
    ]
}

export const jsdhoption = {
    title: {
        text: '长期积压（未借出）机具金额排名前10的机具金额',
        left: 'center',
        top: '24',
        textStyle: {
            color: '#00FFF4',
            fontSize: 16
        }
    },
    tooltip: {
        trigger: 'none',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: false
    },
    grid: {
        left: '-25%',
        right: '7%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        show: false,
        type: 'value',
        boundaryGap: [0, 0.01],
        axisTick: {
            // 轴刻度线
            show: false
        },
        splitLine: {
            // 网格线
            show: false
        }
    },
    yAxis: {
        type: 'category',
        inverse: true,
        // rich: {
        //     1: {
        //         height: 50,
        //         width: "100%",
        //         align: "center",
        //         backgroundColor: {
        //             image: rankPic.first,
        //         },
        //     },
        // },
        axisLabel: {
            margin: 10,
            distance: -10, // 向上移动
            alignWithLabel: true, // 使用标签位置作为参考
            textStyle: {
                align: 'left'
            },
            formatter: function (value) {
                return '{' + value + '|} {s|' + dataTitle[value - 1] + '}'
            },
            rich: {
                1: {
                    height: 20,
                    align: 'center',
                    backgroundColor: {
                        image: rankPic.first
                    }
                }
            }
        },
        data: data1.map(item => item.rank),
        axisTick: {
            // 轴刻度线
            show: false
        },
        splitLine: {
            // 网格线
            show: false
        },
        axisLine: {
            // y轴线
            show: false
        }
    },
    series: [
        {
            name: '2011',
            type: 'bar',
            data: [9000, 8500, 7000, 6500, 6000, 5500, 5000, 4500],
            label: {
                show: true,
                position: 'right',
                color: '#fff'
            },
            barWidth: 17,
            itemStyle: {
                emphasis: {
                    barBorderRadius: 7
                },
                normal: {
                    barBorderRadius: 7,
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {offset: 0, color: '#0F87FA'},
                        {offset: 1, color: '#00C0FE'}
                    ])
                }
            }
        }
    ]
}

// 横向柱状图
export const usepeoplerangeEchartsOption = {
    // backgroundColor: '#001037',
    grid: {
        top: 6,
        right: 100,
        bottom: 25,
        left: 100
    },
    yAxis: {
        type: 'category',
        axisLine: {
            show: false,
            lineStyle: {
                color: 'rgba(255, 210, 162, 0.1)'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Source Han Sans CN'
        },
        data: []
    },
    xAxis: [
        {
            show: false,
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 210, 162, 0.1)'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                textStyle: {
                    color: '#ADD6FF'
                }
            }
        }
    ],
    series: [
        {
            name: 'a',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgb(5,27,56)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgb(36,188,255)' // 100% 处的颜色
                            }
                        ]
                    }
                }
            },
            data: [100],
            z: 1,
        },
        {
            type: 'pictorialBar',
            itemStyle: {
                normal: {
                    color: '#0d2033'
                }
            },
            symbolRepeat: 11,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [4, 13],
            symbolPosition: 'start',
            symbolOffset: [0, -8],
            data: [100],
            z: 2,
        },
        {
            name: 'b',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0,0,0,0)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,0,0,0)' // 0% 处的颜色
                            }
                        ]
                    },
                }
            },
            data: [100],
            z: 3,
            label: {
                normal: {
                    show: true, // 是否显示进度条上方的百分比
                    formatter: data => {
                        return data.value + '%'
                    },
                    position: 'right',
                    textStyle: {
                        color: '#ffffff', // 进度条上方百分比字体颜色
                        fontSize: 20,
                        overflow: 'visible', // 允许文本超出元素边界
                    },
                    offset: [20, -15]
                }
            }
        },
    ]
}

/** 圆圈进度 */
let pieData = [
    {
        name: '总数量',
        value: 100
    }
    // {
    //     name: '在线数量',
    //     value: 60
    // },
    // {
    //     name: '在线率',
    //     value: 40
    // },
    // {
    //     name: '总数量',
    //     value: 100
    // },
    // {
    //     name: '在线数量',
    //     value: 60
    // },
    // {
    //     name: '在线率',
    //     value: 40
    // }
]

var titleArr = [],
    seriesArr = []

pieData.forEach(function (item, index) {
    titleArr.push({
        text: item.name,
        left: index * 35 + 15.5 + '%',
        top: '70%',
        textAlign: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: '20',
            color: 'white',
            textAlign: 'center'
        }
    })
    seriesArr.push(
        {
            type: 'pie',
            name: '外层细圆环',
            radius: ['80%', '81%'],
            center: [index * 34 + 15.5 + '%', '45%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
                normal: {
                    color: '#6e7175'
                }
            },
            label: {
                show: false
            },
            data: [100]
        },
        {
            type: 'pie',
            name: '内层层细圆环',
            radius: ['65%', '66%'],
            center: [index * 34 + 15.5 + '%', '45%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
                normal: {
                    color: '#6e7175'
                }
            },
            label: {
                show: false
            },
            data: [100]
        }
        // {
        //     name: '中间圆',
        //     type: 'pie',
        //     radius: [0, '23%'],
        //     center: [index * 34 + 15.5 + '%', '45%'],
        //     animation: false,
        //     hoverAnimation: false,
        //     clockWise: false,
        //     itemStyle: {
        //         color: 'rgba(108, 255, 208, 1)'
        //     },
        //     label: {
        //         show: false
        //     },
        //     data: [1]
        // },
        // {
        //     type: 'pie',
        //     zlevel: 3,
        //     silent: true,
        //     radius: ['68%', '75%'],
        //     center: [index * 34 + 15.5 + '%', '45%'],
        //     label: {
        //         normal: {
        //             show: false
        //         }
        //     },
        //     labelLine: {
        //         normal: {
        //             show: false
        //         }
        //     },
        //     data: dotArr()
        // }
    )
})

seriesArr.push(
    {
        name: pieData[0].name,
        type: 'pie',
        clockWise: false,
        radius: ['68%', '75%'],
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: '#89F7FE'
                    },
                    {
                        offset: 1,
                        color: '#66A6FF'
                    }
                ]),
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }
        },
        hoverAnimation: false,
        center: [0 * 34 + 15.5 + '%', '45%'],
        data: [
            {
                value: pieData[0].value,
                label: {
                    normal: {
                        formatter: function (params) {
                            return params.value + '亩'
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: '25',
                            // fontWeight: 'bold',
                            color: '#1cc7ff'
                        }
                    }
                }
            }
        ]
    }
    // {
    //     name: pieData[1].name,
    //     type: 'pie',
    //     clockWise: false,
    //     radius: ['28%', '33%'],
    //     itemStyle: {
    //         normal: {
    //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //                 {
    //                     offset: 0,
    //                     color: '#0ff'
    //                 },
    //                 {
    //                     offset: 1,
    //                     color: '#5467df'
    //                 }
    //             ]),
    //             label: {
    //                 show: false
    //             },
    //             labelLine: {
    //                 show: false
    //             }
    //         }
    //     },
    //     hoverAnimation: false,
    //     center: [1 * 34 + 15.5 + '%', '45%'],
    //     data: [
    //         {
    //             value: pieData[1].value,
    //             label: {
    //                 normal: {
    //                     formatter: function (params) {
    //                         return params.value
    //                     },
    //                     position: 'center',
    //                     show: true,
    //                     textStyle: {
    //                         fontSize: '25',
    //                         // fontWeight: 'bold',
    //                         color: '#1cc7ff'
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             value: pieData[0].value - pieData[1].value,
    //             name: 'invisible',
    //             itemStyle: {
    //                 normal: {
    //                     color: 'rgba(0,0,0,0)'
    //                 },
    //                 emphasis: {
    //                     color: 'rgba(0,0,0,0)'
    //                 }
    //             }
    //         }
    //     ]
    // },
    // {
    //     name: pieData[2].name,
    //     type: 'pie',
    //     clockWise: false,
    //     radius: ['28%', '33%'],
    //     itemStyle: {
    //         normal: {
    //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //                 {
    //                     offset: 0,
    //                     color: '#0ff'
    //                 },
    //                 {
    //                     offset: 1,
    //                     color: '#5467df'
    //                 }
    //             ]),
    //             label: {
    //                 show: false
    //             },
    //             labelLine: {
    //                 show: false
    //             }
    //         }
    //     },
    //     hoverAnimation: false,
    //     center: [2 * 34 + 15.5 + '%', '45%'],
    //     data: [
    //         {
    //             value: pieData[2].value,
    //             label: {
    //                 normal: {
    //                     formatter: function (params) {
    //                         return params.value + '%'
    //                     },
    //                     position: 'center',
    //                     show: true,
    //                     textStyle: {
    //                         fontSize: '25',
    //                         // fontWeight: 'bold',
    //                         color: '#1cc7ff'
    //                     }
    //                 }
    //             }
    //         },
    //         {
    //             value: 100 - pieData[2].value,
    //             name: 'invisible',
    //             itemStyle: {
    //                 normal: {
    //                     color: 'rgba(0,0,0,0)'
    //                 },
    //                 emphasis: {
    //                     color: 'rgba(0,0,0,0)'
    //                 }
    //             }
    //         }
    //     ]
    // }
)

const centerImg = require('@/assets/agriculture/zu_3204@2x2.png')
const bfCenterImg = require('@/assets/agriculture/FullCircleCopy.png')

export const pieChartProcess = {
    grid: {
        left: '5%',
        right: '2%',
        bottom: '0%',
        top: '0%',
        containLabel: true
    },
    graphic: [
        {
            type: 'image',
            id: 'logo',
            left: '20%', //调整图片位置
            top: '20%', //调整图片位置
            z: -10,
            bounding: 'raw',
            rotation: 0, //旋转
            origin: [40, 4], //中心点
            scale: [1.0, 1.0], //缩放
            //设置图片样式
            style: {
                image: centerImg,
                width: 65,
                height: 65,
                opacity: 1
            }
        }
    ],
    // backgroundColor: 'black',
    title: titleArr,
    series: seriesArr
}

function dotArr() {
    let dataArr = []
    // for (var i = 0; i < 80; i++) {
    //     if (i % 2 === 0) {
    //         dataArr.push({
    //             name: (i + 1).toString(),
    //             value: 1,
    //             itemStyle: {
    //                 normal: {
    //                     color: '#676a6c',
    //                     borderWidth: 1,
    //                     borderColor: '#676a6c'
    //                 }
    //             }
    //         })
    //     } else {
    //         dataArr.push({
    //             name: (i + 1).toString(),
    //             value: 2,
    //             itemStyle: {
    //                 normal: {
    //                     color: 'rgba(0,0,0,0)',
    //                     borderWidth: 0,
    //                     borderColor: 'rgba(0,0,0,0)',
    //                     backgroundColor: 'red'
    //                 }
    //             }
    //         })
    //     }
    // }
    return dataArr
}

export const getProcessOptions = {
    title: [
        {
            text: 60 + '亩',
            x: 'center',
            // y: 'center',
            top: '36%',
            textStyle: {
                color: '#000',
                fontSize: 14,
                fontWeight: '500'
            }
        }
    ],
    // backgroundColor: '#111',

    graphic: [
        {
            type: 'image',
            id: 'logo',
            left: '20%', //调整图片位置
            top: '20%', //调整图片位置
            z: -10,
            bounding: 'all',
            rotation: 0, //旋转
            origin: [40, 4], //中心点
            scale: [1.0, 1.0], //缩放
            //设置图片样式
            style: {
                image: centerImg,
                width: 49,
                height: 49,
                opacity: 1
            }
        }
    ],
    polar: {
        radius: ['75%', '97%'],
        center: ['50%', '50%']
    },
    angleAxis: {
        max: 100,
        show: false
    },
    radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        }
    },
    series: [
        {
            name: '',
            type: 'bar',
            data: [60],
            showBackground: true,
            roundCap: true,
            coordinateSystem: 'polar',
            barWidth: 200,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                            offset: 0,
                            color: '#89F7FE'
                        },
                        {
                            offset: 1,
                            color: '#66A6FF'
                        }
                    ])
                }
            }
        },
        {
            name: '',
            type: 'pie',
            startAngle: 80,
            radius: '75%',
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
                color: 'rgba(66, 66, 66, .1)',
                borderWidth: 1,
                borderColor: '#1A335C'
            },
            data: [100]
        },
        {
            name: '',
            type: 'pie',
            startAngle: 80,
            radius: ['68%'],
            hoverAnimation: false,
            center: ['50%', '50%'],
            itemStyle: {
                color: 'rgba(66, 66, 66, .1)',
                borderWidth: 1,
                borderColor: '#1A335C'
            },
            data: [100]
        }
    ]
}

// 横向柱状图
export const kqrangeEchartsOption = {
    grid: {
        top: 6,
        right: 50,
        bottom: 25,
        left: 50
    },

    yAxis: {
        type: 'category',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'Source Han Sans CN'
            // interval: 0 // 显示所有X轴信息
        },
        data: ['正常', '异常']
    },
    xAxis: [
        {
            show: false,
            type: 'value',
            splitLine: {
                show: false
            },

            axisLine: {
                show: false
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                textStyle: {
                    color: '#ADD6FF'
                }
            }
        }
    ],
    series: [
        {
            name: 'a',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    borderRadius: 30,
                    color: function (params) {
                        return {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgb(5,27,56)' // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: colorList[params.dataIndex] // 100% 处的颜色
                                }
                            ]
                        }
                    }
                }
            },
            data: [75, 50],
            z: 0,
            zlevel: 0,

            label: {
                normal: {
                    show: true, // 是否显示进度条上方的百分比
                    formatter: data => {
                        return data.value + '人'
                    },
                    position: 'right',
                    textStyle: {
                        color: '#ffffff', // 进度条上方百分比字体颜色
                        fontSize: 14
                    },
                    offset: [20, 2]
                }
            }
        }
    ]
}

// 3D 饼状图
const optionsData = [
    {
        name: '未报账金额',
        value: 200,
        itemStyle: {
            color: '#85EDFE'
        }
    },
    {
        name: '已报账金额',
        value: 50,
        itemStyle: {
            color: '#FBAD7E'
        }
    }
]

// 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
    // 计算
    let midRatio = (startRatio + endRatio) / 2

    let startRadian = startRatio * Math.PI * 2
    let endRadian = endRatio * Math.PI * 2
    let midRadian = midRatio * Math.PI * 2

    // 如果只有一个扇形，则不实现选中效果。
    // if (startRatio === 0 && endRatio === 1) {
    //     isSelected = false;
    // }
    isSelected = false
    // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
    k = typeof k !== 'undefined' ? k : 1 / 3

    // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
    let offsetX = isSelected ? Math.sin(midRadian) * 0.1 : 0
    let offsetY = isSelected ? Math.cos(midRadian) * 0.1 : 0

    // 计算高亮效果的放大比例（未高亮，则比例为 1）
    let hoverRate = isHovered ? 1.05 : 1

    // 返回曲面参数方程
    return {
        u: {
            min: -Math.PI,
            max: Math.PI * 3,
            step: Math.PI / 32
        },

        v: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
        },

        x: function (u, v) {
            if (u < startRadian) {
                return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            if (u > endRadian) {
                return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
        },

        y: function (u, v) {
            if (u < startRadian) {
                return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            if (u > endRadian) {
                return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
            }
            return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
        },

        z: function (u, v) {
            if (u < -Math.PI * 0.5) {
                return Math.sin(u)
            }
            if (u > Math.PI * 2.5) {
                return Math.sin(u) * h * 0.1
            }
            // 两圈
            return Math.sin(v) > 0 ? 1 * h * 0.1 : -3
        }
    }
}

// 生成模拟 3D 饼图的配置项
export function getPie3D(pieData, internalDiameterRatio) {
    let series = []
    let sumValue = 0
    let startValue = 0
    let endValue = 0
    let legendData = []
    let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3

    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value

        let seriesItem = {
            name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
            type: 'surface',
            parametric: true,
            wireframe: {
                show: false
            },
            pieData: pieData[i],
            pieStatus: {
                selected: false,
                hovered: false,
                k: 1 / 10
            }
        }

        if (typeof pieData[i].itemStyle != 'undefined') {
            let itemStyle = {}

            typeof pieData[i].itemStyle.color != 'undefined' ? (itemStyle.color = pieData[i].itemStyle.color) : null
            typeof pieData[i].itemStyle.opacity != 'undefined' ? (itemStyle.opacity = pieData[i].itemStyle.opacity) : null

            seriesItem.itemStyle = itemStyle
        }
        series.push(seriesItem)
    }

    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value

        series[i].pieData.startRatio = startValue / sumValue
        series[i].pieData.endRatio = endValue / sumValue
        //修改饼高度  series[i].pieData.value 目前逻辑是根据value值定高度，后期可改如将最后一项改成 series[i].pieData.value === series[0].pieData.value ? 100 : 10
        // series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value)
        series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, series[i].pieData.value <= 300 ? 140 : 60)

        startValue = endValue

        legendData.push(series[i].name)
    }

    return series
}

const series = getPie3D(optionsData, 0.8)


series.push({
    name: 'pie2d',
    type: 'pie',
    startAngle: 2, //起始角度，支持范围[0, 360]。
    clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    radius: ['40%', '60%'],
    center: ['50%', '50%'],
    data: optionsData,
    itemStyle: {
        opacity: 0
    },
    labelLine: {
        show: false
    },
    label: {
        show: false,
        position: 'center'
    }
})
// 准备待返回的配置项，把准备好的 legendData、series 传入。
export const pieOptionOf3D = {
    legend: {
        show: true,

        orient: 'horizontal',
        data: ['未报账金额', '已报账金额'],
        itemGap: 10,
        itemHeight: 6,
        itemWidth: 12,
        left: '0',
        top: '50%',
        textStyle: {
            color: '#fff',
            fontSize: 12,
            rich: {
                name: {
                    // width: 60,
                    fontSize: 12,
                    color: '#fff',
                    fontFamily: 'Source Han Sans CN'
                }
            }
        }
    },
    animation: true,
    tooltip: {
        trigger: 'none', // 后加

        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(0,0,0,0.1)',
        textStyle: {
            color: '#fff',
            fontSize: 12
        },
        formatter: params => {
            // if (params.seriesName !== 'mouseoutSeries' && params.seriesName !== 'pie2d') {
            //     return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${
            //         option.series[params.seriesIndex].pieData.value + '万人'
            //     }`
            // }
            return `${params.seriesName}<br/><span style="display:inline-block;margin-left:10px;">${pieOptionOf3D.series[params.seriesIndex].pieData.value}</span>万人`
        }
    },
    // backgroundColor: '#092B35',
    labelLine: {
        show: true,
        lineStyle: {
            color: '#7BC0CB'
        },
        normal: {
            show: true,
            length: 10,
            length2: 10
        }
    },
    label: {
        show: true,
        position: 'outside',
        formatter: '{b} \n{c}\n{d}%',
        textStyle: {
            color: 'rgba(176, 216, 223, 1)',
            fontSize: 24
        }
    },
    xAxis3D: {
        min: -1,
        max: 1
    },
    yAxis3D: {
        min: -1,
        max: 1
    },
    zAxis3D: {
        min: -1,
        max: 1
    },
    grid3D: {
        show: false,
        boxHeight: 1,
        left: '45%',
        top: '-18',
        width: '60%',
        // environment: "rgba(255,255,255,0)",
        viewControl: {
            distance: 110, // 放大缩小比例
            alpha: 28,
            beta: 18,
            autoRotate: false, // 自动旋转
            // rotateSensitivity: 1,
            zoomSensitivity: 0,
            // panSensitivity: 1,
        }
    },
    series: series
}


// 计划总进度
export const jhzjdEcharts = {
    // backgroundColor: '#001037',
    grid: {
        top: 6,
        right: 25,
        bottom: 25,
        left: 100
    },
    yAxis: {
        type: 'category',
        axisLine: {
            show: false,
            lineStyle: {
                color: 'rgba(255, 210, 162, 0.1)'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Source Han Sans CN'
        },
        data: []
    },
    xAxis: [
        {
            show: false,
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 210, 162, 0.1)'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                textStyle: {
                    color: '#ADD6FF'
                }
            }
        }
    ],
    series: [
        {
            name: 'a',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgb(5,27,56)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgb(36,188,255)' // 100% 处的颜色
                            }
                        ]
                    }
                }
            },
            data: [15],
            z: 1,
        },
        {
            type: 'pictorialBar',
            itemStyle: {
                normal: {
                    color: '#081633'
                }
            },
            symbolRepeat: 11,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [4, 20],
            symbolPosition: 'start',
            symbolOffset: [0, -10],
            data: [100],
            z: 2,
        },
        {
            name: 'b',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0,0,0,0)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,0,0,0)' // 0% 处的颜色
                            }
                        ]
                    },
                }
            },
            data: [15],
            z: 3,
            label: {
                normal: {
                    show: true, // 是否显示进度条上方的百分比
                    formatter: data => {
                        return data.value + '%'
                    },
                    position: 'right',
                    textStyle: {
                        color: '#ffffff', // 进度条上方百分比字体颜色
                        fontSize: 20
                    },
                    offset: [20, -15]
                }
            }
        },
    ]
}
// 实际总进度
export const sjzjdEcharts = {
    // backgroundColor: '#001037',
    grid: {
        top: 6,
        right: 25,
        bottom: 25,
        left: 100
    },
    yAxis: {
        type: 'category',
        axisLine: {
            show: false,
            lineStyle: {
                color: 'rgba(255, 210, 162, 0.1)'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Source Han Sans CN'
        },
        data: []
    },
    xAxis: [
        {
            show: false,
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255, 210, 162, 0.1)'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                textStyle: {
                    color: '#ADD6FF'
                }
            }
        }
    ],
    series: [
        {
            name: 'a',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgb(5,27,56)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgb(36,188,255)' // 100% 处的颜色
                            }
                        ]
                    }
                }
            },
            data: [15],
            z: 1,
        },
        {
            type: 'pictorialBar',
            itemStyle: {
                normal: {
                    color: '#081633'
                }
            },
            symbolRepeat: 11,
            symbol: 'rect',
            symbolClip: true,
            symbolSize: [4, 20],
            symbolPosition: 'start',
            symbolOffset: [0, -10],
            data: [100],
            z: 2,
        },
        {
            name: 'b',
            type: 'bar',
            barWidth: 14,
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0,0,0,0)' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,0,0,0)' // 0% 处的颜色
                            }
                        ]
                    },
                }
            },
            data: [15],
            z: 3,
            label: {
                normal: {
                    show: true, // 是否显示进度条上方的百分比
                    formatter: data => {
                        return data.value + '%'
                    },
                    position: 'right',
                    textStyle: {
                        color: '#ffffff', // 进度条上方百分比字体颜色
                        fontSize: 20
                    },
                    offset: [20, -15]
                }
            }
        },
    ]
}

