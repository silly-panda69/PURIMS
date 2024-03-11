import { askToken, checkUser} from "@/utils/mongo";
const bcrypt=require("bcryptjs");
import { NextResponse } from "next/server";

export async function POST(req){
    const {email}=await req.json();
    if(email){
        //check if the user exists
        const user=await checkUser(email);
        if(user===false){
            const otp="6969";
            const salt=await bcrypt.genSaltSync(10);
            const token=await bcrypt.hashSync(otp);
            const result=await askToken(email,token);
            if(result){
                return NextResponse.json({msg: "OTP send successfully!"})
            }else{
                return NextResponse.json({msg: "Error sending OTP!"})
            }
        }else{
            return NextResponse.json({msg: "You are not registered!"})
        }
    }else{
        return NextResponse.json({msg: "Error..."})
    }
}