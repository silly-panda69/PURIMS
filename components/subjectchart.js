"use client";

import { Colors } from "@/utils/nivoThemes";
import Card from "./UI/Card";
import CardContent from "./UI/CardContent";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import {debounce} from "lodash";
import Search_icon from "@/icons/Search_icon";
import { useRef,useState } from "react";

export default function SubjectChart({ data, classType = "", classChart = "" }) {
	data.sort((a, b) => b.value - a.value);
	// if (data.length > 11) {
	// 	let others = data.splice(10);
	// 	let val = others.reduce((sum, pub) => sum + pub.value, 0);
	// 	data.push({
	// 		id: "Others",
	// 		label: "Others",
	// 		value: val,
	// 	});
	// }
	let r = {
		name: "Subjects",
		color: "var(--bg-card)",
		children: data.map((d, i) => ({
			name: d.id,
			color: Colors[i % Colors.length],
			children: [{ name: d.id, color: Colors[i % Colors.length], value: d.value }],
		})),
	};
	const [record, setRecord] = useState(data);
	const [inputValue,setinputValue]=useState();

	const filter = debounce((searchText) => {
		setRecord(data.filter((f) => f.id.toLowerCase().includes(searchText)));
	}, 300);

	// Handle the onChange event
	const handleInputChange = (e) => {
		const searchText = e.target.value.toLowerCase();
		setinputValue(searchText);
		filter(searchText); // Call the filter function with the search text
	};

	const [isInputVisible, setIsInputVisible] = useState(false); // State to control input visibility

	// Function to toggle input visibility when the search icon is clicked
	const inputRef = useRef(null);
	const toggleBtn = (e) => {
		if (inputRef.current) {
			const value = !isInputVisible;
			if (value) {
				inputRef.current.className = "input-inner-on";
			} else {
				inputRef.current.className = "input-inner";
				setRecord(data);
				setinputValue("");
			}
			setIsInputVisible((prevState) => !prevState);
		}
	}
	return (
		<>
			<Card className={classType}>
				<CardContent>
				<div className={(isInputVisible) ? "flex justify-end align-items-center" : "flex justify-between align-items-center"}>
						{!isInputVisible && <h3 style={{ padding: "0", marginBottom: "10px",overflow: "hidden",textOverflow: "ellipsis",whiteSpace: "nowrap" }}>Subjects</h3>}
						<div className="input-inner" ref={inputRef}>
							<input type="text" value={inputValue} onChange={handleInputChange} placeholder="Search subjects..."></input>
							<button className="mb-0" onClick={() => toggleBtn()}>
								<Search_icon width="25" height="38" />
							</button>
						</div>
					</div>
					<ol className="flex flex-col h-96 overflow-y-scroll overlay-scroll">
						{record.map(({ id, value }, i) => (
							<li key={i} className="flex flex-row items-center p-2 gap-3 border-divider">
								<div
									className="w-8 h-8 rounded-full border-2 border-white shrink-0"
									style={{ background: Colors[i % Colors.length] }}
								></div>
								<div className="grow">{id}</div>
								<div className="text-2xl mx-2">{value}</div>
							</li>
						))}
					</ol>
				</CardContent>
			</Card>
			<Card className={classChart}>
				<CardContent>
					<div className="h-[444px]">
						<ResponsiveCirclePacking
							data={r}
							margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
							id="name"
							value="value"
							colors={{ scheme: "category10" }}
							colorBy="id"
							childColor={{
								from: "color",
								modifiers: [["brighter", "0"]],
							}}
							padding={4}
							leavesOnly={true}
							// enableLabels
							labelsSkipRadius={50}
							labelTextColor={"white"}
							borderWidth={1}
							borderColor={{
								from: "color",
								modifiers: [["darker", 0.5]],
							}}
							tooltip={({ data, value }) => {
								return (
									<Card className="tooltip">
										<CardContent>
											<div className="text-lg font-semibold">{data.name}</div>
											<div className="text-lg">Documents: {value}</div>
										</CardContent>
									</Card>
								);
							}}
						/>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
