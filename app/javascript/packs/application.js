// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Profile from './components/Profile'
import './styles/main.sass'

document.addEventListener('turbolinks:load', () => {
  const app = document.getElementById('app')
  const user = JSON.parse(document.getElementById('user-data').dataset.user)

  ReactDOM.render(
    <Profile user={user} />,
    app,
  )
})

document.addEventListener('turbolinks:before-render', () => {
  ReactDOM.unmountElementAtNode(document.getElementById('app'))
})
