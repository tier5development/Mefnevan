import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../Auth/login.css";
import "./setting.css";
import SettingServices from "../../../services/setting";
import Sidebar from "../Common/sidebar";
import  {CheckUserInfoFromFaccebook} from  '../../../helper/helper'
class setting extends Component {
    constructor(props) {
      super(props)
      this.state = {
        defaultmessage:0,
        default_time_delay:0,
        default_message_text:"",
        autoresponder: 0,
        loader:true
      }
    }
    /**
    * @inputChangeHandller 
    * getting input field values
    */
    inputChangeHandller = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    
    autoSetting = () => {
        console.log("hiyy",this.state.defaultmessage )
        if(this.state.defaultmessage === 0){
            this.setState({defaultmessage:1})
        }else{
            this.setState({defaultmessage:0})
        }
    }

    autoRespoSetting = () => {
        console.log("hiyy",this.state.autoresponder )
        if(this.state.autoresponder === 0){
            this.setState({autoresponder:1})
        }else{
            this.setState({autoresponder:0})
        }
    }
    /**
    * @handleLoginFormValidation 
    * email and password field blank validation
    */
    /**
     * @insertTagAtCursorForWelcomeMessage
     * in this function we are managing the tag in welcome message area
    */
    insertTagAtCursorForWelcomeMessage(areaId, text) {
        var txtarea = document.getElementById(areaId);
        if (!txtarea) {
        return;
        }
        // if (txtarea.value.length < 188) {
        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false));
        if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart('character', -txtarea.value.length);
        strPos = range.text.length;
        } else if (br == "ff") {
        strPos = txtarea.selectionStart;
        }
        var front = (txtarea.value).substring(0, strPos);
        var back = (txtarea.value).substring(strPos, txtarea.value.length);
        txtarea.value = front + text + back;
        strPos = strPos + text.length;
        let WelcomeMessage = txtarea.value;
        WelcomeMessage = WelcomeMessage.replace(/{first_name}/g, "");
        WelcomeMessage = WelcomeMessage.replace(/{last_name}/g, "");
        WelcomeMessage = WelcomeMessage.replace(/{date}/g, "");
        WelcomeMessage = WelcomeMessage.replace(/{date_time}/g, "");
        //console.log("This is the message ========",WelcomeMessage);
        this.setState({ default_message_text: txtarea.value});
        // this.setState({ welcomeContent: txtarea.value, welcomeTextLengthCount: txtarea.value });
        if (br == "ie") {
        txtarea.focus();
        var ieRange = document.selection.createRange();
        ieRange.moveStart('character', -txtarea.value.length);
        ieRange.moveStart('character', strPos);
        ieRange.moveEnd('character', 0);
        ieRange.select();
        } else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
        // }
    }
    handleFormValidation() {
        let payload = {
            defaultmessage: this.state.defaultmessage,
            default_time_delay: this.state.default_time_delay,
            default_message_text: this.state.default_message_text,
            autoresponder:this.state.autoresponder,
            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        let formIsValid = true;
        if(payload["defaultmessage"] ===  1){
            console.log("Ya Ya Ya Ya");
            if(isNaN(payload["default_time_delay"])){
             console.log("Is not a number");
             return false;
            }else if(payload["default_message_text"]){
                console.log("Is have no test");
             return false;
            }
            else{
                return true;
            }
        }
    }
    submitHandler = async (event) => {
        this.setState({loader:true});
        event.preventDefault();        
        let payload = {
            defaultmessage: this.state.defaultmessage,
            default_time_delay: this.state.default_time_delay,
            default_message_text: this.state.default_message_text,
            autoresponder:this.state.autoresponder,
            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        console.log("This are payload",payload);
        await SettingServices.setSetting(payload).then(async result=>{
            console.log("Setttttttttttttttttttttt",result);
            if(result.data.code==1){
                let responsenewvalue =result.data;
                console.log("Autoresponder  is ------------",responsenewvalue.payload.UserSettings.autoresponder);
                 this.setState({loader:false});
                if(responsenewvalue.payload.UserSettings.autoresponder === 1){
                    localStorage.setItem('autoresponder',responsenewvalue.payload.UserSettings.autoresponder);
                    localStorage.setItem('default_message',responsenewvalue.payload.UserSettings.default_message);
                    CheckUserInfoFromFaccebook();
                }else{
                    localStorage.setItem('autoresponder',responsenewvalue.payload.UserSettings.autoresponder);
                    localStorage.setItem('default_message',responsenewvalue.payload.UserSettings.default_message);
                    localStorage.setItem('profileFetch',0);
                    localStorage.setItem('messageListFetch',0);
                    localStorage.setItem('individualMessageFetch',0);
                }
              }else{
                this.setState({loader:false});  
              }            
        }).catch(error=>{
            console.log(error);
            this.setState({loader:false});
        });
    }
    
    componentDidMount(){
        let payload = {
            kyubi_user_token:localStorage.getItem("kyubi_user_token")
        }
        SettingServices.getSetting(payload).then(async result=>{
            console.log(result);
            if(result.data.code===1){
                this.setState({
                    defaultmessage:result.data.payload.default_message,
                    default_time_delay:result.data.payload.default_time_delay,
                    default_message_text:result.data.payload.default_message_text,
                    autoresponder: result.data.payload.autoresponder,
                    loader:false
                })
            }else{
                this.setState({loader:false});
            }
            //console.log(result);
        }).catch(error=>{
            //console.log(error);
            this.setState({loader:false});
        }); 
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
                        <Sidebar  selectedtab="setting"></Sidebar>
                        <div className="content-wrapper">
                        <section className="content-header">
                            <div className="container-fluid">
                                <div className="row mb-12">
                                    <div className="col-sm-6">
                                    <h1>Settings</h1>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                    
                                    <div className="card card-primary">
                                        <div className="card-header">
                                            <h3 className="card-title">Settings
                                            
                                            </h3>
                                        </div>
                                        <form>
                                        <div className="card-body">
                                            

                                            <div className="form-group clearfix">
                                                <div className="icheck-success d-inline">
                                                {this.state.defaultmessage ?  
                                                    <input type="checkbox" id="checkboxPrimary3" name="defaultmessage" onChange={this.autoSetting} checked/>
                                                    :
                                                    <input type="checkbox" id="checkboxPrimary3" name="defaultmessage" onChange={this.autoSetting} />
                                                }  
                                                <label for="checkboxPrimary3">
                                                    Activate Default Message
                                                </label>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label for="exampleInputEmail1">Default  Message</label>
                                                <textarea id="default_message_text" value={this.state.default_message_text} onChange={this.inputChangeHandller} className="form-control" rows="3" name="default_message_text" placeholder="Enter ..."></textarea>
                                                    <div className="welcomeMessageTags">
                                                    <button type="button" className="btn btn-outline-info btn-sm TagButton" onClick={() => this.insertTagAtCursorForWelcomeMessage('default_message_text', '{first_name}')}>First Name</button>
                                                    <button type="button" className="btn btn-outline-info btn-sm TagButton" onClick={() => this.insertTagAtCursorForWelcomeMessage('default_message_text', '{last_name}')}>Last Name</button>
                                                    <button type="button" className="btn btn-outline-info btn-sm TagButton" onClick={() => this.insertTagAtCursorForWelcomeMessage('default_message_text', '{date}')}>Todays Date</button>
                                                    <button type="button" className="btn btn-outline-info btn-sm TagButton" onClick={() => this.insertTagAtCursorForWelcomeMessage('default_message_text', '{date_time}')}>Todays Date & Time</button>
                                                    </div>
                                            </div>
                                            
                                            <div className="bootstrap-timepicker">
                                                <div className="form-group">
                                                    <label>Time Interval For Default Message:</label>
                                                        <div className="input-group date" id="timepicker" data-target-input="nearest">
                                                            <input type="number" onChange={this.inputChangeHandller} className="form-control datetimepicker-input" name="default_time_delay"  value={this.state.default_time_delay} data-target="#timepicker"/>
                                                            <div className="input-group-append" data-target="#timepicker" data-toggle="datetimepicker">
                                                                <div className="input-group-text">
                                                                    <i className="far fa-clock"></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="form-group clearfix">
                                            <div className="icheck-success d-inline">
                                            {this.state.autoresponder ?  
                                                <input type="checkbox" id="checkboxPrimary2" name="autoresponder" onChange={this.autoRespoSetting} checked/>
                                                :
                                                <input type="checkbox" id="checkboxPrimary2" name="autoresponder" onChange={this.autoRespoSetting} />
                                            }  
                                            <label for="checkboxPrimary2">
                                                Activate Auto-Responder
                                            </label>
                                            </div>
                                        </div>
                                        </div>           
                                        <div className="card-footer">
                                        <button type="submit" className="btn btn-primary"  onClick={this.submitHandler} >Submit</button>
                                        </div>
                                        </form>
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

export default setting;