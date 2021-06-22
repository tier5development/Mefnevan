import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import  {OpenFacebookInTab,CheckUserInfoFromFaccebook,OpenFacebookProfileInTab} from  '../../../helper/helper'
import Header from "../Common/header";
import Footer from "../Common/footer";
import settingService from "../../../services/setting";
import AuthServices from "../../../services/authService";
import biglogo from "../../../images/biglogo.svg";
import RefreshLogo from "../../../images/layer1.svg";
import FaceBookLogo from "../../../images/fb_blue.svg";
import IconLogo from "../../../images/icon.svg";
import LoaderLogo from "../../../images/Loader.gif";
import * as authAction from '../../../store/actions/Auth/authAction';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fb_image:"",
      fb_name:"XXXXX",
      fb_username:"",
      fb_id:"",
      fb_logged_id:"",
      autoresponder:"0",
      default_message:"0",
      loader:true,
      is_user_logged_in_facebook:"false"
    }
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
  autoresponderHandler  = async (event) =>{
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
      let createStatePayload = [];
      createStatePayload['UserName']=localStorage.getItem('fb_username');
      createStatePayload['UserImage']=localStorage.getItem('fb_image');
      createStatePayload['UserLoginFacebook']=localStorage.getItem('fb_logged_id');
      createStatePayload['UserAutoResponder']=localStorage.getItem('autoresponder');
      createStatePayload['UserDefaultMessage']=localStorage.getItem('default_message');
      
      this.props.setProfileInfo(createStatePayload);
      this.setState({
        fb_image:fb_image,
        fb_username:fb_username,
        fb_name:fb_name,
        fb_id:fb_id,
        is_user_logged_in_facebook:localStorage.getItem('fb_logged_id'),
        loader:false
      })

    }, 4000);
  }
  componentDidMount(){
    let  params ={
      user_rec    :   localStorage.getItem('kyubi_user_token')
      };
      AuthServices.userRetrive(params).then(result=>{
        console.log("This I got From backGround SUSSSSS",result);
        if(result.data.code==1){
                  let responsenewvalue =result.data;
                  let UserName=responsenewvalue.payload.UserInfo.facebook_name;
                  let UserImage=responsenewvalue.payload.UserInfo.facebook_image;
                  let UserLoginFacebook=localStorage.getItem('fb_logged_id');
                  let UserAutoResponder=0;
                  let UserDefaultMessage=0;
                  localStorage.setItem('kyubi_user_token', responsenewvalue.payload.UserInfo.kyubi_user_token);
                  localStorage.setItem('user_id', responsenewvalue.payload.UserInfo.user_id);
                  localStorage.setItem('fb_id', responsenewvalue.payload.UserInfo.facebook_fbid);
                  localStorage.setItem('fb_username', responsenewvalue.payload.UserInfo.facebook_name);
                  localStorage.setItem('fb_name', responsenewvalue.payload.UserInfo.facebook_profile_name);
                  localStorage.setItem('fb_image', responsenewvalue.payload.UserInfo.facebook_image);
                  
                  if(responsenewvalue.payload.UserSettings.default_message){
                    localStorage.setItem('default_message', responsenewvalue.payload.UserSettings.default_message);
                  }else{
                    localStorage.setItem('default_message', 0);
                  }
                  if(responsenewvalue.payload.UserSettings.default_message_text){
                    localStorage.setItem('default_message_text', responsenewvalue.payload.UserSettings.default_message_text);
                    UserDefaultMessage=1;
                  }else{
                    localStorage.setItem('default_message_text',"");
                  }
                  if(responsenewvalue.payload.UserSettings.autoresponder){
                    localStorage.setItem('autoresponder', responsenewvalue.payload.UserSettings.autoresponder);
                    UserAutoResponder=1;
                  }else{
                    localStorage.setItem('autoresponder', 0);
                  }
                  if(responsenewvalue.payload.UserSettings.default_time_delay){
                    localStorage.setItem('default_time_delay', responsenewvalue.payload.UserSettings.default_time_delay);
                  }
                  
                  localStorage.setItem('keywordsTally', JSON.stringify(responsenewvalue.payload.AutoResponderKeywords));
                  this.setState({
                        fb_image:localStorage.getItem('fb_image'),
                        fb_name:localStorage.getItem('fb_name'),
                        fb_username:localStorage.getItem('fb_username'),
                        is_user_logged_in_facebook:localStorage.getItem('fb_logged_id'),
                        loader:false
                  })
                  // let createStatePayload = [{
                  // UserName:UserName,
                  // UserImage:UserImage,
                  // UserLoginFacebook:UserLoginFacebook,
                  // UserAutoResponder:UserAutoResponder,
                  // UserDefaultMessage:UserDefaultMessage
                  // }];
                  let createStatePayload = [];
                  createStatePayload['UserName']=UserName;
                  createStatePayload['UserImage']=UserImage;
                  createStatePayload['UserLoginFacebook']=UserLoginFacebook;
                  createStatePayload['UserAutoResponder']=UserAutoResponder;
                  createStatePayload['UserDefaultMessage']=UserDefaultMessage;
                  
                  this.props.setProfileInfo(createStatePayload);
                  
        }else{
          // let createStatePayload = [{
          //   UserName:localStorage.getItem('fb_username'),
          //   UserImage:localStorage.getItem('fb_image'),
          //   UserLoginFacebook:localStorage.getItem('fb_logged_id'),
          //   UserAutoResponder:localStorage.getItem('autoresponder'),
          //   UserDefaultMessage:localStorage.getItem('default_message')
          //   }];
          let createStatePayload = [];
          createStatePayload['UserName']=localStorage.getItem('fb_username');
          createStatePayload['UserImage']=localStorage.getItem('fb_image');
          createStatePayload['UserLoginFacebook']=localStorage.getItem('fb_logged_id');
          createStatePayload['UserAutoResponder']=localStorage.getItem('autoresponder');
          createStatePayload['UserDefaultMessage']=localStorage.getItem('default_message');
          // let NewCreateStatePayload = JSON.stringify(createStatePayload);

          this.props.setProfileInfo(createStatePayload);
          this.setState({
            fb_image:localStorage.getItem('fb_image'),
            fb_name:localStorage.getItem('fb_name'),
            fb_username:localStorage.getItem('fb_username'),
            is_user_logged_in_facebook:localStorage.getItem('fb_logged_id'),
            loader:false
          })
        }
        
      }).catch(error=>{
        console.log("This I got From backGround EROOOOOO",error);
      })
      localStorage.setItem("redux",this.props.ProfileInfo.profileInfo);
  }
    render() {
        return (
          <div>
            {this.state.loader && (   
                <div className="after_login_refresh"><img src={process.kyubi.loader.preLoader} alt=""/></div>
            )}
            <div className="dashboard">
              <Header selectedtab="dashboard"></Header>

              <div className="after_log_profile">
                <img src={this.state.fb_image} alt=""/>
                <p>Welcome</p>
                <h3>{this.state.fb_username}</h3>
              </div>
              <div className="fb_login_request">
                {this.props.ProfileInfo.profileInfo["UserLoginFacebook"] == "true" ?
                "" 
                :
                <div className="login_caution">
                  <img src={IconLogo} alt=""/>
                  Please login to your Facebook profile and click the refresh button below to proceed further.
                </div>
                }
                
                <a onClick={this.refreshHandler}  href="#" className="bluebtn"><img src={RefreshLogo} alt=""/> Refresh</a>
                <a  onClick={this.fbHandler} href="#" className="whitebtn"><img src={FaceBookLogo} alt=""/> Facebook</a>
              </div>
              <Footer></Footer>
            </div>
          </div>
        );
    }
}
/**
 * @mapStateToProps
 * grab the values from redux store
 */
 const mapStateToProps = state => {
  return {
    ProfileInfo: state.auth.payload
  };
};
/**
* @mapDispatchToProps 
* sending the values to redux store
*/

const mapDispatchToProps = (dispatch) => {
  return {
      setProfileInfo: (load) => dispatch(authAction.addProfileInfo(load))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));