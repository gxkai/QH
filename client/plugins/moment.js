/**
 * @author gxkai
 * @date 2019/6/5 7:33 PM
 * @Description:
 */
import moment from 'moment'
import Vue from 'vue'
export default () => {
  Vue.prototype.moment = moment
  Vue.prototype.validate = async (app, formName) => {
    return new Promise(resolve => {
      app.$refs[formName].validate(valid => {
        resolve(valid)
      })
    })
  }
}
