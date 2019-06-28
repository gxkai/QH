<template>
  <div>
    <el-select
      v-model="value1"
      placeholder="请选择产品"
      filterable
      @change="getSpecs"
    >
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-select v-model="value2" placeholder="请选择产品规格">
      <el-option
        v-for="v in goodsSpecs"
        :key="v._id"
        :label="v.name"
        :value="v._id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Object],
      require: false,
      default: ''
    }
  },
  data() {
    return {
      options: [],
      goodsSpecs: [],
      value1: '',
      value2: ''
    }
  },
  watch: {
    value2() {
      this.$emit('input', this.value2)
    }
  },
  async created() {
    const result = await this.$axios.$get('/api/v1/goods', {
      params: { pageSize: 9999 }
    })
    this.options = result.data
    console.log(this.value)
    if (this.value) {
      this.value1 = this.value.goods._id
      this.value2 = this.value._id
      if (this.value1) {
        const result = await this.$axios.$get('/api/v1/goodsSpec', {
          params: { pageSize: 9999, goods: this.value1 }
        })
        this.goodsSpecs = result.data
        console.log('6666666', this.goodsSpecs)
      }
    }
  },
  methods: {
    async getSpecs() {
      this.value2 = ''
      const result = await this.$axios.$get('/api/v1/goodsSpec', {
        params: { pageSize: 9999, goods: this.value1 }
      })
      this.goodsSpecs = result.data
    }
  }
}
</script>
