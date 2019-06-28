<template>
  <div class="blocks">
    <div
      class="block"
      :class="item.showClass ? 'active' : ''"
      v-for="(item, index) in valueList"
      :data="item.sid"
      :key="index"
    >
      <div v-if="item.show">
        <div class="step">
          <span class="left">+</span>
          <input
            v-model="item.name"
            v-show="!item.showInput"
            @dblclick="dblclick($event, item)"
            @click="oneClick($event, item)"
            @keyup.enter="enter(item, item.sid)"
            @keydown.tab="tab(item)"
            @blur="blur(item)"
            @focus="insinte($event)"
            @keyup.delete="item.show = false"
          />
          <div class="show" v-show="item.showInput">
            {{ item.name }}{{ index }}
          </div>
          <span class="right">+</span>
        </div>
        <lux-chart
          v-if="item.children"
          :value-list="item.children"
          @addList="addList"
        ></lux-chart>
      </div>
    </div>
  </div>
</template>

<script>
import luxChart from '@/components/LuxFlow'
export default {
  name: 'LuxChart',
  components: {
    luxChart
  },
  props: {
    valueList: {}
  },
  data() {
    return {
      show: false
    }
  },
  watch: {},
  methods: {
    enter(item, sid) {
      item.children = [
        {
          id: 0,
          name: '开始',
          before: [
            {
              icon: '',
              uuid: '',
              name: ''
            }
          ],
          after: [
            {
              icon: '',
              uuid: '',
              name: ''
            }
          ],
          children: '',
          I: 1,
          show: true,
          sid: sid,
          showInput: false,
          showClass: false
        }
      ]
      item.showClass = !item.showClass
      console.log(this.valueList)
    },
    tab(n) {
      n.showClass = !n.showClass
      this.$emit('addList', n)
    },
    addList(item) {
      console.log('tab')
      console.log(this.valueList)
      console.log(item.sid)
      this.valueList[item.sid].children.push({
        id: 0,
        name: '开始',
        before: [
          {
            icon: '',
            uuid: '',
            name: ''
          }
        ],
        after: [
          {
            icon: '',
            uuid: '',
            name: ''
          }
        ],
        children: '',
        I: 1,
        show: true,
        sid: item.sid,
        showInput: false,
        showClass: false
      })
    },
    del(e, n) {
      console.log(e.currentTarget.parentNode.parentNode)
      let dom = e.currentTarget.parentNode.parentNode
      document.body.removeChild(dom)

      //   this.valueList = this.valueList.filter(t => t.id != id)
    },
    insinte(e) {
      // console.log(e.currentTarget);
    },
    blur(i) {},
    oneClick(e, i) {
      // console.log(i.showClass);
      // var blocks= document.querySelectorAll(".block");
      // console.log(blocks);
      // if(this.valueList.length=1){
      //   return;
      // }else {
      //     for(var i=0;i++;i<0){
      //         blocks[i].removeClass('active')
      //     }
      // }

      i.showClass = !i.showClass
      e.currentTarget.setAttribute('readonly', 'true')
    },
    dblclick(e, i) {
      //    i.showClass = !i.showClass;
      e.currentTarget.removeAttribute('readonly')
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.blocks {
  display: flex;
  flex-direction: row;
  .block {
    position: relative;
    border: solid 1px #999;
    border-radius: 3px;
    outline: none;
    vertical-align: middle;
    margin: 0 20px 10px 0;
    &.active {
      border: solid 1px red;
    }
    .step {
      position: relative;
      box-sizing: border-box;
      margin: 0 15px;
      font-size: 12px;
      min-width: 50px;
      height: 30px;
      input {
        width: 100%;
        position: absolute;
        outline: none;
        font-size: 12px;
        border: 0;
        margin: 0;
        padding: 0;
        height: 28px;
        box-sizing: border-box;
      }
      span {
        position: absolute;
        display: block;
        text-decoration: none;
        color: #666;
        height: 30px;
        width: 15px;
        top: 0;
        line-height: 30px;
        text-align: center;
        left: -15px;
        &.right {
          left: auto;
          right: -15px;
        }
      }
      .show {
        display: inline-block;
      }
    }
  }
}
</style>
