import { fetchUser } from "@/utils/mongo";
import { NextResponse } from "next/server";
const bcrypt=require("bcryptjs");

export async function POST(req){
    const {email,password}=await req.json();
    if(email && password){
        const user=await fetchUser(email);
        if(user?.email && user?.password){
            if(user?.email===email){
                const isMatch=await bcrypt.compareSync(password,user.password);
                if(isMatch){
                    if(!user?.verified){
                        return NextResponse.json({code: 102});
                    }else if(user?.verified && !user?.scopusID){
                        return NextResponse.json({code: 141});
                    }
                }else{
                    return NextResponse.json({code: 133})
                }
            }else{
                return NextResponse.json({code: 133})
            }
        }else{
            return NextResponse.json({code: 133})
        }
    }else{
        return NextResponse.json({code: 133})
    }
}