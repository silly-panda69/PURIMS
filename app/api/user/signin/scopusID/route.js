import { NextResponse } from "next/server";
import { checkScopusID,checkUserID,fetchUser,insertScopusID} from "@/utils/mongo";

export async function POST(req){
    const {email,scopusID}=await req.json();
    console.log(email,scopusID);
    if(email && scopusID){
        //check if email is already registered
        const result=await fetchUser(email);
        if(result){
            //check if scopus ID is already registered or not and if user is verified or not
            if(result.verified){
                if(result.scopusID){
                    return NextResponse.json({msg: "You are registered already!",success: false});
                }else{
                    const response=await checkUserID(scopusID);
                    if(response===false){
                        //check if scopus ID exists in the database
                        const temp=await checkScopusID(scopusID);
                        if(temp){
                            const user=await insertScopusID(email,scopusID);
                            if(user){
                                return NextResponse.json({msg: "Successfully registered!",success: true});
                            }else{
                                return NextResponse.json({msg: "Error registering ID",success: false});
                            }
                        }else{
                            return NextResponse.json({msg: "Scopus ID doesn't exists!",success: false});
                        }
                    }else{
                        return NextResponse.json({msg: "Scopus ID is already registered!",success: false});
                    }
                }
            }else{
                return NextResponse.json({msg: "You are not verified",success: false});
            }
        }else{
            return NextResponse.json({msg: "You are not registered!",success: false});
        }
    }else{
        return NextResponse.json({msg: "Fields are empty",success: false});
    }
}