import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";

function App() {
	return (
		<>
			<BrowserRouter>
				<Switch>
					<Route path="/:coinId">
						<Coin />
					</Route>
					<Route path="/">
						<Coins />
					</Route>
				</Switch>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={true} />
		</>
	);
}

export default App;
