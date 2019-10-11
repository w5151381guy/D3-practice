import React, { Fragment, useEffect } from 'react'
import view from '../../../line chart/view'

const LineChart = () => {
  useEffect(() => {
    view.multi_line_chart('line')
  })

  return (
    <Fragment>
      <div className="chart-title">
        <div className="mark" id="Google">
          <div className="google-mark circle" />
          Google
        </div>
        <div className="mark" id="Facebook">
          <div className="facebook-mark circle" />
          Facebook
        </div>
      </div>
      <div id="line" />
    </Fragment>
  )
}

export default LineChart
