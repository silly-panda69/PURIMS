"use client";
import { ResponsivePie } from "@nivo/pie";
import CardContent from "./UI/CardContent";
import Card from "./UI/Card";
import { Colors } from "@/utils/nivoThemes";
import { useState } from "react";
import { debounce } from "lodash"
import Search_icon from "@/icons/Search_icon";
import { useRef } from "react";

export default function SubTypeChart({ data, classType = "", classChart = "" }) {
	data.sort((a, b) => b.value - a.value)
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
						{!isInputVisible && <h3 style={{ padding: "0", marginBottom: "10px",overflow: "hidden",textOverflow: "ellipsis",whiteSpace: "nowrap" }}>Document Types</h3>}
						<div className="input-inner" ref={inputRef}>
							<input type="text" value={inputValue} onChange={handleInputChange} placeholder="Search document types..."></input>
							<button className="mb-0" onClick={() => toggleBtn()}>
								<Search_icon width="25" height="38" />
							</button>
						</div>
					</div>
					<ol className="flex flex-col h-96 overflow-y-scroll">
						{record?.map(({ id, value }, i) => (
							<li
								key={i}
								className="flex flex-row items-center p-2 gap-3 border-divider"
							>
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
						<ResponsivePie
							data={data}
							sortByValue={false}
							innerRadius={0.5}
							padAngle={0.7}
							cornerRadius={3}
							activeOuterRadiusOffset={8}
							borderWidth={1}
							margin={{ top: "40", bottom: "40" }}
							colors={{ scheme: "category10" }}
							borderColor={{ theme: "background" }}
							enableArcLinkLabels={false}
							// borderColor={{ theme: "background" }}
							// arcLinkLabel={key}
							// arcLinkLabelsSkipAngle={24}
							// arcLinkLabelsTextOffset={2}
							// arcLinkLabelsTextColor="inherit"
							// arcLinkLabelsOffset={-10}
							// arcLinkLabelsDiagonalLength={30}
							// arcLinkLabelsStraightLength={36}
							// arcLinkLabelsThickness={2}
							// arcLinkLabelsColor={{
							// 	from: "color",
							// }}
							tooltip={({ datum }) => (
								<Card className="tooltip">
									<CardContent>
										<div className="text-lg font-semibold">{datum.label}</div>
										<div>Documents: {datum.formattedValue}</div>
									</CardContent>
								</Card>
							)}
							arcLabelsTextColor={"white"}
						/>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
