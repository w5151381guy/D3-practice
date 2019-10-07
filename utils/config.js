export const chartColor = {
  Google: {
    color: '#f85672',
  },
  Facebook: {
    color: '#0daeff',
  },
  mobile: {
    color: '#0daeff',
  },
  desktop: {
    color: '#ffb854',
  },
  tablet: {
    color: '#f85672',
  },
  tv: {
    color: '#08c9cc',
  },
}

// val 為 d3.max() 得到的資料最大值
export const getSmartEndpoint = val => {
  // 先取得最大值的位數，並算出這個位數的最小值
  let count = Math.floor(val).toString().length - 1
  let step = Math.pow(10, count)

  // 以 5 的倍數為基準，假如最大值除以此位數的最小值小於 5
  if (val / step < 5) {
    // 將這個位數最小值砍半，這樣之後就會是以 5 為基準了
    step = step / 2
  }

  count = Math.ceil(val / step)

  return count * step
}
