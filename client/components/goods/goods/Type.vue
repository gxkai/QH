<template>
  <el-select v-model="value1" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item"
      :label="$t(item)"
      :value="item"
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
      options: [
        'GOODS_RAW',
        'GOODS_CONSUMABLE',
        'GOODS_SEMI-FINISHED',
        'GOODS_FINISHED'
      ],
      value1: ''
    }
  },
  watch: {
    value1() {
      this.$emit('input', this.value1)
    }
  },
  async created() {
    this.value1 = this.value
  },
  methods: {}
}
</script>
