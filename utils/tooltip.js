import d3Tip from 'd3-tip'

function setTooltip(chart_type) {
  const tooltip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-14, 0])

  switch (chart_type) {
    case 'line': {
      tooltip.html((d, i) => {
        let group_name = 'Google'

        if (media.length > 1) {
          const google_data = data[0]
          group_name = google_data.series[i] === d ? 'Google' : 'Facebook'
        } else {
          group_name = media[0]
        }

        const timeFormat = d3.timeFormat('%m/%d')

        let tooltipHTML = ''

        tooltipHTML = `
          <div class="date">${timeFormat(d.name)}</div>
          <div>
            <span class="mark ${group_name}-mark"></span>
            <span>${group_name}</span>
            ${unit}${d.value.toLocaleString()}
          </div>
        `
        return tooltipHTML
      })
      return tooltip
    }

    case 'bar': {
      tooltip.html(
        d => `
            <div class="date">${d.name}</div>
            <div>
              <span class="mark ${d.name}-mark"></span>
              <span>${d.name}</span>  
              ${d.value.toLocaleString()}
            </div>
          `
      )
      return tooltip
    }

    case 'multi_bar': {
      tooltip.html(
        d => `
        <div class="date">${d.label}</div>
        <div>
          <span class="mark ${d.name}-mark"></span>
          <span>${d.name}</span>
          ${d.value.toLocaleString()}
        </div>
      `
      )
      return tooltip
    }

    case 'donut': {
      tooltip.html(
        d => `
          <div class="date">${device[media][d.data.name].cht_name}</div>
          <div>
            點擊數 <span>${d.data.clicks}</span>
          </div>
        `
      )
      return tooltip
    }
  }
}

export default { setTooltip }
