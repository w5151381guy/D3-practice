import * as d3 from 'd3'
import { pieDatas } from '../utils/data'
import { chartColor } from '../utils/config'
import tip from '../utils/tooltip'

function pie_chart(root) {
  const width = document.querySelector(`#${root}`).clientWidth,
    height = width

  const total = pieDatas[0].series
    .map(data => data.value)
    .reduce((current, acc) => current + acc)

  const newData = pieDatas.map((data, i) => ({
    name: data.name,
    series: data.series.map(el => ({
      name: el.name,
      clicks: el.value,
      value: el.value === 0 ? 0 : ((el.value / total) * 100).toFixed(1),
    })),
  }))

  const svg = d3
    .select(document.querySelector(`#${root}`))
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const tooltip = tip.setTooltip('pie')
  svg.call(tooltip)

  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(width / 2)

  const pie = d3.pie().value(d => d.value)

  svg
    .selectAll('path')
    .data(pie(newData[0].series))
    .enter()
    .append('g')
    .append('path')
    .attr('d', arc)
    .attr('fill', d => chartColor[d.data.name].color)
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide)
}

export default { pie_chart }
