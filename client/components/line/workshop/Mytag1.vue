<template>
  <div>
    <el-select v-model="value1" placeholder="请选择公司" @change="getFactory">
      <el-option
        v-for="item in options"
        :key="item._id"
        :label="item.name"
        :value="item._id"
      >
      </el-option>
    </el-select>
    <el-select v-model="value2" placeholder="请选择工厂">
      <el-option
        v-for="v in factories"
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
      factories: [],
      value1: '',
      value2: ''
    }
  },
  watch: {
    value2() {
      this.$emit('input', this.value2)
    },
    value(n) {
      this.value2 = n
    }
  },
  async created() {
    const result = await this.$axios.$get('/api/v1/company', {
      params: { pageSize: 9999 }
    })
    this.options = result.data
    if (this.value) {
      this.value1 = this.value.company._id
      this.value2 = this.value._id
    }
    if (this.value1) {
      const result = await this.$axios.$get('/api/v1/factory', {
        params: { pageSize: 9999, company: this.value1 }
      })
      this.factories = result.data
    }
  },
  methods: {
    async getFactory() {
      this.value2 = ''
      const result = await this.$axios.$get('/api/v1/factory', {
        params: { pageSize: 9999, company: this.value1 }
      })
      console.log('222222', result.data)
      this.factories = result.data
    }
  }
}
</script>
