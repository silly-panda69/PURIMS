import { askToken, checkUser} from "@/utils/mongo";
const bcrypt=require("bcryptjs");
import { NextResponse } from "next/server";
import {authenticator, hotp } from "otplib";
const nodemailer=require('nodemailer');

export async function POST(req){
    const {email}=await req.json();
    if(email){
        //check if the user exists
        const user=await checkUser(email);
        if(user===false){
            authenticator.options={digits: 4};
            hotp.options={digits: 4};
            const date=new Date();
            const custom=email+date;
            const otp=hotp.generate(custom,10);
            const salt=await bcrypt.genSaltSync(10);
            const token=await bcrypt.hashSync(otp);
            const result=await askToken(email,token);
            if(result){
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                      user: "uietpu092@gmail.com",
                      pass: "kqfnznxjosmfvyva",
                    },
                  });
                const info = await transporter.sendMail({
                    from: "uietpu092@gmail.com",
                    to: email,
                    subject: "Hello ✔",
                    text: otp,
                    html: `<b>Hello world? ${otp} </b>`, 
                  });
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