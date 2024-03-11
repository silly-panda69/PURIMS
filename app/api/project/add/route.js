import { insertOneProject } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {
        title,
        status,
        dept,
        description,
        from,
        to,
        principal_name,
        principal_scopusID,
        amount_allocated,
        amount_received,
        installment,
        funding_agency,
        industry_partner,
        deliverables,
        copis,
    } = await req.json();
    if(title && status && dept && description && from && to && principal_name && principal_scopusID && amount_allocated && amount_received && installment && funding_agency && industry_partner && deliverables && copis){
        const result=await insertOneProject(
            title,
            status,
            dept,
            description,
            from,
            to,
            principal_name,
            principal_scopusID,
            amount_allocated,
            amount_received,
            installment,
            funding_agency,
            industry_partner,
            deliverables,
            copis,
        );
        if(result){
            return NextResponse.json({msg: "Project added successfully!",success: true});
        }else{
            return NextResponse.json({msg: "Error adding project!",success: false});
        }
    }else{
        return NextResponse.json({msg: "Fields are empty!",success: false});
    }
}