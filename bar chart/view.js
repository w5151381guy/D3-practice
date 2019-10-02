function bar_chart(root, data) {
  document.querySelector(`#${root}`).innerHTML = ''

  const margin = { top: 10, right: 35, bottom: 20, left: 40 },
    width = document.querySelector(`#${root}`).clientWidth,
    height = width > 768 ? 284 : 248

  const x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.1)

  const y = d3.scaleLinear().range([height, 0])

  const maxFB = data.length > 1 ? parseFloat(data[1].series[0].value) : 0,
    maxGoogle = parseFloat(data[0].series[0].value),
    maxValue = maxFB > maxGoogle ? maxFB : maxGoogle

  const { endPoint, count } = getSmartTicks(maxValue)

  if (root.match('pdf') && endPoint >= 1000) {
    margin.left = 55
  }

  x.domain(data.map(d => d.name))
  y.domain([0, endPoint])

  const svg = d3
    .select(document.querySelector(`#${root}`))
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const tooltip = setTooltip('bar', null, root)

  if (!root.match('pdf')) {
    svg.call(tooltip)
  }

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('width', 24)
    .attr('y', d => y(d.series[0].value))
    .attr('height', d => height - y(d.series[0].value))
    .attr('fill', d => chartColor[d.name].color)
    .attr('transform', `translate(${x.bandwidth() / 2 - 12}, 0)`)
    .on('mouseover touchstart', tooltip.show)
    .on('touchend, mouseout', tooltip.hide)

  // add the x Axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'xaxis')
    .call(d3.axisBottom(x).tickSizeOuter(0))

  // add the y Axis
  svg
    .append('g')
    .attr('class', 'yaxis')
    .call(d3.axisLeft(y).ticks(count))
}
