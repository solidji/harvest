import * as _ from "lodash"
import { useState } from 'react'

import * as echarts from 'echarts/core';
import {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  GraphSeriesOption,
  LineSeriesOption
} from 'echarts/charts';
import {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  GridComponentOption,
} from 'echarts/components';
import ReactECharts from 'echarts-for-react';
import data from './data/agriculture.json'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | GraphSeriesOption
>

const myecharts = ({graph}: any) => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [type, setType] = useState<"circular" | "none" | "force" | undefined>("circular")
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [order, setOrder] = useState<boolean | undefined>(true)

  graph?.nodes?.forEach((node: { label: { show: boolean; }, id: string, symbolSize: number; }) => {
    // node.symbolSize = 5;
    const r = _.filter(graph?.links, (l) => {
      return node.id === l.source || node.id === l.target 
    })
    node.symbolSize = (r.length+3)*5
    node.label = {
        show: node.symbolSize > 15
    }})

  const nodesSmall = _.cloneDeep(graph?.nodes)
  nodesSmall?.forEach((node: { label: { show: boolean; }, id: string, symbolSize: number; }) => {
    const r = _.filter(graph?.links, (l) => {
      return node.id === l.source || node.id === l.target 
    })
    node.symbolSize = (r.length+2)*3
    node.label = {
        show: node.symbolSize > 9
    }})

  // 给定一个已有的“数据集”（dataset）和一个“转换方法”（transform），echarts 能生成一个新的“数据集”
  // 如：数据过滤（filter）、排序（sort）、聚合（aggregate）、直方图（histogram）、简单聚类（clustering）、回归线计算（regression）等。
  const option:ECOption = {
    title: {
        text: '广州周边生态种植数字地图P1\n',
        subtext: '(施工中：P1-关系图、P2-地理图、P3-内容聚合、P4-农产时节、P5-课程活动)\n\n',
        left: 'center',
        subtextStyle: {
          color: 'blue',
          overflow: 'break',
          width: 350
        }
    },
    tooltip: {
      confine: true,
      // position: ['50%', '50%'],
      textStyle: {
        overflow: 'breakAll',
        // width: 100
      }
    },
    legend: [{
        // orient: 'vertical',
        bottom: 16,
        data: graph?.categories?.map((a) => {
            return a.name;
        })
    }],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    toolbox: {
      show: true,
      bottom: 64,
      left: 'center',
      itemSize: 30,
      itemGap: 20,
      feature: {
          myTool1: {
            show: true,
            title: '切换视图',
            icon: 'image:///switch.svg',
            onclick: ( m, c )=>{
                if(type === 'circular')
                  setType("force")
                else
                  setType("circular")
            }
        },
        myTool2: {
            show: true,
            title: '切换排序',
            icon: 'image:///sort.svg',
            onclick: ( m, c )=>{
                setOrder(!order)
            }
        },
          restore: {},
          saveAsImage: {}
      }
    },
    series: [
        {
            name: '丰年庆',
            type: 'graph',
            layout: type,
            legendHoverLink: false,
            left: 'center',
            top: 'center',
            width: '85%',
            height: '85%',
            data: order ? _.shuffle(nodesSmall): nodesSmall,
            links: graph?.links,
            categories: graph?.categories,
            // roam: true,
            label: {
                position: 'right',
                formatter: '{b}'
            },
            labelLayout: {
              hideOverlap: true
            },
            // ECharts 的 option 中，很多地方可以设置 itemStyle、lineStyle、areaStyle、label 等等。
            // 这些的地方可以直接设置图形元素的颜色、线宽、点的大小、标签的文字、标签的样式等等。
            lineStyle: {
                color: 'source',
                curveness: 0.3,
                width: 1.25
            },
            // 高亮（emphasis）和普通（normal）两个交互的状态，在鼠标移到图形上的时候会进入高亮状态以区分该数据
            // 开发者可以分别设置这两个状态的颜色，阴影等样式。
            // 通过淡出非相关元素来观察数据之间的联系。
            // 而且颜色，阴影等在高亮（emphasis）中可以设置的样式，现在也可以在淡出（blur）状态中设置了
            emphasis: {
              scale: true,
              focus: 'adjacency',
              lineStyle: {
                width: 10
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              // label: {
              //   show: true,
              //   // 高亮时标签的文字。
              //   formatter: 'This is a emphasis label.'
              // }        
            }, 
            force: {
              repulsion: 150,
              edgeLength: 30,
              gravity: 0.1
            },
            draggable: true,
            // 动画效果，支持标签数值文本的插值动画，图形的形变（morph）、分裂（separate）、合并（combine）等效果的过渡动画。
            // animation: false,
            // 为所有系列还添加了点击选中这个之前只有在饼图、地图等少数系列中才能开启的交互
            // 开发者可以设置为单选或多选模式，并且通过监听 selectchanged 事件获取到选中的所有图形然后进行更进一步的处理。
            // 与高亮和淡出一样，选中的样式也可以在 select 中配置。
            // select: {
              // label?: SeriesLabelOption | undefined;
              // edgeLabel?: SeriesLabelOption | undefined;
              // itemStyle?: ItemStyleOption | undefined;
              // lineStyle?: LineStyleOption<...> | undefined;
            // }
        }
    ],
    media: [
      // 这里定义了 media query 的逐条规则。
      {
        query: {
          minWidth: 660, // 768 iPhone6 iPhoneX横
          // maxHeight: 300,
          minAspectRatio: 1.3 // 长宽比大于1.3时，横屏
        },
        option: {
          title: {
            left: 32,
            top: 16,
            subtextStyle: {
              color: 'red',
              overflow: 'break',
              width: 150
            },
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            bottom: 'center',
            right: 32,
            itemSize: 20,
            itemGap: 20
          },
          legend: {
            orient: 'vertical',
            bottom: 64,
            left: 32
          },
          series: [
            {
              left: 'center',
              top: 'center',
              width: '85%',
              height: '85%',
            }
          ]
        }
      },
      {
        query: {
          minWidth: 700, // 1024 iPad竖
          // maxHeight: 300,
          maxAspectRatio: 1.3 // 长宽比小于1.3时，竖屏
        },
        option: {
          title: {
            top: 32,
            left: 'center',
            subtextStyle: {
              color: 'green',
              overflow: 'break',
              width: 900
            },
          },
          toolbox: {
            show: true,
            orient: 'horizontal',
            top: '10%',
            right: 32,
            itemSize: 25,
            itemGap: 20
          },
          legend: {
            orient: 'horizontal',
            bottom: 80,
            left: 'center'
          },
          series: [
            {
              left: 'center',
              top: 'center',
              width: '85%',
              height: '85%',
              roam: true,
              data: order ? _.shuffle(graph?.nodes): graph?.nodes,
            }
          ]
        }
      },
      {
        query: {
          minWidth: 1024, // 1024 iPad横 iPad Pro - PC
          // maxHeight: 300,
          // minAspectRatio: 1.3 // 默认横屏
        },
        option: {
          title: {
            top: 32,
            left: 'center',
            subtextStyle: {
              color: 'purple',
              overflow: 'break',
              width: 900
            },
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 64,
            right: 64,
            itemSize: 30,
            itemGap: 20
          },
          legend: {
            orient: 'vertical',
            top: 64,
            left: 64
          },
          series: [
            {
              left: 'center',
              top: 'center',
              // width: '85%',
              height: '70%',
              roam: true,
              data: order ? _.shuffle(graph?.nodes): graph?.nodes,
            }
          ]
        }
      }]
  } 

  return (
    <div className="w-screen h-screen bg-white ">
      <div id="main" className="w-auto h-full p-0 pt-4 pb-16 m-auto sm:p-0">
        <ReactECharts
          // style={{width:"100%", height:"80%", padding:'0px', margin: 0}}
          style={{width:"100%", height:"100%", padding:'0px', margin: 0}}
          // className={"w-auto p-0 pt-4 md:p-8"}
          option={option}
          notMerge={true}
          lazyUpdate={true}
          // theme={"theme_name"}
          // onChartReady={this.onChartReadyCallback}
          // onEvents={EventsDict}
          opts={{renderer: 'svg'}}
          />
      </div>
    </div>
  )
}

export async function getStaticProps() {
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()
  const graph = data
  return {
    props: {
      graph,
    },
  }
}

export default myecharts