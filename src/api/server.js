const axios = require('axios')
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'

// Usage: getApi('bookshelf'|'detail-info', 'mFP43SIHeHWEAJecoMa5Y8aL')
exports.getApi = (info, token) => {
  const url = `http://api.zhuishushenqi.com/user/${info}?token=${token}` // use+
  return axios.get(url)
  .then((res) => {
    return Promise.resolve(res.data)
  })
  .catch(function (error) {
    console.log(error)
  })
}

exports.getQuery = (info) => {
  // 不能用我曹
  // const url = 'http://api.zhuishushenqi.com/book/auto-complete?query=' + info
  // return axios.get(url)
  const url = 'http://api.zhuishushenqi.com/book/auto-complete'
  return axios.get(url, {
    params: {
      query: info
    }
  })
  .then(function (res) {
    return Promise.resolve(res.data)
  })
  .catch(function (error) {
    console.log(error)
  })
}

exports.getSource = (bookId) => {
  const url = 'http://api.zhuishushenqi.com/toc'
  return axios.get(url, {
    params: {
      view: 'summary',
      book: bookId,
      channel: 'mweb'
    }
  })
  .then(function (res) {
    return Promise.resolve(res.data)
  })
  .catch(function (error) {
    console.log(error)
  })
}

exports.getChapters = (sourceId) => {
  const url = 'http://api.zhuishushenqi.com/toc/' + sourceId
  return axios.get(url, {
    params: {
      view: 'chapters',
      channel: 'mweb'
    }
  })
  .then(function (res) {
    return Promise.resolve(res.data)
  })
  .catch(function (error) {
    console.log(error)
  })
}

exports.getContent = (link) => {
  const url = 'http://chapter2.zhuishushenqi.com/chapter/' + encodeURIComponent(link)
  return axios.get(url)
  .then(function (res) {
    return Promise.resolve(res.data)
  })
  .catch(function (error) {
    console.log(error)
  })
}
