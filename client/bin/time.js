/**
 * Created by 江苏立讯机器人有限公司. [ http://www.luxshare-ict.com ]
 * User: apeol
 * Date: 4/28/18
 * Time: 18:03
 */
module.exports = {
  now() {
    return Math.floor(new Date().getTime() / 1000)
  },
  countdown(time) {
    let dhis = [
      Math.floor(time / 86400),
      Math.floor((time = time % 86400) / 3600),
      Math.floor((time = time % 3600) / 60),
      Math.floor(time % 60)
    ]
    let name = ['天', '时', '分', '秒']
    let t = false
    let str = ''
    for (let i in dhis) {
      if (t || dhis[i] > 0) {
        t = true
        str += (dhis[i] < 10 ? '0' + dhis[i] : dhis[i]) + name[i]
      }
    }
    return str
  },
  double(v) {
    return v >= 10 ? v : '0' + v
  },
  timeToStr(val, enCode) {
    if (typeof val !== 'object') {
      val = {
        time: val,
        format: 'Y-m-d H:i:s'
      }
    }
    if (typeof val.time === 'undefined') val.time = 0
    if (typeof val.format === 'undefined') val.format = 'Y-m-d H:i:s'
    if (typeof val.simple === 'undefined') val.simple = true

    if (val.time == 'now') val.time = this.now()
    val.time = Number(val.time)
    if (!(val.time >= 0)) val.time = 0
    if (val.time == 0) return ''

    let thisDate = new Date(val.time * 1000)
    return val.format.replace(
      val.simple ? /([^-_\/.: 0-9])/gim : /([^-_\/.: 0-9]{1,})/gim,
      ($, $1) => {
        switch ($1) {
          case 'y':
            return (thisDate.getFullYear() + '').substr(2)
          case 'Y':
            return thisDate.getFullYear()
          case 'm':
            return this.double(thisDate.getMonth() + 1)
          case 'M':
            return [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
            ][thisDate.getMonth()]
          case 'd':
          case 'D':
            return this.double(thisDate.getDate())
          case 'h':
            return this.double(thisDate.getHours() % 12)
          case 'H':
            return this.double(thisDate.getHours())
          case 'i':
          case 'I':
            return this.double(thisDate.getMinutes())
          case 's':
          case 'S':
            return this.double(thisDate.getSeconds())
          case 'w':
            return (
              '星期' +
              ['日', '一', '二', '三', '四', '五', '六'][thisDate.getDay()]
            )
          case 'W':
            return ['Sun', 'Mon', 'Tues', 'Thur', 'May', 'Fri', 'Sat'][
              thisDate.getDay()
            ]
          default:
            return enCode ? enCode($1) : $1
        }
      }
    )
  }
}
