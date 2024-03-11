import { getAllAuthor,getDepartmentbyName } from "@/utils/mongo";
import AddProject from "./AddProject";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function AddPage({params}){
    const {auid}=params;
    const dept=await getDepartmentbyName();
    const author=await getAllAuthor();
    const session=await auth();
    if(!(session && session.user && session.user.email && session.scopusID)){
        redirect('/');
    }
    return(
        <>
            {(session && session.user && session.user.email && session.scopusID) && <AddProject dept={dept} author={author} auid={auid}/>}
        </>
    )
}