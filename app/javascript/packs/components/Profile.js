import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import request from 'superagent'
import _ from 'lodash'

class Profile extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      user: props.user,
      view: 'search',
      users: [],
    }

    this.findSomeone = this.findSomeone.bind(this)
  }

  findSomeone(e){
    console.log(e.target.value)
    const search_term = e.target.value
    if(search_term === ''){
      this.setState({
        users: []
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
            users: res.body.users
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
      $('#users-table').DataTable()
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
          users: res.body.users
        })
      }
    })
  }

  render(){
    const { user, view, users } = this.state

    return(
      <div>
        <div className="section profile-heading">
          <div className="columns">
            <div className="column is-2">
              <div className="image is-128x128 avatar">
                <img src={user.avatar} />
              </div>
            </div>
            <div className="column is-7 name">
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
              <nav className="level is-tablet">
                <div className="level-left">
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
                </div>
                <div className="level-right">
                  <p className="level-item"><strong>Name</strong></p>
                  <p className="level-item"><a>City</a></p>
                  <p className="level-item"><a>Country</a></p>
                </div>
              </nav>
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
