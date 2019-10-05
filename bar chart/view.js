import * as d3 from 'd3'
import tip from '../utils/tooltip'
import { barDatas } from '../utils/data'
import { getSmartEndpoint, chartColor } from '../utils/config'

function bar_chart(root) {
  document.querySelector(`#${root}`).innerHTML = ''

  const margin = { top: 10, right: 35, bottom: 20, left: 40 },
    width = document.querySelector(`#${root}`).clientWidth,
    height = 350

  // 設定 x 以及 y 座標的比例尺以及輸出區域
  const x = d3.scaleBand().range([0, width])

  const y = d3.scaleLinear().range([height, 0])

  const maxFB = parseFloat(barDatas[1].value),
    maxGoogle = parseFloat(barDatas[0].value),
    maxValue = maxFB > maxGoogle ? maxFB : maxGoogle

  const endPoint = getSmartEndpoint(maxValue)

  x.domain(barDatas.map(d => d.name))
  y.domain([0, endPoint])

  const svg = d3
    .select(document.querySelector(`#${root}`))
    .append('svg')
    .attr('width', width)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const tooltip = tip.setTooltip('bar')
  svg.call(tooltip)

  svg
    .selectAll('rect')
    .data(barDatas)
    .enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('width', 24)
    .attr('y', d => y(d.value))
    .attr('height', d => height - y(d.value))
    .attr('fill', d => chartColor[d.name].color)
    .attr('transform', `translate(${x.bandwidth() / 2 - 12}, 0)`)
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide)

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
    .call(d3.axisLeft(y).ticks(5))
}

export default { bar_chart }
