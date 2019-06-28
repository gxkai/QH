<template>
  <div style="cursor: pointer">
    <el-tag :type="type" @click.native="handleClick">{{ text }}</el-tag>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      value1: this.value
    }
  },
  computed: {
    type() {
      return this.value1 ? 'success' : 'danger'
    },
    text() {
      return this.value1 ? '是' : '否'
    }
  },
  mounted() {},
  methods: {
    handleClick() {
      this.value1 = !this.value1
      this.$emit('input', !this.value1)
    }
  }
}
</script>
