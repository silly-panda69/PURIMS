import { getAllAuthor,getAuthor,getDepartmentbyName, getOneProject } from "@/utils/mongo";
import EditProject from "./EditProject";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function EditPage({params}){
    const {auid,projectId}=params;
    let project;
    let dept;
    let authors;
    let author=await getAuthor(auid);
    const session=await auth();
    if((session?.user?.email && ((session?.role==="Admin") || (session?.scopusID===auid && session?.role==="Author") || (session?.deptID===author?.dept && (session?.role==="HOD" || session?.role==="Department"))))){
        dept=await getDepartmentbyName();
        authors=await getAllAuthor();
        project=await getOneProject(projectId);
        return(
            <>
                <EditProject dept={dept} author={authors} auid={auid} projectData={project} />
            </>
        )
    }else{
        redirect('/');
    }
}

