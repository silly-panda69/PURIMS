import { auth } from "@/app/auth"
import Login from "./Login"
import { redirect } from "next/navigation";

export default async function LoginPage(){
    const session=await auth();
    if(session && session.user && session.user.email && session.scopusID){
        redirect(`/author/${session.scopusID}`);
    }else if(session?.user?.email && session?.role==="HOD" && session?.deptID){
        redirect(`/dept/${session.deptID}`);
    }else if(session?.user?.email && session?.role==="Department" && session?.deptID){
        redirect(`/dept/${session.deptID}`);
    }else if(session?.user?.email && session?.role==="Admin"){
        redirect(`/`);
    }else{
        return (
            <div><Login/></div>
        );
    }
}