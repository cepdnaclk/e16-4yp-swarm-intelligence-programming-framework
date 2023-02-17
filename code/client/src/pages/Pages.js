import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import Mqtt from './Mqtt/Mqtt'
import Playground from './Playground/Playground'

function Pages() {
  return (
    <Routes>
        <Route path="/" exact element={<Dashboard />} />
        <Route path="/mqtt" exact element={<Mqtt />} />
        <Route path="/playground" exact element={<Playground />} />
    </Routes>
  )
}

export default Pages