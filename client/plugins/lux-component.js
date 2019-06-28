import Vue from 'vue'
import LuxIcon from '@/components/LuxIcon'
import LuxNode from '@/components/LuxNode'
import LuxDragList from '@/components/LuxDragList'
import GoodsSpec from '@/components/inventory/inventory/GoodsSpec'
import CheckGoods from '@/components/tool/CheckGoods'

export default () => {
  Vue.component(`lux-icon`, LuxIcon)
  Vue.component(`lux-node`, LuxNode)
  Vue.component(`lux-drag-list`, LuxDragList)
  Vue.component(`GoodsSpec`, GoodsSpec)
  Vue.component(`CheckGoods`, CheckGoods)
}
