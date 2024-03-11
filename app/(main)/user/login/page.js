import { auth } from "@/app/auth"
import Login from "./Login"
import { redirect } from "next/navigation";

export default async function LoginPage(){
    const session=await auth();
    console.log(session);
    if(session && session.user && session.user.email && session.scopusID){
        redirect(`/author/${session.scopusID}`);
    }
    return (
        <>
            {!(session && session.user && session.user.email) && <Login></Login>}
        </>
    );
}