import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AppShell } from "@/components/app-shell";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./dashboard/data.json";

export default async function Home() {
	const cookieStore = await cookies();
	const token = cookieStore.get("auth-token");

	if (!token) {
		redirect("/login");
	}

	return (
		<AppShell
			contentClassName="flex flex-col gap-4 pt-[calc(var(--header-height)+1rem)] pb-4 md:gap-6 md:pb-6"
		>
			<SectionCards />
			<div className="px-4 lg:px-6">
				<ChartAreaInteractive />
			</div>
			<DataTable data={data} />
		</AppShell>
	);
}
