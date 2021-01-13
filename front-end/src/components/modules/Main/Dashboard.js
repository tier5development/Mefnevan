import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fb_image:"",
      fb_name:"",
      fb_username:"",
      fb_id:"",
      fb_logged_id:""
    }
  }
  componentDidMount(){
    let fb_image=localStorage.getItem('fb_image');
    let fb_username=localStorage.getItem('fb_username');
    let fb_name=localStorage.getItem('fb_name');
    let fb_id=localStorage.getItem('fb_id');
    let fb_logged_id=localStorage.getItem('fb_logged_id');
    console.log("Image is",fb_image);
    console.log("Image is",fb_username);
    console.log("Image is",fb_id);
    console.log("Image is",fb_logged_id);
    
    this.setState({
      fb_image:fb_image,
      fb_username:fb_username,
      fb_name:fb_name,
      fb_id:fb_id,
      fb_logged_id:fb_id
    })
  }
    render() {
        return (
          <div className="">
          <div className="card card-primary card-outline">
              <div className="card-body box-profile">
                <div className="text-center">
                  <img className="profile-user-img img-fluid img-circle" src={this.state.fb_image} alt="User profile picture" />
                </div>

                <h3 className="profile-username text-center">{this.state.fb_name}</h3>

                <p className="text-muted text-center">{this.state.fb_username}</p>


                <ul className="list-group list-group-unbordered mb-3">
                  <li className="list-group-item">
                    <b>Followers</b> <a className="float-right">1,322</a>
                  </li>
                  <li className="list-group-item">
                    <b>Following</b> <a className="float-right">543</a>
                  </li>
                  <li className="list-group-item">
                    <b>Friends</b> <a className="float-right">13,287</a>
                  </li>
                </ul>

                <a href="#" className="btn btn-primary btn-block"><b>Follow</b></a>
              </div>
             
            </div>
          </div>
          
        );
    }
}
export default Dashboard;