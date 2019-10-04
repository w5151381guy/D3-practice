function multi_line_chart(root, data) {
  document.querySelector(`#${root}`).innerHTML = ''

  const margin = { top: 10, right: 35, bottom: 20, left: 45 },
    width = document.querySelector(`#${root}`).clientWidth,
    height = width > 768 ? 284 : 248

  // Format Data
  const parseDate = root.match('hour')
    ? d3.timeParse('%H')
    : d3.timeParse('%m-%d')
  const newData = data.map(d => ({
    series: d.series.map(d => ({
      name: parseDate(d.name),
      value: parseFloat(d.value),
    })),
    name: d.name,
  }))

  const media = newData.map(el => el.name)

  const x = d3.scaleTime().range([0, width - margin.left - margin.right])
  // .paddingInner(0.1)

  const y = d3.scaleLinear().range([height, 0])

  let maxValue = 0

  data
    .map(el => el.series.map(el => parseFloat(el.value)))
    .forEach(el => {
      const max = d3.max(el)
      maxValue = maxValue > max ? maxValue : max
    })

  const { endPoint, count } = getSmartTicks(maxValue)

  x.domain(d3.extent(newData[0].series, d => d.name))
  y.domain([0, endPoint])

  const svg = d3
    .select(document.querySelector(`#${root}`))
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const line = d3
    .line()
    .x(d => x(d.name))
    .y(d => y(d.value))

  const lines = svg.append('g').attr('class', 'lines')

  // add lines into svg
  lines
    .selectAll('.line-group')
    .data(newData)
    .enter()
    .append('g')
    .attr('class', 'line-group')
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.series))
    .style('stroke', d => chartColor[d.name].color)
    .style('fill', 'none')

  const tooltip = setTooltip('line', newData, root, media)
  svg.call(tooltip)

  // add tooltip
  lines
    .selectAll('circle-group')
    .data(newData)
    .enter()
    .selectAll('circle')
    .data(d => d.series)
    .enter()
    .append('g')
    .attr('class', 'tooltip')
    .on('touchstart mouseover', tooltip.show)
    .on('touchend mouseout', tooltip.hide)
    .append('circle')
    .attr('cx', d => x(d.name))
    .attr('cy', d => y(d.value))
    .attr('r', 3)
    .style('fill', 'transparent')

  // add the x Axis
  const xAxis = root.match('hour')
    ? d3
        .axisBottom(x)
        .tickValues([parseDate(0), parseDate(12), parseDate(23)])
        .tickFormat(d3.timeFormat('%H:%M'))
    : root.match('month')
    ? d3
        .axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat('%m/%d'))
        .tickValues([x.domain()[0], x.domain()[1]])
    : d3
        .axisBottom(x)
        .ticks(5)
        .tickFormat(d3.timeFormat('%m/%d'))

  // mobile x ticks show head and end
  width > 414 || root.match('hour')
    ? svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('class', 'xaxis')
        .call(xAxis.tickSizeOuter(0))
    : svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('class', 'xaxis')
        .call(xAxis.tickSizeOuter(0).tickValues([x.domain()[0], x.domain()[1]]))

  // add the y Axis
  svg
    .append('g')
    .attr('class', 'yaxis')
    .call(d3.axisLeft(y).ticks(count))
}
