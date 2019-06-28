<template>
  <div>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="data"
      @cell-data-change="handleCellDataChange"
    />
  </div>
</template>

<script>
import Check from '@/components/tool/Check'
export default {
  name: 'CheckGoods',
  props: {
    goodsSpec: {},
    value: {}
  },
  data() {
    return {
      columns: [
        {
          title: '是否卡控',
          key: 'check',
          component: {
            name: 'el-select',
            options: [
              {
                value: true,
                label: '是'
              },
              {
                value: false,
                label: '否'
              }
            ]
          }
        },
        {
          title: '产品',
          key: 'subGoodsSpec.goods.name'
        },
        {
          title: '规格',
          key: 'subGoodsSpec.name'
        },
        {
          title: '可分配数量',
          key: 'dosage'
        },
        {
          title: '卡控数量',
          key: 'number',
          component: {
            name: 'el-input-number',
            'controls-position': 'right',
            size: 'small',
            min: 0
          }
        }
      ],
      data: []
    }
  },
  async created() {
    this.getList()
  },
  mounted() {},
  methods: {
    handleCellDataChange({ rowIndex, key, value, row }) {
      console.log(rowIndex)
      console.log(key)
      console.log(value)
      console.log(row)
      console.log(row.dosage)
      this.columns[4].component.max = row.dosage
      this.$emit('input', this.$refs.d2Crud.d2CrudData)
    },
    async getList() {
      if (this.value) {
        this.data = this.value
      } else {
        const result = await this.$axios.$get(`/api/v1/goodsBom`, {
          pageSize: 9999,
          goodsSpec: this.goodsSpec
        })
        const { total, data } = result
        data.map(e => {
          e.number = 0
          e.check = false
        })
        this.data = data
      }
    }
  }
}
</script>

<style scoped></style>
