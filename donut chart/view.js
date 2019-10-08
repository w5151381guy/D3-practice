import * as d3 from 'd3'
import { pieDatas } from '../utils/data'
import { chartColor } from '../utils/config'

function donut_chart(root) {
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

  const arc = d3
    .arc()
    .innerRadius(width / 2 - 30)
    .outerRadius(width / 2)

  const pie = d3.pie().value(d => d.value)

  svg
    .selectAll('path')
    .data(pie(newData[0].series))
    .enter()
    .append('g')
    .on('mouseover', function(d) {
      const g = d3
        .select(this)
        .append('g')
        .attr('class', 'text-group')

      // tooltip title setting
      g.append('text')
        .attr('class', 'date')
        .text(`${d.data.name}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '-1.2em')

      // tooltip content setting
      g.append('text')
        .attr('class', 'value-text')
        .text(`點擊數 ${d.data.clicks}`)
        .attr('text-anchor', 'middle')
        .attr('dy', '.6em')
    })
    .on('mouseout', function(d) {
      d3.select('.text-group').remove()
    })
    .append('path')
    .attr('d', arc)
    .attr('fill', d => chartColor[d.data.name].color)
}

export default { donut_chart }
