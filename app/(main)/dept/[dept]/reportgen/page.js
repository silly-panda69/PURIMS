import {
	getDepartment,
	getDepartmentYearlyChart,
} from "@/utils/mongo";
import TimePicker from "@/components/TimeRange";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

// const id = "55940987100";

export default async function DepartmentView({ params = { dept: "" }, searchParams }) {
	const dept = decodeURIComponent(params.dept);;
	if (!dept) {
		throw "No ID given!";
	}
	let deptData,yearlyChart,years;

	const session=await auth();
	if(session?.user?.email && (session?.role==="HOD" || session?.role==="Department")){
		if(session?.deptID===dept){
			deptData=await getDepartment(dept);
			yearlyChart=await getDepartmentYearlyChart(dept, { from: searchParams.from, to: searchParams.to });
			years=yearlyChart.map((y)=>y.x);
		}else{
			redirect(`/`);
		}
	}else{
		redirect(`/`);
	}


	return (
		<TimePicker
			subject={deptData.name || dept}
			fromD={searchParams.from}
			toD={searchParams.to}
			min={Math.min(...years)}
			max={Math.max(...years)}
			isAllTime={!(searchParams.from && searchParams.to)}
		/>
	);
}
