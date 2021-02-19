import axios from 'axios';
import { host,kyubi } from '../config';
const messageGroupService = {
   
    createMessageGroup: function (payload) {
        let allItems = [];
        let messageGroupItems = JSON.parse(localStorage.getItem("groupitems"));
        if(messageGroupItems)
        { 
          allItems =  messageGroupItems;
          allItems.unshift(payload); 
        }
        else{
          console.log('first time'); 
          allItems.unshift(payload);
        }
        localStorage.setItem("groupitems",JSON.stringify(allItems));
        return true;
    },
    updateMessageGroup: function (payload) {
      
      let messageGroupId = payload.message_group_id;
      let allItems = JSON.parse(localStorage.getItem("groupitems"));
      let itemToEdit = JSON.parse(localStorage.getItem("groupitems"))[messageGroupId];
     
      itemToEdit.message_group_name = payload.message_group_name;
      itemToEdit.message_group_description = payload.message_group_description;
      allItems[messageGroupId] = itemToEdit;
      
      localStorage.setItem("groupitems",JSON.stringify(allItems));
      return true;
      
  },
  deleteMessageGroup: function (payload) {
      
    let messageGroupId = payload.message_group_id;
    let allItems = JSON.parse(localStorage.getItem("groupitems"));
    allItems.splice(messageGroupId, 1);
    console.log(allItems);
    localStorage.setItem("groupitems",JSON.stringify(allItems));
    return true;
   
    
}

}
export default messageGroupService;