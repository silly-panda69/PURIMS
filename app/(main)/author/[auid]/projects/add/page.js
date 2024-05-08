import { getAllAuthor,getAuthor,getDepartmentbyName } from "@/utils/mongo";
import AddProject from "./AddProject";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AddPage({params}){
    const {auid}=params;
    let dept;
    let authors;
    let author=await getAuthor(auid);
    const session=await auth();
    if((session?.user?.email && ((session?.role==="Admin") || (session?.scopusID===auid && session?.role==="Author") || (session?.deptID===author?.dept && (session?.role==="HOD" || session?.role==="Department")))) ){
        dept=await getDepartmentbyName();
        authors=await getAllAuthor();
        return(
            <>
                <AddProject dept={dept} author={authors} auid={auid}/>
            </>
        )
    }else{
        redirect('/');
    }
}