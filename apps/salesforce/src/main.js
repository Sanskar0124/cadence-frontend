import { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
// import { ReactQueryDevtools } from "react-query/devtools";
import App from "./app/app";

if (!window.location.origin.includes("localhost")) console.log = () => null;
// else if(!window.location.href.includes("/crm/")) window.open("/crm/salesforce", "_self")
ReactDOM.render(
	<StrictMode>
		<RecoilRoot>
			<App />
		</RecoilRoot>
		{/* {ENV.FRONTEND?.includes("localhost") && <ReactQueryDevtools />} */}
	</StrictMode>,
	document.getElementById("root")
);
