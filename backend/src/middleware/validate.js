import { statusCode } from "../constant/constants.js"

export const validate=(schema,property="body")=>{
 return (req,res,next)=>{
    const {error,value} = schema.validate(req[property],{
        abortEarly:false,
        allowUnknown:false,
    })

    if(error){
        return res.status(statusCode.BAD_REQUEST).json({
            message:error.details.map((d)=>d.message)
        })
    }

    req[property]=value;
    next();
 }
}