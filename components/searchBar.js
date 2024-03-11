"use client";

import Button from "@/components/UI/Button";
import Card from "@/components/UI/Card";
import CardContent from "@/components/UI/CardContent";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ urlParams, value = "" }) {
	let [text, setText] = useState(value);
	let params = new URLSearchParams(urlParams);


	return (
		<div className="col-span-12">
			<div className="flex flex-row flex-nowrap justify-center gap-2">
				<input
					placeholder="Search"
					onChange={(e) => setText(e.target.value)}
		
					value={text}
					type="search"
					className="searchbar py-2 px-2 rounded-md grow"
				></input>
				<Button
					component={Link}
					href={{ href: ".", query: (params.set("s", text), params.toString()) }}
					variant="filled"
					type="submit"
				>
					Search
				</Button>
			</div>
		</div>
	);
}
