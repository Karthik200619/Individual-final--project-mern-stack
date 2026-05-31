import { UserModel } from "../models/UserModel.js"
import {hash,compare} from 'bcryptjs'
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'
config()


export const authenticate =async({UserObj})=>{
    // check if plain password or not
    await UserModel(UserObj)
    // register the user if not plain password
    // hash password
    let hashedPassword=await hash(UserObj.password,12)
    // update the plain password
    UserObj.password=hashedPassword;
    UserObj.role='USER'
    // update in database
    let UserObjDoc = await UserModel(UserObj);
    let user=await UserObjDoc.save()
    user.toObject();
    return {user};
}
export const authenticatelogin = async({loginObj})=>{
    // check does any user exists with the login email
    const email = loginObj.email;
    console.log(loginObj)
    let user = await UserModel.findOne({email:email});
    console.log(user)
    if(user === null){
        const error = new Error('user not found ')
        error.status=401;
        throw error;
        return;
    }
    // check or compare password
    let isValidPass=await compare(loginObj.password,user.password);
    if(!isValidPass){
        const error = new Error('password not matched ')
        error.status=401;
        throw error;
        return;
    }
    // if matched then create a JWT token 
    let token=jwt.sign({id:user._id,email:user.email,role:user.role,firstname:user.firstname,lastname:user.lastname,profileImageUrl:user.profileImageUrl},process.env.JWT_SECRET,{expiresIn:'1h'})
    const userObj = user.toObject();
    delete userObj.password;
    return {user:userObj,token}
}