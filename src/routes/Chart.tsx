import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface ChartProps {
	coinId: string;
}

interface IHistorical {
	time_open: number;
	time_close: number;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
	market_cap: number;
}

function Chart({ coinId }: ChartProps) {
	const { data, isLoading } = useQuery<IHistorical[]>(
		["ohlcv", coinId],
		() => fetchCoinHistory(coinId),
		{
			refetchInterval: 10000,
		}
	);

	return (
		<div>
			{isLoading ? (
				"Loading chart..."
			) : (
				<ApexChart
					type="line"
					series={[
						{
							name: "Price",
							data: data?.map((price) => Number(price.close)) ?? [],
						},
					]}
					options={{
						theme: {
							mode: "dark",
						},
						chart: {
							height: 300,
							width: 500,
							toolbar: {
								show: false,
							},
							background: "transparent",
						},
						grid: { show: false },
						stroke: {
							curve: "smooth",
							width: 4,
						},
						yaxis: {
							show: false,
						},
						xaxis: {
							axisBorder: { show: false },
							axisTicks: { show: false },
							labels: { show: false },
							type: "datetime",
							categories: data?.map((price) =>
								new Date(price.time_close * 1000).toUTCString()
							),
						},
						fill: {
							type: "gradient",
							gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
						},
						colors: ["#0fbcf9"],
						tooltip: {
							y: {
								formatter: (value) => `$${value.toFixed(2)}`,
							},
						},
					}}
				/>
			)}
		</div>
	);
}

export default Chart;
