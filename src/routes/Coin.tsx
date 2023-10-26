import {
	Link,
	Route,
	Switch,
	useLocation,
	useParams,
	useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
	margin: 0 auto;
	max-width: 480px;
	padding: 20px;
`;

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 15vh;
`;

const Title = styled.h1`
	color: ${(props) => props.theme.accentColor};
	font-size: 48px;
`;

const Loader = styled.span`
	display: block;
	text-align: center;
`;

const Overview = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 20px;
	border-radius: 10px;
	background-color: rgba(0, 0, 0, 0.5);
`;

const OverviewItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 33%;
	span:first-child {
		margin-bottom: 5px;
		font-size: 10px;
		font-weight: 400;
		text-transform: uppercase;
	}
`;

const Description = styled.p`
	margin: 20px 0;
`;

const Tabs = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	margin: 25px 0px;
`;

const Tab = styled.div<{ isActive: boolean }>`
	border-radius: 10px;
	background-color: rgba(0, 0, 0, 0.5);
	color: ${(props) =>
		props.isActive ? props.theme.accentColor : props.theme.textColor};
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	a {
		display: block;
		padding: 7px 0px;
	}
`;

interface RouteParams {
	coinId: string;
}

interface RouteState {
	name: string;
}

interface InfoData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
	description: string;
	message: string;
	open_source: boolean;
	started_at: string;
	development_status: string;
	hardware_wallet: boolean;
	proof_type: string;
	org_structure: string;
	hash_algorithm: string;
	first_data_at: string;
	last_data_at: string;
}

interface PriceData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	beta_value: number;
	first_data_at: string;
	last_updated: string;
	quotes: {
		USD: {
			ath_date: string;
			ath_price: number;
			market_cap: number;
			market_cap_change_24h: number;
			percent_change_1h: number;
			percent_change_1y: number;
			percent_change_6h: number;
			percent_change_7d: number;
			percent_change_12h: number;
			percent_change_15m: number;
			percent_change_24h: number;
			percent_change_30d: number;
			percent_change_30m: number;
			percent_from_price_ath: number;
			price: number;
			volume_24h: number;
			volume_24h_change_24h: number;
		};
	};
}

function Coin() {
	const { coinId } = useParams<RouteParams>();
	const { state } = useLocation<RouteState>();
	const priceMatch = useRouteMatch("/:coinId/price");
	const chartMatch = useRouteMatch("/:coinId/chart");

	const { data: infoData, isLoading: infoLoading } = useQuery<InfoData>(
		["info", coinId],
		() => fetchCoinInfo(coinId)
	);
	const { data: tickersData, isLoading: tickersLoading } = useQuery<PriceData>(
		["tickers", coinId],
		() => fetchCoinTickers(coinId),
		{
			refetchInterval: 5000,
		}
	);
	const loading = infoLoading || tickersLoading;

	return (
		<Container>
			<Helmet>
				<title>
					{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
				</title>
			</Helmet>
			<Header>
				<Title>
					{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
				</Title>
			</Header>
			{loading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Overview>
						<OverviewItem>
							<span>Rank</span>
							<span>{infoData?.rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Symbol</span>
							<span>{infoData?.symbol}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Price</span>
							<span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
						</OverviewItem>
					</Overview>
					<Description>{infoData?.description}</Description>
					<Overview>
						<OverviewItem>
							<span>Total Suply</span>
							<span>{tickersData?.total_supply}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Max Supply</span>
							<span>{tickersData?.max_supply}</span>
						</OverviewItem>
					</Overview>
					<Tabs>
						<Tab isActive={priceMatch !== null}>
							<Link to={`/${coinId}/price`}>Price</Link>
						</Tab>
						<Tab isActive={chartMatch !== null}>
							<Link to={`/${coinId}/chart`}>Chart</Link>
						</Tab>
					</Tabs>
					<Switch>
						<Route path={`/:coinId/price`}>
							<Price coinId={coinId} />
						</Route>
						<Route path={`/:coinId/chart`}>
							<Chart coinId={coinId} />
						</Route>
					</Switch>
				</>
			)}
		</Container>
	);
}

export default Coin;
