import styled from "styled-components";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
	margin: 0 auto;
	max-width: 480px;
	padding: 0px 20px;
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

const CoinsList = styled.ul``;

const Loader = styled.span`
	display: block;
	text-align: center;
`;

const Coin = styled.li`
	margin-bottom: 10px;
	border-radius: 15px;
	background-color: white;
	color: ${(props) => props.theme.bgColor};
	a {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in;
	}
	&:hover {
		a {
			color: ${(props) => props.theme.accentColor};
		}
	}
`;

const Img = styled.img`
	margin-right: 10px;
	width: 35px;
	height: 35px;
`;

interface ICoin {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
}

function Coins() {
	const { data, isLoading } = useQuery<ICoin[]>(["allCoins"], fetchCoins);

	return (
		<Container>
			<Helmet>
				<title>코인</title>
			</Helmet>
			<Header>
				<Title>코인</Title>
			</Header>
			<CoinsList>
				{isLoading ? (
					<Loader>Loading...</Loader>
				) : (
					<CoinsList>
						{data?.slice(0, 20).map((coin) => (
							<Coin key={coin.id}>
								<Link
									to={{
										pathname: `/${coin.id}`,
										state: { name: coin.name },
									}}
								>
									<Img
										src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
									/>
									{coin.name} &rarr;
								</Link>
							</Coin>
						))}
					</CoinsList>
				)}
			</CoinsList>
		</Container>
	);
}

export default Coins;
