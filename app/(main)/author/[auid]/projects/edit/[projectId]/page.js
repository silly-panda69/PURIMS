import { getAllAuthor,getDepartmentbyName, getOneProject } from "@/utils/mongo";
import EditProject from "./EditProject";
import { auth } from "@/app/auth";
import { redirect } from "next/dist/server/api-utils";

export default async function EditPage({params}){
    const {auid,projectId}=params;
    const dept=await getDepartmentbyName();
    const author=await getAllAuthor();
    const project=await getOneProject(projectId);
    const session=await auth();
    if(!(session && session.user && session.user.email && session.scopusID)){
        redirect('/');
    }
    return(
        {(session && session.user && session.user.email && session.scopusID) && <EditProject dept={dept} author={author} auid={auid} projectData={project} />}
    )
}