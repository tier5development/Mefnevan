import React, { Component } from 'react'

class MessageSegment extends Component {
constructor(props){
    super(props)
    this.state={
        firstname:null,
        lastname:null
    }
}
// handleFirstname=(event)=>{
// this.setState({
// firstname:event.target.value
// })
// }
// handleLastname=(event)=>{
// this.setState({
// lastname:event.target.value
// })
// }
    /**
    * @inputChangeHandller 
    * getting input field values
    */
inputChangeHandller = (event) => {
    this.setState({ [event.target.name]: event.target.value })
}
getData = async (event) => {
event.preventDefault();
console.log("My First Name",this.state.firstname);
console.log("My Last Name",this.state.lastname);
}
render() {
return (
<div>
<form>
<label>First Name</label>
<input type="text" value={this.state.firstname} name="firstname" onChange={this.inputChangeHandller} />

        <label>Last Name</label>
        <input type="text" value={this.state.lastname} name="lastname" onChange={this.inputChangeHandller} />

        <button onClick={this.getData}>submit</button>
        </form>
         </div>
    )
}
}

export default MessageSegment;