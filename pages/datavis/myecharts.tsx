// import type { NextPage } from 'next'
import * as _ from "lodash"
import { useState } from 'react'

import * as echarts from 'echarts/core';
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  GraphSeriesOption,
  LineChart,
  LineSeriesOption
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  GridComponent,
  GridComponentOption,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';
// import data from './data/les-miserables.json'
import data from './data/agriculture.json'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | GridComponentOption
  | GraphSeriesOption
>;

// var option: ECOption = {
//   title: {
//     text: 'ECharts 入门示例'
//   },
//   tooltip: {},
//   xAxis: {
//     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
//   },
//   yAxis: {},
//   series: [
//     {
//       name: '销量',
//       type: 'bar',
//       data: [5, 20, 36, 10, 10, 20]
//     }
//   ]
// };


const myecharts = ({graph}: any) => {

  // const [option, setOption] = useState()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [type, setType] = useState<"circular" | "none" | "force" | undefined>("circular")

  graph?.nodes?.forEach((node: { label: { show: boolean; }; symbolSize: number; }) => {
    // node.symbolSize = 5;
    node.label = {
        show: node.symbolSize > 10
    }})
  // console.log("🚀 ~ file: myecharts.tsx ~ line 78 ~ useEffect ~ graph", graph)
  
  // 给定一个已有的“数据集”（dataset）和一个“转换方法”（transform），echarts 能生成一个新的“数据集”
  // 如：数据过滤（filter）、排序（sort）、聚合（aggregate）、直方图（histogram）、简单聚类（clustering）、回归线计算（regression）等。
  const option:ECOption = {
    title: {
        text: '广州周边生态种植数字维基P1\n',
        subtext: '(P1-关系图、P2-地理图、P3-内容聚合、P4-农产时节、P5-课程活动)\n\n',
        // top: 'bottom',
        left: 'center'
    },
    tooltip: {},
    legend: [{
        // orient: 'vertical',
        // left: 'right',
        top: 'bottom',
        // selectedMode: 'single',
        data: graph?.categories?.map((a) => {
            return a.name;
        })
    }],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    toolbox: {
      show: true,
      feature: {
          // dataZoom: {
          //     yAxisIndex: 'none'
          // },
          // dataView: {readOnly: false},
          // magicType: {type: ['graph', 'bar', 'line']},
          myTool1: {
            show: true,
            title: '切换视图',
            icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
            onclick: ( m, c )=>{
                if(type === 'circular')
                  setType("force")
                else
                  setType("circular")
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
            data: _.shuffle(graph?.nodes),
            links: graph?.links,
            categories: graph?.categories,
            roam: 'scale',
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
                // 高亮时点的颜色。
                // color: 'blue',
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
            // 动画效果，支持标签数值文本的插值动画，图形的形变（morph）、分裂（separate）、合并（combine）等效果的过渡动画。
            // animation: false,
            draggable: true,
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
    ]
  } 

  return (
    <div className="w-screen h-screen p-8 m-auto bg-gray-200">
      <ReactECharts
        // style={{width:960, height:600}}
        option={option}
        notMerge={true}
        lazyUpdate={true}
        // theme={"theme_name"}
        // onChartReady={this.onChartReadyCallback}
        // onEvents={EventsDict}
        opts={{renderer: 'svg', width:'auto', height: 1024}}
        />
    </div>
  )
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  const graph = data
  return {
    props: {
      graph,
    },
  }
}

export default myecharts