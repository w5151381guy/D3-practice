import React, { Component, Fragment } from 'react'
import view from '../../../bar chart/view'

class BarChart extends Component {
  componentDidMount() {
    view.bar_chart('bar')
  }

  render() {
    return (
      <Fragment>
        <div className='chart-title'>
          <div className='mark' id='Google'>
            <div className='google-mark circle'></div>
            Google
          </div>
          <div className='mark' id='Facebook'>
            <div className='facebook-mark circle'></div>
            Facebook
          </div>
        </div>
        <div id='bar'></div>
      </Fragment>
    )
  }
}

export default BarChart
