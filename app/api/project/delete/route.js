import { auth } from "@/app/auth";
import { getAuthor, removeUserProject } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function POST(req){
    const {id,auid}=await req.json();
    const author=await getAuthor(auid);
    const session=await auth();
    if((session?.user?.email && ((session?.role==="Admin") || (session?.scopusID===auid && session?.role==="Author") || (session?.deptID===author?.dept && (session?.role==="HOD" || session?.role==="Department"))))){
        const result=await removeUserProject(id);
        if(result){
            return NextResponse.json({msg: "The project was deleted successfully!",result: true});
        }else{
            return NextResponse.json({msg: "Error deleting the project!",result: false});
        }
    }else{
        return NextResponse.json({msg: "You are not authorized!",result: false});
    }
}