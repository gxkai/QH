<template>
  <el-input-number
    v-model="num"
    controls-position="right"
    @change="handleChange"
    :min="1"
    :max="10"
  ></el-input-number>
</template>
<script>
export default {
  props: {
    value: {
      type: [Number],
      require: false,
      default: 1
    }
  },
  data() {
    return {
      num: 1
    }
  },
  created() {
    this.num = this.value
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>
