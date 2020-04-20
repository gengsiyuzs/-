const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
  params包含url，params参数，method，header。。。
*/
const getData = params => {
  console.log(params);
  return new Promise((rel, rej) => {
    wx.request({
      url: params.url,
      method: params.method ? params.method : 'get',
      header: params.header ? params.header : {},
      success: data => {
        rel(data.data);
      },
      fail: err => {
        rej(err);
      }
    })
  }).then(data => {
    console.log(data);
    return data;
  }, err => {
    console.log(err);
  });
}

module.exports = {
  formatTime, formatNumber, getData
}
