import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import request from 'superagent'
import _ from 'lodash'
import $ from 'jquery'

import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps'

import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer"

import withScriptjs from "react-google-maps/lib/async/withScriptjs"

const SimpleMapExampleGoogleMap = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: 22.10, lng: -2.8138478 }}
  >
    <MarkerClusterer
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.map((marker,i) => (
        <Marker
          position={{ lat: marker.latitude, lng: marker.longitude }}
          key={i}
          onClick={() => props.onShowUserInfo(marker)}
        >
          {marker.showInfo && (
            <InfoWindow onCloseClick={() => props.onHideUserInfo(marker)}>
              <div className="marker-info-dialog">
                <img className="user-avatar" src={marker.avatar} alt={marker.full_name} style={{display: 'none'}}/>
                <p className="user-name">{marker.full_name} {marker.nickname !== '' ? `(${marker.nickname})` : ''}</p>
                <p className="user-contact">{marker.email} / {marker.phone_number}</p>
                <p className="user-work">{marker.career} / {marker.job_position}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </MarkerClusterer>
  </GoogleMap>
)))

class Profile extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      user: props.user,
      view: 'search',
      users: [],
      markers: []
    }

    this.findSomeone = this.findSomeone.bind(this)
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
  }

  findSomeone(e){
    console.log(e.target.value)
    const search_term = e.target.value
    if(search_term === ''){
      const req = request.get(`/users`)
      req.query({ format: 'json' })
      req.field('authenticity_token', $('meta[name="csrf-token"]').attr('content'))
      req.end((err, res)=>{
        console.log(err, res)
        if(res.statusCode === 200){
          this.setState({
            users: res.body.users,
            markers: res.body.users.map(user => {
              return _.assign({}, user, {showInfo: false, latitude: user.latitude+(Math.random()*0.001), longitude: user.longitude+(Math.random()*0.001)})
            })
          })
        }
      })
    }
    else{
      const req = request.get(`/users/find`)
      req.query({ format: 'json' , search_term})
      req.field('authenticity_token', $('meta[name="csrf-token"]').attr('content') )
      req.end((err, res)=>{
        console.log(err, res)
        if(res.statusCode === 200){
          this.setState({
            users: res.body.users,
            markers: res.body.users.map(user => {
              return _.assign({}, user, {showInfo: false, latitude: user.latitude+(Math.random()*0.001), longitude: user.longitude+(Math.random()*0.001)})
            })
          })
        }
        else{
        }
      })
    }
  }

  onViewChange(view){
    if(this.state.view !== 'table' && view === 'table'){
      const req = request.get(`/users`)
      req.query({ format: 'json' })
      req.field('authenticity_token', $('meta[name="csrf-token"]').attr('content'))
      req.end((err, res)=>{
        console.log(err, res)
        if(res.statusCode === 200){
          this.setState({
            users: res.body.users,
            markers: res.body.users.map(user => {
              return _.assign({}, user, {showInfo: false, latitude: user.latitude+(Math.random()*0.001), longitude: user.longitude+(Math.random()*0.001)})
            }),
            view
          })
        }
      })
    }
    else{
      this.setState({view})
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.view !== 'table' && this.state.view === 'table'){
      window.loadTable()
    }
  }

  componentDidMount(){
    const req = request.get(`/users`)
    req.query({ format: 'json' })
    req.field('authenticity_token', $('meta[name="csrf-token"]').attr('content'))
    req.end((err, res)=>{
      console.log(err, res)
      if(res.statusCode === 200){
        this.setState({
          users: res.body.users,
          markers: res.body.users.map(user => {
            return _.assign({}, user, {showInfo: false, latitude: user.latitude+(Math.random()*0.001), longitude: user.longitude+(Math.random()*0.001)})
          })
        })
      }
    })
  }

  handleMarkerClick(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return _.assign({}, marker, {showInfo: true})
        }
        return marker;
      }),
    });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return _.assign({}, marker, {showInfo: false})
        }
        return marker;
      }),
    });
  }

  render(){
    const { user, view, users, markers } = this.state

    return(
      <div>
        <div className="section profile-heading">
          <div className="columns">
            <div className="column is-2" style={{display: 'none'}}>
              <div className="image is-128x128 avatar">
                <img src={user.avatar} />
              </div>
            </div>
            <div className="column is-9 name">
              <p>
                <span className="title is-bold">
                  {user.full_name}
                  {user.nickname && <span className="title-nickname is-bold">{` (${user.nickname})`}</span> }
                </span>
              </p>
              <p className="tagline">{user.phone_number} / {user.email}</p>
              <p className="tagline">{user.career}</p>
              <p className="tagline">{user.job_position}</p>
              <div className="social-link">

              </div>
            </div>
            <div className="column is-2 followers has-text-centered" style={{display: 'none'}}>
              <p className="stat-key">Date of Birth</p>
              <p className="stat-val">03/Feb/1990</p>
            </div>
            <div className="column is-3 likes has-text-centered">
              <p className="stat-key">{user.city}</p>
              <p className="stat-val">{user.country}</p>
            </div>
          </div>
        </div>
        <div className="profile-options">
          <div className="tabs is-fullwidth">
            <ul>
              <li className={`link ${view === 'search' ? 'is-active' : ''}`}>
                <a onClick={(e) => this.onViewChange('search')}><span className="icon"><i className="fa fa-map-o"></i></span> <span>Map View</span></a>
              </li>
              <li className={`link ${view === 'table' ? 'is-active' : ''}`}>
                <a onClick={(e) => this.onViewChange('table')}><span className="icon"><i className="fa fa-table"></i></span> <span>Table View</span></a>
              </li>
              <li className={`link ${view === 'info' ? 'is-active' : ''}`} style={{display: 'none'}}>
                <a onClick={(e) => this.onViewChange('info')}><span className="icon"><i className="fa fa-sliders"></i></span> <span>My Info</span></a>
              </li>
            </ul>
          </div>
        </div>
        {view === 'search' &&
          <div>
            <div className="box">
              <nav className="level is-mobile">
                <div className="level-item">
                  <p className="subtitle is-5">
                    <strong>{users.length}</strong> matches
                  </p>
                </div>
                <div className="level-item">
                  <p className="control has-addons">
                    <input className="input" type="text" placeholder="Find someone" onChange={this.findSomeone} />
                  </p>
                </div>
              </nav>
            </div>
            <div className="columns is-multiline">
              <div className="column">
                <section className="panel">
                  <div className="panel-block" style={{height: '90vh'}}>
                    <SimpleMapExampleGoogleMap
                      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2petpKAnye_yjIjH7tg3yOCnCqUWI9mw"
                      loadingElement={<div>Loading...</div>}
                      containerElement={
                        <div style={{ height: `100%`, width: '100%' }} />
                      }
                      mapElement={
                        <div style={{ height: `100%`, width: '100%' }} />
                      }
                      markers={markers}
                      onShowUserInfo={this.handleMarkerClick}
                      onHideUserInfo={this.handleMarkerClose}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        }
        {view === 'table' &&
          <div>
            <div className="columns is-multiline">
              <div className="column">
                <section className="panel">
                  <div className="panel-block">
                    <table id="users-table" className="table">
                      <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Nickname</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Career</th>
                          <th>Job Title</th>
                          <th>City</th>
                          <th>Country</th>
                        </tr>
                      </thead>
                      <tfoot>
                        <tr>
                          <th>Full Name</th>
                          <th>Nickname</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          <th>Career</th>
                          <th>Job Title</th>
                          <th>City</th>
                          <th>Country</th>
                        </tr>
                      </tfoot>
                      <tbody>
                        {_.map(users, (user, i) => {
                          return(
                            <tr key={i}>
                              <td>{user.first_name} {user.middle_name} {user.last_name} {user.other_last_name}</td>
                              <td>{user.nickname}</td>
                              <td>{user.email}</td>
                              <td>{user.phone_number}</td>
                              <td>{user.career}</td>
                              <td>{user.job_position}</td>
                              <td>{user.city}</td>
                              <td>{user.country}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Profile
