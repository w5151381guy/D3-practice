function donut_chart(root, datas) {
  const newRoot = [],
    medias = [],
    totals = []

  for (let i = 0; i < datas.length; i++) {
    if (datas[i].name === 'Google') {
      document.querySelector(`#${root}1`).innerHTML = ''
      newRoot.push(`#${root}1`)
      medias.push('Google')
    } else {
      document.querySelector(`#${root}2`).innerHTML = ''
      newRoot.push(`#${root}2`)
      medias.push('Facebook')
    }
  }

  const width = document.getElementsByClassName('donut_chart')[0].clientWidth,
    height = width

  medias.forEach((media, i) => {
    const total = datas[i].series
      .map(el => el.value)
      .reduce((current, acc) => current + acc)
    totals.push(total)
  })

  const newData = datas.map((data, i) => ({
    name: data.name,
    series: data.series.map(el => ({
      name: el.name,
      clicks: el.value,
      value: el.value === 0 ? 0 : ((el.value / totals[i]) * 100).toFixed(1),
    })),
  }))

  for (let i = 0; i < newRoot.length; i++) {
    const svg = d3
      .select(document.querySelector(newRoot[i]))
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const tooltip = setTooltip('donut', null, root, medias[i])
    svg.call(tooltip)

    const arc = d3
      .arc()
      .innerRadius(width / 2 - 10)
      .outerRadius(width / 2)

    const pie = d3.pie().value(d => d.value)

    const noData = [{ name: '無資料', value: 100 }]

    totals[i] === 0
      ? svg
          .selectAll('path')
          .data(pie(noData))
          .enter()
          .append('g')
          .append('path')
          .attr('d', arc)
          .attr('fill', '#ebeff2')
      : svg
          .selectAll('path')
          .data(pie(newData[i].series))
          .enter()
          .append('g')
          .append('path')
          .attr('d', arc)
          .attr('fill', d => device[medias[i]][d.data.name].color)
          .on('touchstart mouseover', tooltip.show)
          .on('touchend mouseout', tooltip.hide)
  }
}
