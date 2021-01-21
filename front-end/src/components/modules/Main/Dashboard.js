import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import  {OpenFacebookInTab,CheckUserInfoFromFaccebook,OpenFacebookProfileInTab} from  '../../../helper/helper'
import Sidebar from "../Common/sidebar"
class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fb_image:"",
      fb_name:"",
      fb_username:"",
      fb_id:"",
      fb_logged_id:"",
      shownavbar:false,
      loader:true
    }
  }
  ShowMenu = (event) => {
    event.preventDefault();
    
    this.setState({
      shownavbar:true
    })
  }
  fbHandler = async (event) => {
    event.preventDefault();
    let fb_logged_id=localStorage.getItem('fb_logged_id');
    console.log("You Are Loged in",fb_logged_id);
    if(fb_logged_id === "false"){
      OpenFacebookInTab();
    }else{
      OpenFacebookProfileInTab();
    }
  }
  refreshHandler  = async (event) =>  {
    event.preventDefault();
    this.setState({
      loader:true
    })
    CheckUserInfoFromFaccebook();
    setTimeout(() => {
      let fb_image=localStorage.getItem('fb_image');
      let fb_username=localStorage.getItem('fb_username');
      let fb_name=localStorage.getItem('fb_name');
      let fb_id=localStorage.getItem('fb_id');
      let fb_logged_id=localStorage.getItem('fb_logged_id');
      this.setState({
        fb_image:fb_image,
        fb_username:fb_username,
        fb_name:fb_name,
        fb_id:fb_id,
        fb_logged_id:fb_logged_id,
        loader:false
      })

    }, 4000);
  }
  componentDidMount(){
    setTimeout(() => {
      let fb_image=localStorage.getItem('fb_image');
      let fb_username=localStorage.getItem('fb_username');
      let fb_name=localStorage.getItem('fb_name');
      let fb_id=localStorage.getItem('fb_id');
      let fb_logged_id=localStorage.getItem('fb_logged_id');
    console.log("Yo Are Loged in",fb_logged_id);
      this.setState({
        fb_image:fb_image,
        fb_username:fb_username,
        fb_name:fb_name,
        fb_id:fb_id,
        fb_logged_id:fb_logged_id,
        loader:false
      })

    }, 3000);
    
  }
    render() {
        return (

          
          <div className="wrapper">
            {this.state.loader ?   
                <div className="overlay">
                <i className="fas fa-2x fa-sync fa-spin"> </i>
                
                
                <p className="text-success lodclass">Loading ........</p>
                </div>
            :
            <div>
                <Sidebar  selectedtab="dashboard"></Sidebar>
                <div className="content-wrapper">
                  <section className="content-header">
                    <div className="container-fluid">
                      <div className="row mb-12">
                        <div className="col-sm-6">
                          <h1>Dashboard</h1>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="content">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="card card-primary card-outline">
                            <div className="card-body box-profile">
                              <div className="text-center">
                                <img className="profile-user-img img-fluid img-circle" src={this.state.fb_image} alt="User profile picture" />
                              </div>
                              <h3 className="profile-username text-center">{this.state.fb_name}</h3>
                              <p className="text-muted text-center">{this.state.fb_username}</p>
                              <ul className="list-group list-group-unbordered mb-3">
                              {this.state.fb_logged_id==="true" ? 
                                ""
                                :
                                <li className="list-group-item">
                                <div className="card-body">
                                  <div className="callout callout-danger">
                                      <div className="ribbon-wrapper">
                                        <div className="ribbon bg-danger">
                                          Warning
                                        </div>
                                      </div>
                                      <h5>Warning!</h5>
                                      <p>Please Log-in to your Facebook   profile and click the refresh button below to proceed further.</p>
                                  </div>
                                </div>
                                </li>
                                
                              }
                                <li className="list-group-item">
                                <a onClick={this.refreshHandler} className="btn btn-warning btn-block"><i class="fas fa-sync"></i> Refresh</a>
                                </li>
                                
                              </ul>
                              <a onClick={this.fbHandler} className="btn btn-primary btn-block"><i class="fab fa-facebook-square"></i><b>
                              {this.state.fb_logged_id==="true" ? 
                                " Your Profile"
                                :
                                " Facebook"
                              }
                                
                                
                                </b></a>
                              
                            </div>           
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>        
            </div>  
          }

            
            
          </div>
          
        );
    }
}
export default Dashboard;