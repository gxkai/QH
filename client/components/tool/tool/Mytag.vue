<template>
  <!--<div style="cursor: pointer">
    <el-tag :type="type" @click.native="handleClick">{{ text }}</el-tag>
  </div>-->
  <div>
    <lux-icon class="icon" :type="value1"></lux-icon>
    <ul class="iconList">
      <li @click="selectIcon(index)" v-for="(item, index) in options">
        <lux-icon class="list" :type="item"></lux-icon>
      </li>
    </ul>
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
      value1: ''
    }
  },
  watch: {},
  async created() {
    const result = await this.$axios.$get('/api/v1/icon')
    this.options = result
    this.value1 = this.value
  },
  methods: {
    selectIcon(index) {
      this.value1 = this.options[index]
      this.$emit('input', this.value1)
    }
  }
}
</script>
<style>
.iconList {
  list-style: none;
  padding: 0;
}
.iconList li {
  width: 24px;
  height: 24px;
  line-height: 24px;
  display: inline-block;
  margin-right: 10px;
  font-size: 1.2rem !important;
}
.icon {
  color: #3b99fc;
  cursor: pointer;
}
.icon:hover {
  color: #3b99fc;
}
.iconList li .list {
  cursor: pointer;
  padding: 0;
}
.iconList li .list:hover {
  color: #3b99fc;
}
</style>
