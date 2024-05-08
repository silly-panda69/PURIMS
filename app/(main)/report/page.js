import PageSelect from "@/components/PageSelect";
import SearchBar from "@/components/searchBar";
import Report from "./Report";
import {
	getAuthor,
	getAuthors,
	getAuthorsByDept,
	getDepartment,
	getDepartmentNames,
} from "@/utils/mongo";
import AuthorList from "@/components/authorList";
import AuthorFilters from "@/components/AuthorFilters";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export default async function Authors({ searchParams = { page: 1 } }) {
	let page = parseInt(searchParams.page) || 1;
	if (page < 1) {
		throw "Invalid page number!";
	}
	const session=await auth();
	let result= await getDepartmentNames();
	if(session?.user.email && (session?.role==="HOD" || session?.role==="Department")){
		result=[session?.deptID];
	}else if(session?.user?.email && session?.role==="Admin"){
		result=await getDepartmentNames();
	}else{
		redirect("/");
	}
	return (
		<main id="main">
			<div className="col-span-12 text-center my-4">
				<div className="huge-text">Generate Report For :</div>
			</div>
			<Report dept={result}></Report>
		</main>
	);
}
