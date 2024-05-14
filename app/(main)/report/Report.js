"use client";
import React, { useEffect, useState } from 'react';
import Button from '@/components/UI/Button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Report = ({ dept }) => {
    const [authors, setAuthors] = useState([]);
    const [from, setFrom] = useState("1950-01");
    const [to, setTo] = useState("2024-05");
    const [auid, setAuid] = useState("All Author");
    const session = useSession();
    console.log(dept);
    const [deptnow,setdeptnow]=useState();
    useEffect(() => {
        const fetchData = async () => {
            const depts = dept[0];
            setdeptnow(depts);
            const res = await fetch("/api/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ dept: depts })
            });
            const data = await res.json();
            if (data?.success && data?.author) {
                setAuthors(data.author);
            }
        }
        fetchData();
    }, []);
    const addData = async (e) => {
        try {
            if (e.target && e.target.value) {
                setdeptnow(e.target.value);
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
        <div className='report-page'>
            <div className='report-box'>
                <div className='report-inner'>
                    <div>
                        <h4>Department</h4>
                        {(session?.data?.user?.email && session?.data?.role === "Admin") && <select onChange={(e) => addData(e)}>
                            {dept && dept.map((e) => {
                                return <option value={e}>
                                    {e}
                                </option>
                            })}
                        </select>}
                        {(session?.data?.user?.email && (session?.data?.role === "HOD" || session?.data?.role === "Department")) && <select>
                            <option value={session?.data?.deptID}>{session?.data?.deptID}</option>
                        </select>}
                    </div>
                    <div>
                        <h4>Author</h4>
                        {(session?.data?.user?.email && (session?.data?.role === "HOD" || session?.data?.role === "Department" || session?.data?.role === "Admin")) && <select onChange={(e) => setAuid(e.target.value)}>
                            <option default value={"All Author"}>All Author</option>
                            {authors && authors.map((e) => {
                                return <option value={e._id}>
                                    {e.profile.firstName + " " + (e.profile.middleName ? e.profile.middleName : "") + " " + e.profile.lastName}
                                </option>
                            })}
                        </select>}
                    </div>
                </div>
                <div className='report-inner'>
                    <div>
                        <p>From</p>
                        <input value={from} onChange={(e) => {
                            setFrom(e.target.value);
                            console.log(e.target.value);
                        }} type='month' />
                    </div>
                    <div>
                        <p>To</p>
                        <input value={to} onChange={(e) => setTo(e.target.value)} type='month' />
                    </div>
                </div>
                {!(auid === "All Author") && <Button
                    component={Link}
                    href={{ pathname: `/author/${auid}/reportgen/report`, query: { from, to } }}
                    className="text-xl"
                    variant="filled"
                >
                    Generate Report
                </Button>}
                {auid === "All Author" && <Button
                    component={Link}
                    className="text-xl"
                    variant="filled"
                    href={{ pathname: `/dept/${deptnow}/reportgen/report/`, query: { from, to } }}
                >
                        Generate Report
                </Button>}
            </div>
        </div>
    );
}

export default Report