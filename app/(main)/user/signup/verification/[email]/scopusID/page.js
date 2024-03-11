import ScopusID from "./ScopusID";

export default async function ScopusPage({params}){
    const email=params.email;
    return (
        <ScopusID email={email}></ScopusID>
    );
}