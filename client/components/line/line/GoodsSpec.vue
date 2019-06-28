<template>
  <div>
    <el-select v-model="value1" placeholder="请选择物料" @change="change">
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-select v-model="value2" placeholder="请选择规格">
      <el-option
        v-for="v in options2"
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
      options2: [],
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
    if (this.value) {
      this.value1 = this.value.goods._id
      this.value2 = this.value._id
    }
    if (this.value1) {
      const result = await this.$axios.$get('/api/v1/goodsSpec', {
        params: { pageSize: 9999, goods: this.value1 }
      })
      this.options2 = result.data
    }
  },
  methods: {
    async change() {
      this.value2 = ''
      const result = await this.$axios.$get('/api/v1/goodsSpec', {
        params: { pageSize: 9999, goods: this.value1 }
      })
      console.log('222222', result.data)
      this.options2 = result.data
    }
  }
}
</script>
