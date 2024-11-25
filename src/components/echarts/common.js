// 通用的 echarts 模块
import * as echarts from 'echarts/core'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent
} from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
  CanvasRenderer
} from 'echarts/renderers'

// 注册必须的组件
echarts.use(
  [ToolboxComponent, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer, LegendComponent, DatasetComponent]
)

export default echarts
