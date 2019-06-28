/**
 * Created by 江苏立讯机器人有限公司. [ http://www.luxshare-ict.com ]
 * User: apeol
 * Date: 4/28/18
 * Time: 18:03
 */
import Vue from 'vue'
export default {
  dialog: {},
  vue: Vue,
  open(options, callback) {
    options.parent = this
    this.dialog.data.push(options)
    options.index = this.dialog.index = this.dialog.data.length
    callback &&
      this.dialog.nextTick(() => {
        callback(options)
      })
    options.type !== 'loading' &&
      (options.btns ||
        setTimeout(() => {
          this.close()
        }, (options.showTime || 2) * 1000))
  },
  close(callback) {
    let d = this.dialog.data.pop()
    callback && callback(d)
    this.dialog.index = this.dialog.data.length
  },
  replace(options) {
    this.close()
    this.open(options)
  },
  getActive() {
    return this.dialog.data[this.dialog.data.length - 1]
  }
}
