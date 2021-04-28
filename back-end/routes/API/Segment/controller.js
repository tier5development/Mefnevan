
const MessageSegment    =   require('../../../models/repositories/messagesegment.repository');
const MessageGroup  =   require('../../../models/repositories/messagegroup.repository');
module.exports.createSegment = async (req, res) => {
    try {
        let mess="";
        let code=1;
        let messageSegment = [];
        //console.log("This is my sent",req.body);
        
        if(req.body.message_segment_name !="" && req.body.user_id !=""  && req.body.message_segments_block !=""){
            let payload ={
                user_id:req.body.user_id,
                title:req.body.message_segment_name,
                message_blocks:req.body.message_segments_block
            }
            await MessageSegment.CreateMessageSegment(payload).then(async result=>{
                messageSegment=await MessageSegment.GetAllMessageSegment(req.body.user_id);
                mess="Segments Created Successfully";
                code=1;
            }).catch(error=>{
                mess=error.message;
                code=2;
            });
            
            
            
            console.log("This is my GetAllMessageSegment",messageSegment);
        }else{
            mess="Segments Create UnSuccessfull Due To Input";
            code=2;
        }
        
        //console.log("This is my message",mess);
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.listSegment  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        let messageSegment = [];
        if(req.body.user_id !=""  ){
            messageSegment=await MessageSegment.GetAllMessageSegment(req.body.user_id);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.editSegment  =   async   (req,   res)    =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.segment_id !=""  ){
            messageSegment=await MessageSegment.GetMessageSegment(req.body.segment_id);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.updateSegment  = async   (req    ,res)   =>  {
    try{
        let mess="";
        let code=1;
        if(req.body.sagment_id_edit !=""  ){
            let payload ={
                title:req.body.message_segment_name,
                message_blocks:req.body.message_segments_block
            }
            let updateMessageSegment=await MessageSegment.updateMessageSegmentById(payload,req.body.sagment_id_edit);
            messageSegment=await MessageSegment.GetAllMessageSegment(req.body.user_id);
            //messageSegment=await MessageSegment.GetMessageSegment(req.body.sagment_id_edit);
            mess="Segments List Successfully";
            code=1;
        }else{
            mess="Segments List Un-Successfully";
            code=2;
        }
        res.send({
            code: code,
            message: mess,
            payload: messageSegment
        })    
    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}
module.exports.deleteSegment    =   async   (req,   res)    =>  {
    try{
        //console.log("This is my sent",req.body);
        let AllGroupassociate=[];
        let countt =0;
        let GetMessageGroup=await MessageGroup.GetAllMessageGroup(req.body.user_id).then(async AllGroup =>{
            console.log("The Groups are",AllGroup);
            
            await AllGroup.map(async EachGroup=>{
                EachGroup.associate_blocks.map(async  Eachblocks=>{
                    console.log("The Blocks are",Eachblocks);
                    Eachblocks.map(async eachone=>{
                        //console.log("The One are",eachone);
                        if(eachone.type =="id"  && eachone.value == req.body.segment_id){
                            
                            countt=countt+1;
                        }
                    })
                })
            })

        }).catch(error =>{
            res.send({
                code: 3,
                message: error.message,
                payload: error
            })
        });
        if(countt!=0){
            res.send({
                code: 2,
                message: "This Segment is Used in "+countt+" Blocks of Group. Please remove them first to delete  it",
                payload: {}
            }) 
        }else{
            let DeleteSegments=await MessageSegment.DeleteSegments(req.body.segment_id);
            res.send({
                code: 1,
                message: "Segment is deleted successfully",
                payload: {}
            }) 
        }
        

    } catch (error) {
        res.send({
            code: 3,
            message: error.message,
            payload: error
        })
    }
}