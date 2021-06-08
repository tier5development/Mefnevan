import React, { Component } from "react";
import logo from "../../../images/logo.svg";
import { NavLink } from "react-router-dom";
import FaceBookLogo from "../../../images/Path3.svg";
import MessenderLogo from "../../../images/Messanger.svg";
import  {OpenPoweredBy,OpenTier5Partnership,OpenFacebookLink,OpenMessengerLink,OpenSignupLink} from  '../../../helper/helper';
class footer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
      }
      
    componentDidMount(){
        console.log("I am In Header");
    }
    LinkHandler(option,event){
        event.preventDefault();
        if(option == "optOne"){
            OpenSignupLink();
        }
        if(option == "optTwo"){
            OpenPoweredBy();
        }
        if(option == "optThree"){
            OpenTier5Partnership();
        }
        if(option == "optFour"){
            OpenFacebookLink();
        }
        if(option == "optFive"){
            OpenMessengerLink();
        }
    }
    render() {
        return (

        <div className="footer">
        <p>Powered by <a  onClick={(event) => this.LinkHandler("optTwo",event)} href="#">Tier5</a> and the <a  onClick={(event) => this.LinkHandler("optThree",event)}  href="#">Tier5 Partnership</a></p>
        <a  onClick={(event) => this.LinkHandler("optFour",event)}  href="#"><img src={FaceBookLogo}/></a> <a  onClick={(event) => this.LinkHandler("optFive",event)} href="#"><img src={MessenderLogo}/></a>
        </div>
        )
    }
}
export default footer;