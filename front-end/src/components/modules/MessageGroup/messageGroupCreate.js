import React, { Component } from "react";
import Sidebar from "../Common/sidebar";
class messageGroupCreate extends Component {

    createMessageGroupHandler =  (event) =>{
        this.props.history.push('/messageGroup');
    }

    render() {
        return ( <div className="wrapper">
                    <Sidebar  selectedtab="setting"></Sidebar>
                        <div className="content-wrapper">
                            <section className="content-header">
                                <div className="container-fluid">
                                    <div className="row mb-12">
                                        <div className="col-sm-6">
                                        <h1>Message-Group</h1>
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
                                                <h3 className="card-title"> Create Message-Group</h3>
                                            </div>
                                            <form>
                                            <div className="card-body">
                                                
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Message-Group Name</label>
                                                    <input type="text"
                                                        name="auto_responder_name" 
                                                        className="form-control" 
                                                        id="exampleInputEmail1" 
                                                        placeholder="Message-Group Name" 
                                                        value=""
                                                        onChange=""
                                                    />
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label for="exampleInputEmail1">Message-Group Description</label>
                                                    <textarea 
                                                    name="auto_responder_keywords" 
                                                    className="form-control" 
                                                    rows="3"
                                                    placeholder="Message-Group Description"
                                                    value=""
                                                    onChange=""
                                                    ></textarea>
                                                </div>
                                                </div>           
                                            <div className="card-footer">
                                            <button type="submit" className="btn btn-primary" onClick={this.createMessageGroupHandler} >Submit</button>
                                            </div>
                                            </form>
                                        </div>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>);
    }

}
export default messageGroupCreate;