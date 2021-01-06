import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom'
import "./login.css";
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
          email:"",
          password:"",
          loader:false,
          error:false,
          errorMessage:""
        }
        

      }
      /**
    * @inputChangeHandller 
    * getting input field values
    */
    inputChangeHandller = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    /**
    * @handleLoginFormValidation 
    * email and password field blank validation
    */
    handleLoginFormValidation() {
        let fields = {
        email: this.state.email,
        password: this.state.password,
        };
        
        let formIsValid = true;
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let checkResult = emailRegex.test(String(this.state.email).toLowerCase());
        if (!fields["email"]) {
        formIsValid = false;
        this.setState({errorMessage:"Email Is Required"});
        return formIsValid;
        } else if (checkResult === false) {
        formIsValid = false;
        this.setState({errorMessage:"Please enter a proper email"});
        return formIsValid;
        }
        else if (!fields["password"]) {
        formIsValid = false;
        this.setState({errorMessage:"Password Is Required"});
        return formIsValid;
        }else{
            formIsValid = true;
            return formIsValid;
        }
        
        return formIsValid;
    }
     /**
    * @loginHandler 
    * in this function we are checking the email id, password
    * and if the details are correct then login them and also take care about the remember password one
    */
  loginHandler = (event) => {
    event.preventDefault();
    event.preventDefault();
    this.setState({ loader: true });
    let payload = {
      email: this.state.email,
      password: this.state.password,
    }
    if (this.handleLoginFormValidation()) {
        this.setState({ error:false});
        this.setState({errorMessage:""});
    }else{
        this.setState({ error:true});

    }
    this.setState({ loader: false });
  }
    render() {
        return (
        <div>
        {this.state.loader && (   
        <div className="overlay">
            <i className="fas fa-2x fa-sync-alt fa-spin"></i>
        </div>
        )}
        
        
        <div className="login-html">
            <p className="login-box-msg">Sign In</p>
            <form>
                <div className="input-group mb-3">
                    <input 
                    className="form-control" 
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    onChange={this.inputChangeHandller}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <span className="fas fa-envelope"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input 
                    type="password" 
                    class="form-control"
                    placeholder="**********"
                    name="password"
                    id="password"
                    onChange={this.inputChangeHandller}
                    />
                    <div className="input-group-append">
                        <div className="input-group-text">
                            <span className="fas fa-lock"></span>
                        </div>
                    </div>
                </div>
                <div className="row"> 
                {this.state.error && ( 
                <p class="text-danger">{this.state.errorMessage}</p> 
                )}             
                    <div class="col-12">
                        <button 
                        type="button" 
                        className="btn btn-primary btn-block"
                        onClick={this.loginHandler}
                        >Sign In</button>
                    </div>
                </div>
            </form>
        </div>
        </div>
        );
    }
}
export default Login;