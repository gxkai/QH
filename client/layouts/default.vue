<template>
  <div class="flex w-full h-screen app">
    <div
      class="h-full"
      :class="[
        { hide: isMenuHidden, navCol: true },
        isMenuHidden ? 'w-0' : 'w-1/6'
      ]"
    >
      <sidebar />
    </div>
    <div
      class="flex-col content h-screen overflow-y-scroll relative"
      :class="[isMenuHidden ? 'w-full' : 'w-5/6']"
    >
      <div>
        <headbar />
        <el-page-header
          class="py-4 px-2"
          @back="$router.go(-1)"
          :content="$t($route.name) || $t('index')"
        >
        </el-page-header>
      </div>
      <div>
        <div class="p-2">
          <nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sidebar from '@/components/Sidebar/Sidebar'
import Headbar from '@/components/Headbar'
const io = require('socket.io-client')

export default {
  // middleware: 'auth',
  components: {
    Sidebar,
    Headbar
  },
  data() {
    return {
      socket: ''
    }
  },
  computed: {
    ...mapGetters(['isMenuHidden', 'LoginID'])
  },
  mounted() {
    // this.initSocket()
  },
  methods: {
    initSocket() {
      console.log(process.env.HTTP_URL, process.env.HTTP_PORT)
      this.socket = io(
        `http://${process.env.HTTP_URL}:${process.env.HTTP_PORT}/chat?roomId=1`
      )
      this.socket.on('news', data => {
        console.log(222222222)
        console.log(data)
      })
      this.socket.emit('message', { my: 'data' })
      console.log(`LoginID: ${this.LoginID}`)
      this.socket.on(this.LoginID, data => {
        console.log(data)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.app {
  .navCol {
    transition: width 0.5s, opacity 0.15s ease-out;
  }
  .hide {
    transition: width 0.5s, opacity 2s ease-in;
  }
  .content {
    transition: width 0.5s, opacity 0.5s ease-in;
  }
}
</style>
