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
    <el-select v-model="value2" placeholder="请选择工厂" @change="getWorkshop">
      <el-option
        v-for="v in factories"
        :key="v._id"
        :label="v.name"
        :value="v._id"
      >
      </el-option>
    </el-select>
    <el-select v-model="value3" placeholder="请选择车间">
      <el-option v-for="l in lines" :key="l._id" :label="l.name" :value="l._id">
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
      lines: [],
      value1: '',
      value2: '',
      value3: ''
    }
  },
  watch: {
    value3() {
      this.$emit('input', this.value3)
    },
    value(n) {
      this.value3 = n
    }
  },
  async created() {
    const result = await this.$axios.$get('/api/v1/company', {
      params: { pageSize: 9999 }
    })
    this.options = result.data
    if (this.value) {
      this.value1 = this.value.factory.company._id
      this.value2 = this.value.factory._id
      this.value3 = this.value._id
    }
    if (this.value1) {
      const result = await this.$axios.$get('/api/v1/factory', {
        params: { pageSize: 9999, company: this.value1 }
      })
      this.factories = result.data
      if (this.value2) {
        this.getWorkshop()
      }
    }
  },
  methods: {
    async getFactory() {
      this.value2 = ''
      this.value3 = ''
      const result = await this.$axios.$get('/api/v1/factory', {
        params: { pageSize: 9999, company: this.value1 }
      })
      this.factories = result.data
    },
    async getWorkshop() {
      const result = await this.$axios.$get('/api/v1/workshop', {
        params: { pageSize: 9999, factory: this.value2 }
      })
      this.lines = result.data
    }
  }
}
</script>
