<template>
  <div class="sidebar-container">
    <div
      class="flex items-center justify-between text-2xl  pl-4 pr-2 sidebar-header"
    >
      <div style="color: gray" class="truncate">
        {{ $t(`side.name`) }}
      </div>
      <div
        class="nav-icon open"
        :class="{ hide: isMenuHidden }"
        @click="toggleMenu"
      >
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
    <el-menu
      router
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :default-active="$route.path"
    >
      <sidebar-item v-for="menu in menus" :key="menu.id" :item="menu" />
    </el-menu>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters(['isMenuHidden']),
    ...mapGetters('menu', ['menus'])
  },
  async beforeMount() {
    const { data: menus } = await this.$axios.get('/api/v1/auth/menus')
    console.log(menus)
    if (Array.isArray(menus) && menus.length) {
      this.$store.dispatch('menu/addAll', this.translateMenus(menus))
    }
  },
  methods: {
    translateMenus(menus) {
      return menus.map(menu => {
        const subMenus = menu.children
        if (Array.isArray(subMenus) && subMenus.length) {
          this.translateMenus(subMenus)
        }
        menu.name = this.$t(menu.name || '')
        return menu
      })
    },
    ...mapActions(['toggleMenu'])
  }
}
</script>
<style lang="scss" scoped>
.sidebar-header {
  background-color: rgb(48, 65, 86);
}
.sidebar-container {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgb(48, 65, 86);
  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }
  .is-horizontal {
    display: none;
  }
  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }
}
</style>
