<template>
  <div class="flex justify-between items-center p-2 border-b-2">
    <div class="nav-icon" :class="{ hide: !isMenuHidden }" @click="toggleMenu">
      <span />
      <span />
      <span />
      <span />
    </div>
    <div class="flex">
      <span> {{ displayName }}</span>
      <div class="ml-2 cursor-pointer" @click="logout($route)">
        <span> {{ $t('head.exit') }}</span>
        <img src="~/assets/img/exit.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isMenuHidden', 'authUser', 'displayName'])
  },
  methods: {
    ...mapActions(['toggleMenu', 'logout'])
  }
}
</script>

<style lang="scss" scoped></style>
