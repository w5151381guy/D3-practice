import * as d3 from 'd3'
import tip from '../utils/tooltip'
import { multiBarDatas } from '../utils/data'
import { getSmartEndpoint, chartColor } from '../utils/config'

function multi_bar_chart(root) {
  document.querySelector(`#${root}`).innerHTML = ''

  const margin = { top: 10, right: 35, bottom: 20, left: 45 },
    width = document.querySelector(`#${root}`).clientWidth,
    height = 350,
    rectWidth = 24

  const x0 = d3.scaleBand().range([0, width - margin.left - margin.right])

  const x1 = d3
    .scaleBand()
    .range([0, 2 * rectWidth + 5])
    .padding(0.05)

  const y = d3.scaleLinear().range([height, 0])

  let maxValue = 0
  let labels = []

  multiBarDatas.forEach(datas => {
    datas.series.forEach(data => {
      labels.push(data.name)
    })
  })

  const newData = labels.map(label => ({
    name: label,
    series: multiBarDatas.map((datas, i) => ({
      name: datas.name,
      label: label,
      value: datas.series[i].value,
    })),
  }))

  newData
    .map(el => el.series.map(el => el.value))
    .forEach(el => {
      const max = d3.max(el)
      maxValue = maxValue > max ? maxValue : max
    })

  const endPoint = getSmartEndpoint(maxValue)

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

  const tooltip = tip.setTooltip('multi_bar')
  svg.call(tooltip)

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
    .attr('transform', `translate(${x0.bandwidth() / 2 - rectWidth - 2}, 0)`)
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide)

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
    .call(d3.axisLeft(y).ticks(5))
}

export default { multi_bar_chart }
