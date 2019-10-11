import React, { Component, Fragment } from 'react'
import BarChart from '../component/barChart'
import LineChart from '../component/lineChart'

class App extends Component {
  render() {
    return (
      <Fragment>
        <BarChart />
        <LineChart />
      </Fragment>
    )
  }
}

export default App
