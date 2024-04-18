import { getAuthorsByDept } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function POST(req){
    const {dept}=await req.json();
    if(dept){
        const author=await getAuthorsByDept(dept);
        if(author){
            return NextResponse.json({author: author,success: true});
        }else{
            return NextResponse.json({success: false});
        }
    }else{
        return NextResponse.json({success: false});
    }
}