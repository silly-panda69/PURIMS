import { insertToken,insertUser,checkUser } from "@/utils/mongo";
import { NextResponse } from "next/server";
const bcrypt=require("bcryptjs");
const nodemailer=require('nodemailer');

export async function POST(req){
    const {email,password}=await req.json();
    if(email && password){
        //check if email is already registered
        const result=await checkUser(email);
        if(result){
            //insert the credentials with verified false and created at
            const salt=await bcrypt.genSaltSync(10);
            const hashPassword=await bcrypt.hashSync(password,salt);
            const user=await insertUser(email,hashPassword);
            if(user){
                const otp="1234";
                const hashOtp=await bcrypt.hashSync(otp,salt);
                const verify=await insertToken(email,hashOtp);
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
                return NextResponse.json({msg: "Registered successfully!",success: true});
            }else{
                return NextResponse.json({msg: "Error signing up!",success: false});
            }
        }else{
            return NextResponse.json({msg: "You are already registered!",success: false});
        }
    }else{
        return NextResponse.json({msg: "Fields are empty",success: false});
    }
}