<template>
  <div>
    <div
      class="node"
      v-for="(node, index) in nodes.children"
      :tabindex="(node.parent = nodes) && 1"
      onkeydown="return event.key ? !(({'ArrowUp':1,'ArrowDown':1,'ArrowLeft':1,'ArrowRight':1})[event.key]) : true"
      @keyup.self.37="left(index)"
      @keyup.self.38="top(index)"
      @keyup.self.39="right(index)"
      @keyup.self.40="bottom(index)"
      @keyup.enter.self="append"
      @keydown.tab.self="after(index)"
      @keydown.delete.self="remove(index)"
      v-focus="node.focus"
      :class="{ active: node.active }"
      @focus="setActive(node)"
      @dblclick="$event.stopPropagation(edit(node))"
      @keyup.space="$event.stopPropagation(edit(node))"
      @blur="node.focus = false"
    >
      <div class="control">
        <div class="f-l">
          <i title="关联设备" @click="addTool(node.before)"></i>
          <lux-icon
            :type="tool.tool.icon"
            v-for="(tool, j) in node.before"
            :key="j"
            @click="editTool(tool, node.before, j)"
          />
        </div>
        <div class="f-r">
          <lux-icon
            :type="tool.tool.icon"
            v-for="(tool, j) in node.after"
            :key="j"
            @click="editTool(tool, node.after, j)"
          />
          <i title="关联设备" @click="addTool(node.after)"></i>
        </div>
        <div
          class="input"
          :style="{
            marginLeft: 25 * node.before.length + 'px',
            marginRight: 25 * node.after.length + 'px'
          }"
        >
          <input
            v-focus.select="node.edit"
            v-model="node.name"
            onkeydown="return (event.stopPropagation(),(event.key ? (event.key == 'Tab' ? (this.blur(),false) : true) : true))"
            @focus.self="edit(node)"
            @blur.self="save"
            @keyup.enter.self="save"
          />
          <span v-html="node.name.replace(/ /g, '&nbsp;')"></span>
        </div>
      </div>
      <lux-node
        v-if="node.children"
        :nodes="node"
        :actions="actions"
      ></lux-node>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LuxNode',
  directives: {
    focus: {
      update: function(el, { value, oldValue, modifiers, arg }) {
        if (value && !oldValue) {
          el.focus()
          // arg == 'select' && el.select();
          modifiers.select && el.select()
        }
      }
    }
  },
  props: {
    nodes: {
      default: {
        children: []
      }
    },
    actions: {},
    disabled: {}
  },
  data() {
    return {
      show: false,
      active: null
    }
  },
  methods: {
    setActive(node) {
      this.active = node
      node.focus = true
    },
    append() {
      if (this.disabled) return

      let node = this.active
      let nn = {
        id: 0,
        parent: node,
        name: 'new node',
        before: [],
        after: [],
        children: [],
        focus: false,
        active: true,
        edit: false
      }

      node.children.push(nn)
      setTimeout(function() {
        nn.edit = true
      }, 10)
    },
    after(index) {
      if (this.disabled) return

      let node = this.active.parent
      let nn = {
        id: 0,
        parent: node,
        name: 'new node',
        before: [],
        after: [],
        children: [],
        focus: false,
        active: true,
        edit: false
      }
      node.children.splice(index + 1, 0, nn)
      setTimeout(function() {
        nn.edit = true
      }, 10)
    },
    save() {
      let node = this.active
      node.edit = false
      node.active = false
      node.focus = true
      node.name = node.name.replace(/(^\s*)|(\s*$)/g, '')
      if (node.name === '') node.name = '未命名节点'
    },
    left(i) {
      if (i === 0) return this.top()
      let node = this.active.parent.children[i - 1]
      if (!node) return
      if (this.active) this.active.focus = false
      node.focus = true
      this.active = node
    },
    right(i) {
      let node = this.active.parent.children[i + 1]
      if (!node) return this.top()
      this.active.focus = false
      node.focus = true
      this.active = node
    },
    top(i) {
      let node = this.active.parent
      if (typeof node.active === 'undefined')
        return i > 0 ? this.left(i) : false
      if (this.active) this.active.focus = false
      node.focus = true
      this.active = node
    },
    bottom(i) {
      let node = this.active.children[0]
      if (!node) return this.right(i)
      this.active.focus = false
      node.focus = true
      this.active = node
    },
    edit(node) {
      if (this.disabled) return
      this.active = node
      node.active = true
      node.focus = false
      node.edit = true
    },
    reSelect() {
      if (this.disabled) return
      this.active.focus = true
    },
    remove(i) {
      if (this.disabled) return
      let obj = this
      let children = obj.active.parent.children
      children.splice(i, 1)
      console.log(children.length)
      if (i > 0) {
        obj.active = children[i - 1]
        obj.active.focus = true
      } else if (typeof obj.active.parent.active !== 'undefined') {
        obj.active = obj.active.parent
        obj.active.focus = true
      } else if (children.length > 0) {
        obj.active = children[0]
        obj.active.focus = true
      } else {
        obj.active = {
          id: 0,
          parent: null,
          name: 'start',
          before: [],
          after: [],
          children: [],
          focus: false,
          active: true,
          edit: false
        }

        children.push(obj.active)
        setTimeout(function() {
          obj.active.edit = true
        }, 10)
      }
    },
    addTool(seat) {
      if (this.disabled) return
      this.actions.addTool && this.actions.addTool(seat, this)
    },
    editTool(tool, seat, index) {
      this.actions.editTool && this.actions.editTool(tool, seat, index, this)
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.opacity(@a:0.7) {
  //filter:alpha(opacity=@a*100);
  -moz-opacity: @a;
  -khtml-opacity: @a;
  opacity: @a;
}
.origin(@x:0, @y:0) {
  transform-origin: @x @y;
  -ms-transform-origin: @x @y;
  -moz-transform-origin: @x @y;
  -webkit-transform-origin: @x @y;
  -o-transform-origin: @x @y;
}
.scaleX(@val:0.5, @x:0, @y:0) {
  .origin(@x @y);
  transform: scaleX(@val);
  -ms-transform: scaleX(@val);
  -moz-transform: scaleX(@val);
  -webkit-transform: scaleX(@val);
  -o-transform: scaleX(@val);
}
.scaleY(@val:0.5, @x:0, @y:0) {
  .origin(@x @y);
  transform: scaleY(@val);
  -ms-transform: scaleY(@val);
  -moz-transform: scaleY(@val);
  -webkit-transform: scaleY(@val);
  -o-transform: scaleY(@val);
}
.scale(@val:0.5, @x:0, @y:0) {
  .origin(@x @y);
  transform: scale(@val);
  -ms-transform: scale(@val);
  -moz-transform: scale(@val);
  -webkit-transform: scale(@val);
  -o-transform: scale(@val);
}
.rotate(@val:90deg, @x:0, @y:0) {
  .origin(@x @y);
  transform: rotate(@val);
  -ms-transform: rotate(@val);
  -moz-transform: rotate(@val);
  -webkit-transform: rotate(@val);
  -o-transform: rotate(@val);
}
.translate(@x:-50%, @y:-50%) {
  transform: translate(@x, @y);
  -ms-transform: translate(@x, @y);
  -moz-transform: translate(@x, @y);
  -webkit-transform: translate(@x, @y);
  -o-transform: translate(@x, @y);
}
.blur(@v:1px) {
  -webkit-filter: blur(@v);
  -ms-filter: blur(@v);
  filter: blur(@v);
}

.flex_h() {
  display: -moz-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  position: relative;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;

  &.align-top {
    -webkit-box-align: unset;
    -webkit-align-items: unset;
    -ms-flex-align: unset;
    align-items: unset;
  }

  > * {
    position: relative;
    padding: 0.1rem 0;
    margin: 0;
  }
  > .bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    -moz-box-flex: 1;
    flex: 1;
  }
  // > .fd{margin-right: -@cellPaddingLeft;}
  // > .br{border-right: solid 1px @cellBorderColor;}
  // > .bl{border-left: solid 1px @cellBorderColor;}
  // > .pl, > .ph{padding-left: @cellPaddingLeft;}
  // > .pr, > .ph{padding-right: @cellPaddingLeft;}
  // > .pt, > .pv{padding-top: @cellPaddingLeft;}
  // > .pb, > .pv{padding-bottom: @cellPaddingLeft;}
  // > p.ph{padding: 0; margin: 0 @cellPaddingLeft;}
}

.ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ellipsis_n(@n:3) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: @n;
  overflow: hidden;
}
.sl,
.ellipsis {
  .ellipsis;
}

