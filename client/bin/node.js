/**
 * Created by 江苏立讯机器人有限公司. [ http://www.luxshare-ict.com ]
 * User: apeol
 * Date: 4/28/18
 * Time: 18:03
 */
export default {
  decode(data) {
    let res = []
    let left = 0
    function jx(d, m) {
      for (let i in d) {
        let node = d[i]
        console.log(d)
        res.push({
          _id: node._id,
          name: node.name,
          before: node.before,
          after: node.after,
          L: ++left,
          R: (node.children && node.children.length && jx(node.children, m + 1),
          ++left),
          I: m
        })
      }
    }
    data.children && data.children.length && jx(data.children, 1)
    return this.sort(res)
  },
  encode(data) {
    data = this.sort(data)
    function jx($i, $m) {
      while (data.length > 0) {
        let $a = data[0]
        if ($i === $a.I) {
          data.shift()
          if (data.length > 0) {
            let $d = data[0]
            if ($a.I < $d.I) $a.children = jx($d.I, [])
          }
          $m.push({
            _id: $a._id || 0,
            parent: null,
            name: $a.name || '未命名节点',
            before: $a.before || [],
            after: $a.after || [],
            children: $a.children || [],
            focus: false,
            active: false,
            edit: false
          })
        } else if ($i > $a.I) {
          break
        }
      }
      return $m
    }
    return jx(data[0].I, [])
  },
  sort(data) {
    return data.sort((a, b) => {
      return a.L - b.L
    })
  }
}
