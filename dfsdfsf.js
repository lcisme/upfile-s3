// //delete file from s3 bucker
// exports.deleteFileFromS3 = (key,next) =>{
//     const deleteParams = {
//         Key:key,
//         ...constantParams
//     };
//     s3.deleteObject(deleteParams,(error,data)=>{

//         next(error,data);
//     });
// };
// router.delete("/deleteFile",(req,res)=>{
//     s3.deleteFileFromS3('horizontal_tagline_on_white_by_logaster.jpeg',(error,data)=>{
//         if(error){
//             return res.send({error:"Can not delete file, Please try again later"});
//         }
//         return res.send({message:"File has been deleted successfully"});
//     });
// });