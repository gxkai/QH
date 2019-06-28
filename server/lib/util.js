const fs = require('fs')
const path = require('path')
const multer = require('koa-multer')
const uuid = require('uuid')
const moment = require('moment')
function getJsonTree(data, pid) {
  let itemArr = []
  for (let i = 0; i < data.length; i++) {
    let node = data[i]
    if (node.pid === pid) {
      let children = getJsonTree(data, node.id)
      if (children && children.length > 0) {
        node.children = children
      }
      itemArr.push(node)
    }
  }
  return itemArr
}

function getFile(url) {
  return new Promise(resolve => {
    fs.readFile(path.resolve(url), 'utf-8', function(err, data) {
      // 异步读取
      if (!err) {
        console.log('success', data) // 当文件读取成功时，输出读取的内容
        let arr = data.split('.icon-')
        let iconList = []
        for (let i = 1; i < arr.length; i++) {
          iconList.push(arr[i].split(':')[0])
        }
        resolve(iconList)
      }
    })
  })
}

function getWorkorderSn() {
  return `${moment().format('YYYYMMDDHHmmss')}${Math.floor(
    Math.random() * 10000
  )}00`
}

function queryFilter(arr) {
  for (let a in arr) {
    if (
      a === 'pageSize' ||
      a === 'currentPage' ||
      a === 'pagination' ||
      arr[a] === 'undefined' ||
      arr[a] === ''
    ) {
      delete arr[a]
    }
  }
}

function sumStrings(a, b) {
  a = '0' + a // 加0是因为两个最大的位数相加后可能需要进位
  b = '0' + b

  let arrA = a.split(''), // 将数字转成字符串
    arrB = b.split(''),
    res = [],
    temp = '',
    carry = 0,
    distance = a.length - b.length, // 计算两个数值字符串的长度差
    len = distance > 0 ? a.length : b.length

  // 在长度小的那个数值字符串前面添加distance个0，这样两个数值的位数就保持一致，
  // 如：9797979797、34646，需要将这两个数值转成['0','9','7','9','7','9','7','9','7','9','7']、['0','0','0','0','0','3','4','6','4','6']
  if (distance > 0) {
    for (let i = 0; i < distance; i++) {
      arrB.unshift('0')
    }
  } else {
    for (let i = 0; i < Math.abs(distance); i++) {
      arrA.unshift('0')
    }
  }

  // 从数组的最后一位开始向前遍历，把两个数组对应位置的数值字符串转成整形后相加，
  // carry表示相加后的进位，比如最后一位相加是7+6=13，这里进位carry是1
  // 在遍历的时候每次都加上上次相加后的carry进位
  for (let i = len - 1; i >= 0; i--) {
    temp = +arrA[i] + +arrB[i] + carry
    if (temp >= 10) {
      carry = 1
      res.push((temp + '')[1])
    } else {
      carry = 0
      res.push(temp)
    }
  }
  res = res
    .reverse()
    .join('')
    .replace(/^0/, '')
  console.log(res)
  return res
}

function getLocalIP() {
  const os = require('os')
  const ifaces = os.networkInterfaces()
  let locatIp = ''
  for (let dev in ifaces) {
    if (dev === 'en8') {
      for (let j = 0; j < ifaces[dev].length; j++) {
        if (ifaces[dev][j].family === 'IPv4') {
          locatIp = ifaces[dev][j].address
          break
        }
      }
    }
  }
  return locatIp
}

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, uuid.v4() + ext)
  }
})

const uplader = multer({
  storage: storage
})
module.exports = {
  getJsonTree,
  getFile,
  uplader,
  getWorkorderSn,
  queryFilter,
  sumStrings,
  getLocalIP
}
