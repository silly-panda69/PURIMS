"use client";
import React,{useState} from 'react';
import Link from 'next/link';
import {signIn, useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';

const Login = () => {
    const session=useSession();
    const router=useRouter();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [msg,setMsg]=useState("");
    const [loading,setLoading]=useState(false);
    const submitHandler=async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const result=await signIn("credential",{email,password,redirect: false});
            if(!result.error && result.ok){
                router.refresh();
                setMsg("Successfully Logged in");
            }else{
                const res=await fetch("/api/user/signin/status",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({email,password})
                })
                const json=await res.json();
                if(json?.code===102){
                    console.log('email');
                    router.push(`/user/signup/verification/${email}`)
                }else if(json?.code===141){
                    console.log('scopusid')
                    router.push(`/user/signup/verification/${email}/scopusID`)
                }else{
                    setMsg("Invalid Log in");
                }
            }
            setLoading(false);
        }
        catch(err){
            setMsg("Error Loging in...");
            console.log(err);
        }
        setTimeout(()=>{
            setMsg("");
        },3000);
    }
    return (
        <div className='user-page'>
            <div className='login-page'>
                <div style={{display: "flex",marginBottom:"0px",marginLeft:"10px",fontSize: "40px",justifyContent: "start",alignItems:"start",gap: "4px"}}>
					<p className="gradient-text">PU RIMS</p>
					<p className="gradient-text" style={{fontSize: "10px", letterSpacing: "1px"}}>beta</p>
				</div>
                <p>Login</p>
                <form className='login-form' onSubmit={submitHandler}>
                    <div className='user-field'>
                        <input required type='text' value={email} onChange={e=>setEmail(e.target.value)}></input>
                        <label>Email</label>
                    </div>
                    <div className='user-field'>
                        <input required type='password' value={password} onChange={e=>setPassword(e.target.value)}></input>
                        <label>Password</label>
                    </div>
                    {!loading && <div className='user-button'>
                        <button type='submit'>Login</button>
                    </div>
                    }
                    {loading && <div className='user-button'>
                        <button disabled>Logging in...</button>
                    </div>}
                </form>
                {msg && <div className="user-msg">
                    <p>{msg}</p>
                </div>}
                <div className='user-options'>
                    <p>Don't have an account ?</p>
                    <Link href={'/user/signup'}>Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login;
