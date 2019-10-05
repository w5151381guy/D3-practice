import * as d3 from 'd3'
import tip from '../utils/tooltip'
import { lineDatas } from '../utils/data'
import { getSmartEndpoint, chartColor } from '../utils/config'

function multi_line_chart(root) {
  document.querySelector(`#${root}`).innerHTML = ''

  const margin = { top: 10, right: 35, bottom: 20, left: 45 },
    width = document.querySelector(`#${root}`).clientWidth,
    height = 350

  // Format Data
  const parseDate = d3.timeParse('%m-%d')
  const newData = lineDatas.map(data => ({
    series: data.series.map(el => ({
      label: data.name,
      name: parseDate(el.name),
      value: parseFloat(el.value),
    })),
    name: data.name,
  }))

  const x = d3.scaleTime().range([0, width - margin.left - margin.right])

  const y = d3.scaleLinear().range([height, 0])

  let maxValue = 0

  lineDatas
    .map(el => el.series.map(el => parseFloat(el.value)))
    .forEach(el => {
      const max = d3.max(el)
      maxValue = maxValue > max ? maxValue : max
    })

  const endPoint = getSmartEndpoint(maxValue)

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

  const tooltip = tip.setTooltip('line')
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
  const xAxis = d3
    .axisBottom(x)
    .ticks(5)
    .tickFormat(d3.timeFormat('%m/%d'))

  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'xaxis')
    .call(xAxis)

  // add the y Axis
  svg
    .append('g')
    .attr('class', 'yaxis')
    .call(d3.axisLeft(y).ticks(5))
}

export default { multi_line_chart }
