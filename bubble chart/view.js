import * as d3 from 'd3'
import { bubbleDatas } from '../utils/data'

function bubble_chart(root) {
  let dataobj = {
    children: bubbleDatas,
  }

  // svg width and height
  const width = document.querySelector(`#${root}`).clientWidth,
    height = width

  let pack = d3
    .pack()
    .padding(1.5)
    .size([width, height])
  let rootnode = d3.hierarchy(dataobj)

  let nodes = pack(
    // use song likes as sum value and sort likes
    rootnode.sum(d => d.likes).sort((a, b) => b.data.likes - a.data.likes)
  )

  nodes = nodes.children

  const svg = d3
    .select(document.querySelector(`#${root}`))
    .append('div')
    .attr('class', 'bubble')
    .style('display', 'block')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // all circles
  const circles = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')

  circles
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    // use title name to generate random color
    .attr('fill', '#fb3131')
    // circle border
    .style('stroke', '#d43d5e')
    // circle border width
    .style('stroke-width', 3)

  circles
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('dy', '.5em')
    .attr('text-anchor', 'middle')
    .attr('fill', '#ffffff')
    .text(d => d.data.title)
}

export default { bubble_chart }
