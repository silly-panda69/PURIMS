"use client";
import Card from "./UI/Card";
import CardContent from "./UI/CardContent";
import { Colors } from "@/utils/nivoThemes";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import Chip from "./UI/Chip";
import Link from "next/link";
import DocIcon from "@/icons/docIcon";
import { useRef, useState } from "react";
import { debounce } from "lodash";
import Search_icon from "@/icons/Search_icon";

export default function PubTypeChart({ baseURL, auid, data, classType = "", classChart = "" }) {
	let key = "id";
	if (data[0]?.label) {
		key = "label";
	}
	data.sort((a, b) => b.value - a.value);
	let r = {
		name: "Subjects",
		id: "Subjects",
		color: "var(--bg-card)",
		children: data.map((d, i) => ({
			name: d.label || d.id,
			id: d.id,
			color: Colors[i % Colors.length],
			value: d.value,
			metrics: d.metrics,
		})),
	};
	const [record, setRecord] = useState(data);
	const [inputValue,setinputValue]=useState();

	const filter = debounce((searchText) => {
		setRecord(data.filter((f) => f.label.toLowerCase().includes(searchText)));
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
								modifiers: [["darker", 0.5]],
							}}
							padding={6}
							leavesOnly={true}
							labelsSkipRadius={50}
							labelTextColor={"white"}
							borderWidth={0}
							borderColor={"transparent"}
							onClick={({ data }) => {
								document.querySelectorAll("li details").forEach((d) => (d.open = false));
								let li = document.querySelector(`li[data-pub-id="${data.id}"]`);
								if (li) {
									li.parentElement.scrollTo({
										top: li.offsetTop - li.parentElement.offsetTop,
										behavior: "smooth",
									});
									li.querySelector("details").open = true;
								}
							}}
							tooltip={({ data: datum, value, ...els }) => {
								let metrics = datum.metrics;
								return (
									<Card className="tooltip">
										<CardContent>
											<div className="text-lg font-semibold">{datum.name}</div>

											<div className="pt-2">
												<div className="flex flex-row items-center justify-between py-2 border-divider">
													<div className="flex-1">Documents</div>
													<div className="px-2">{value}</div>
												</div>
												{metrics && (
													<>
														{metrics.impactFactorData?.metrics?.impactMetrics?.jif && (
															<div className="flex flex-row items-center justify-between py-2 border-divider">
																<div className="flex-1">Impact Factor</div>
																<div className="px-2">
																	{
																		metrics.impactFactorData?.metrics?.impactMetrics
																			?.jif
																	}
																</div>
															</div>
														)}
														{metrics.citeScore && (
															<div className="flex flex-row items-center justify-between py-2 border-divider">
																<div className="flex-1">CiteScore</div>
																<div className="px-2">
																	{metrics.citeScore.currentMetric}
																</div>
															</div>
														)}
														{metrics.snip && (
															<div className="flex flex-row items-center justify-between py-2 border-divider">
																<div className="flex-1">SNIP</div>
																<div className="px-2">{metrics.snip.value}</div>
															</div>
														)}
														{metrics.sjr && (
															<div className="flex flex-row items-center justify-between py-2 border-divider">
																<div className="flex-1">SJR</div>
																<div className="px-2">{metrics.sjr.value}</div>
															</div>
														)}
													</>
												)}
											</div>
										</CardContent>
									</Card>
								);
							}}
						/>
					</div>
				</CardContent>
			</Card>
			<Card className={classType}>
				<CardContent>
					<div className={(isInputVisible)?"flex justify-end align-items-center":"flex justify-between align-items-center"}>
						{!isInputVisible && <h3 style={{padding: "0",marginBottom: "10px"}}>Publications</h3>}
						<div className="input-inner" ref={inputRef}>
							<input type="text" onChange={handleInputChange} placeholder="Search publications..."></input>
							<button className="mb-0" onClick={()=>toggleBtn()}>
								<Search_icon width="25" height="38" />
							</button>	
						</div>
					</div>
					<ol className="flex flex-col h-96 overflow-y-scroll">
						{record.map(({ id, label, value, metrics }, i) => (
							<li key={i} data-pub-id={id} className="p-2 border-divider">
								<details>
									<summary className="block">
										<div className="flex flex-row items-center gap-3">
											<div
												className="w-8 h-8 rounded-full border-2 border-white shrink-0"
												style={{ background: Colors[i % Colors.length] }}
											></div>
											<div className="grow">{label || id}</div>
											<div className="text-2xl mx-2">{value}</div>
										</div>
									</summary>
									<div className="pt-1 px-2">
										<div className="flex flex-row items-center justify-between py-1">
											<div className="flex-1">Documents</div>
											<div className="px-2">{value}</div>
										</div>
										{metrics && (
											<>
												{metrics.impactFactorData?.metrics?.impactMetrics
													?.jif && (
														<div className="flex flex-row items-center justify-between py-1">
															<div className="flex-1">Impact Factor</div>
															<div className="px-2">
																{
																	metrics.impactFactorData?.metrics?.impactMetrics
																		?.jif
																}
															</div>
														</div>
													)}
												{metrics.citeScore && (
													<div className="flex flex-row items-center justify-between py-1">
														<div className="flex-1">CiteScore</div>
														<div className="px-2">
															{metrics.citeScore.currentMetric}
														</div>
													</div>
												)}
												{metrics.snip && (
													<div className="flex flex-row items-center justify-between py-1">
														<div className="flex-1">SNIP</div>
														<div className="px-2">{metrics.snip.value}</div>
													</div>
												)}
												{metrics.sjr && (
													<div className="flex flex-row items-center justify-between py-1">
														<div className="flex-1">SJR</div>
														<div className="px-2">{metrics.sjr.value}</div>
													</div>
												)}
												{baseURL && (
													<div className="flex flex-row items-center justify-between py-1">
														<Chip
															component={Link}
															className="pubmed-chip"
															icon={<DocIcon />}
															href={`${baseURL}?page=1&sort=coverDate&order=descending&pub=${id}`}
                            >
														Documents
													</Chip>
                          </div>
                        )}
									</>
                    )}
								</div>
							</details>
              </li>
            ))}
				</ol>
			</CardContent>
		</Card >
		</>
	);
}
