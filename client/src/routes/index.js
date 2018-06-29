import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import Home from '../components/Home'
import Register from '../components/Register'
import Login from '../components/Login'
import CreateTeam from '../components/CreateTeam'

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/register' exact component={Register} />
        <Route path='/login' exact component={Login} />
        <Route path='/create-team' exact component={CreateTeam} />
      </Switch>
    </Router>
  )
}

export default Routes
