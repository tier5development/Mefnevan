import React, { Component} from "react";
import { Redirect, withRouter } from 'react-router-dom';
import Sidebar from "../Common/sidebar";
import {kyubiExtensionId}  from "../../../config";
import { NavLink } from "react-router-dom";
class messageGroup extends Component {
    render() {
        
        return ( <div className="wrapper">
                         <Sidebar  selectedtab="setting"></Sidebar>
                                <div className="content-wrapper">
                                <section className="content-header">
                                    <div className="container-fluid">
                                        <div className="row mb-12">
                                            <div className="col-sm-6">
                                            <h1>Message-Group</h1>
                                            
                                            <NavLink  to="/messagegroupcreate"  class="btn btn-app">
                                                <i class="fas fa-plus-square"></i> Create New Message-Group
                                            </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>    
                        </div>
                        );
            }
       }
export default messageGroup;