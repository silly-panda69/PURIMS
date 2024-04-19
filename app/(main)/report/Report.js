"use client";
import React, { useState } from 'react';
import Button from '@/components/UI/Button';
import Link from 'next/link';

const Report = ({ dept }) => {
    const [authors, setAuthors] = useState([]);
    const [from,setFrom]=useState("");
    const [to,setTo]=useState("");
    const [auid,setAuid]=useState("");
    const addData = async (e) => {
        try {
            if (e.target && e.target.value) {
                const dept = e.target.value;
                const res = await fetch("/api/report", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({ dept: dept })
                });
                const data = await res.json();
                if (data?.success && data?.author) {
                    setAuthors(data.author);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <div>
                <h4>Department</h4>
                <select onChange={(e) => addData(e)}>
                    <option value={""} hidden default>Department</option>
                    {dept && dept.map((e) => {
                        return <option value={e}>
                            {e}
                        </option>
                    })}
                </select>
            </div>
            <div>
                <h4>Author</h4>
                <select onChange={(e)=> setAuid(e.target.value)}>
                    <option value={""} default hidden>Author</option>
                    {authors && authors.map((e) => {
                        return <option value={e._id}>
                            {e.profile.firstName + " " + e.profile.middleName + " " + e.profile.lastName}
                        </option>
                    })}
                </select>
            </div>
            <p>From</p>
            <input value={from} onChange={(e)=>setFrom(e.target.value)} type='month' />
            <p>To</p>
            <input value={to} onChange={(e)=>setTo(e.target.value)} type='month' />
            <br></br>
            <Button
				component={Link}
				href={{ pathname: `${auid}/details`, query: { from, to } }}
				className="text-xl"
				variant="filled"
			>
				Generate Report
			</Button>
        </div>
    );
}

export default Report