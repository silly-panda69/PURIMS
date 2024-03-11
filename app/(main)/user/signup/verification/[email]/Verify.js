"use client";
import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Verify = ({email}) => {
  const [token,setToken]=useState(new Array(4).fill(""));
  const [msg,setMsg]=useState("");
  const router=useRouter();
  const hanldeChange=(e,indx)=>{
    if(isNaN(e.target.value)){
      return false;
    }
    setToken([...token.map((data,index)=>(index===indx)? e.target.value:data)]);
    //focus on next input
    if(e.target.nextSibling){
      e.target.nextSibling.focus();
    }
  }
  // const handleKeys=(e,index)=>{
  //   if(e.key==="Backspace"){
  //     if(e.target.previousElementSibling){
  //       e.target.value="";
  //       e.target.previousElementSibling.focus();
  //     }
  //   }
  // }
  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
      const otp=token.join("");
      const changedEmail=email.replace("%40","@");
        const response=await fetch("/api/user/signin/verification",{
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: changedEmail,token: otp}),
        });
        const data=await response.json();
        setMsg(data.msg);
        if(data && data.success){
          router.push(`/user/signup/verification/${email}/scopusID`);
        }
    }
    catch(err){
        setMsg("Error Verifying...");
    }
    setTimeout(()=>{
        setMsg("");
    },3000);
}
const askHandler=async()=>{
  try{
    const changedEmail=email.replace("%40","@");
      const response=await fetch("/api/user/signin/verify",{
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          },
          body: JSON.stringify({email: changedEmail}),
      });
      const data=await response.json();
      setMsg(data.msg);
  }
  catch(err){
      setMsg("Error...");
  }
  setTimeout(()=>{
      setMsg("");
  },3000);
}
  return (
    <div>
        <div className='user-page'>
            <div className='login-page'>
                <div style={{display: "flex",marginBottom:"15px",marginLeft:"10px",fontSize: "40px",justifyContent: "start",alignItems:"start",gap: "4px"}}>
					<p className="gradient-text">PU RIMS</p>
					<p className="gradient-text" style={{fontSize: "10px", letterSpacing: "1px"}}>beta</p>
				  </div>
                <form onSubmit={submitHandler}>
                    <div className='token-form'>
                      {token.map((data,index)=>{
                        return (
                          <input
                          type='text'
                          maxLength={1}
                          key={index}
                          value={data}
                          onChange={e=>hanldeChange(e,index)}
                          onFocus={e=>e.target.select()}
                          // onKeyDown={e=>handleKeys(e,index)}
                          />
                        )
                      })}
                    </div>
                    <div className='user-button'>
                        <button type='submit'>Verify OTP</button>
                    </div>
                </form>
                {msg && <div className="user-msg">
                    <p>{msg}</p>
                </div>}
                <div className='user-options'>
                    <p>Didn't receive a code ?</p>
                    <button onClick={()=>askHandler()} style={{color: "blue"}}>Resend</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Verify;
