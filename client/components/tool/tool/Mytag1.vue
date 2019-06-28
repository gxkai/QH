<template>
  <lux-icon :type="value"></lux-icon>
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
    return {}
  },
  watch: {},
  methods: {}
}
</script>
