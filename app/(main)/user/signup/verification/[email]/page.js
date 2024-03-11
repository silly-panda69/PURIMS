import Verify from "./Verify";

export default async function VerificationPage({params}){
    const email=params.email;
    return (
        <div>
            <Verify email={email}></Verify>
        </div>
    )
}