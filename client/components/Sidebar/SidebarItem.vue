<template>
  <el-submenu :index="item.path || item.name" v-if="item.children">
    <template slot="title">
      <i class="el-icon-menu"></i>
      {{ $t(item.name) }}
    </template>

    <template v-for="child in item.children">
      <sidebar-item
        v-if="child.children && child.children.length > 0"
        :key="child.id"
        :item="child"
      />
      <el-menu-item v-else :key="child.id" :index="child.path">
        <lux-icon type="yuandian" />
        {{ $t(child.name) }}
      </el-menu-item>
    </template>
  </el-submenu>
  <el-menu-item :index="item.path" v-else>
    <i class="el-icon-menu"></i>
    {{ $t(item.name) }}
  </el-menu-item>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
