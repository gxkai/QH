<template>
  <el-select v-model="value1" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item._id"
      :label="item.name"
      :value="item._id"
    >
    </el-option>
  </el-select>
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
      value1: ''
    }
  },
  watch: {
    value1() {
      this.$emit('input', this.value1)
    }
  },
  async created() {
    const result = await this.$axios.$get('/api/v1/supplier', {
      params: { pageSize: 9999 }
    })
    this.options = result.data
    this.value1 = this.value._id
    console.log(this.value)
    console.log(this.options)
  },
  methods: {}
}
</script>
