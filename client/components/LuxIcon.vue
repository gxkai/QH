<template>
  <i :class="classes" :style="styles" @click="$emit('click')"></i>
</template>
<script>
export default {
  name: 'LuxIcon',
  props: {
    type: {
      default: '',
      type: String
    },
    size: {
      default: 1,
      type: [Number, String]
    },
    color: {
      default: '',
      type: String
    },
    fontStyle: {
      default: 'normal',
      type: String
    }
  },
  computed: {
    classes() {
      return `iconfont icon-${this.type}`
    },
    styles() {
      let style = {}
      style['font-style'] = `normal`
      if (this.size) {
        style['font-size'] = `${this.size}rem`
      }
      if (this.fontStyle) {
        style['font-style'] = this.fontStyle
      }
      if (this.color) {
        style.color = this.color
      }
      return style
    }
  }
}
</script>
