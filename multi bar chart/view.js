function multi_bar_chart(root, datas) {
  document.querySelector(`#${root}`).innerHTML = ''

  const margin = { top: 10, right: 35, bottom: 20, left: 45 },
    width = document.querySelector(`#${root}`).clientWidth,
    height = width > 768 ? 284 : 248,
    rectWidth = datas[0].series.length > 5 ? 8 : 24

  const x0 = d3.scaleBand().range([0, width - margin.left - margin.right])
  // .padding(0.05)

  const x1 = d3
    .scaleBand()
    .range([0, 2 * rectWidth + 5])
    .padding(0.05)

  const y = d3.scaleLinear().range([height, 0])

  let maxValue = 0
  let labels = [],
    tooltip_label = []

  datas[0].series.forEach(data => {
    if (data.name === '?') {
      labels.push(label['unknown'].cht_name)
      tooltip_label.push(label['unknown'].tooltip_cht_name)
    } else if (data.name in label) {
      labels.push(label[data.name].cht_name)
      tooltip_label.push(label[data.name].tooltip_cht_name)
    } else {
      labels.push(data.name)
      tooltip_label.push(data.name)
    }
  })

  const newData = labels.map((label, i) => ({
    name: label,
    series: datas.map(el => ({
      name: el.name,
      label: tooltip_label[i],
      value: el.series[i].value,
    })),
  }))

  newData
    .map(el => el.series.map(el => el.value))
    .forEach(el => {
      const max = d3.max(el)
      maxValue = maxValue > max ? maxValue : max
    })

  const { endPoint, count } = getSmartTicks(maxValue)

  if (root.match('pdf') && endPoint >= 1000) {
    margin.left = 55
  }

  x0.domain(newData.map(el => el.name))
  x1.domain(newData[0].series.map(el => el.name))
  y.domain([0, endPoint])

  const svg = d3
    .select(document.querySelector(`#${root}`))
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const tooltip = setTooltip('multi_bar', null, root)

  if (!root.match('pdf')) {
    svg.call(tooltip)
  }

  svg
    .selectAll('.slice')
    .data(newData)
    .enter()
    .append('g')
    .attr('class', 'g')
    .attr('transform', d => `translate(${x0(d.name)}, 0)`)
    .selectAll('rect')
    .data(d => d.series)
    .enter()
    .append('rect')
    .attr('x', d => x1(d.name))
    .attr('width', rectWidth)
    .attr('y', d => y(d.value))
    .attr('height', d => height - y(d.value))
    .attr('fill', d => chartColor[d.name].color)
    .attr(
      'transform',
      datas.length > 1
        ? `translate(${x0.bandwidth() / 2 - rectWidth - 2}, 0)`
        : `translate(${x0.bandwidth() / 2 - rectWidth / 2 - 2}, 0)`
    )
    .on('mouseover touchstart', tooltip.show)
    .on('touchend, mouseout', tooltip.hide)

  // add the x Axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'xaxis')
    .call(d3.axisBottom(x0).tickSizeOuter(0))

  // add the y Axis
  svg
    .append('g')
    .attr('class', 'yaxis')
    .call(d3.axisLeft(y).ticks(count))
}