.icon() {
  font-family: 'iconfont' !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle;
}

.node {
  display: inline-block;
  position: relative;
  z-index: 1;
  border: solid 1px #d7d7d7;
  border-radius: 3px;
  margin-right: 35px;
  vertical-align: middle;
  margin-bottom: 15px;
  &:after {
    .icon;
    font-size: 15px;
    content: '\e60d';
    height: 30px;
    display: block;
    position: absolute;
    width: 33px;
    text-align: center;
    top: 50%;
    margin-top: -15px;
    right: -36px;
    color: #478eb5;
  }
  &:last-child {
    margin-right: 5px;
    &:after {
      display: none;
    }
  }
  .node {
    margin: 5px 25px 10px 10px;
    &:last-child {
      margin-right: 10px;
    }
  }
  * {
    vertical-align: middle;
  }
  .control {
    font-size: 15px;
    .ip() {
      display: block;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 18px;
      margin: 5px;
      cursor: pointer;
      float: left;
      color: #999;
      border-radius: 3px;
      overflow: hidden;
      &:hover {
        background-color: #ddd;
      }
      border: solid 1px transparent;
      box-sizing: border-box;
    }
    i {
      .ip;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border: none;
      &:after {
        .icon;
        font-size: 15px;
        content: '\e71b';
        display: block;
      }
    }
    p {
      .ip();
      background: center center no-repeat;
      background-size: cover;
    }
    div {
      position: relative;
      display: block;
      overflow: hidden;
      text-align: center;
      font-size: 15px;
      &.f-l {
        float: left;
        margin-right: -1000px;
        padding-left: 5px;
        i,
        p {
          margin-right: 0;
        }
      }
      &.f-r {
        float: right;
        margin-left: -1000px;
        padding-right: 5px;
        i,
        p {
          margin-left: 0;
        }
      }
      &.input {
        pointer-events: none;
        padding: 0 25px;
      }
      input {
        pointer-events: auto;
        position: absolute;
        box-sizing: border-box;
        width: 100% !important;
        font-size: inherit;
        font-family: inherit;
        height: 30px;
        border: none !important;
        margin: 0;
        padding: 0 10px !important;
        text-align: center !important;
        line-height: 30px;
        top: -300px;
        left: 0;
        color: #333;
        background: transparent !important;
        &:focus {
          top: 0px;
          box-shadow: none !important;
        }
      }
      span {
        padding: 0 10px;
        display: inline-block;
        font-size: inherit;
        min-width: 80px;
        height: 30px;
        line-height: 30px;
        color: #333;
      }
    }
  }

  &.active,
  &:focus {
    box-shadow: 0 0 5px 0 #478eb5;
    border-color: #478eb5;
    > .control > div {
      //&.input{padding: 0 25px;}
      > i {
        display: inline-block;
      }
    }
  }
  &.active > .control > div.input input:focus + span {
    color: #fff;
  }
}
</style>
