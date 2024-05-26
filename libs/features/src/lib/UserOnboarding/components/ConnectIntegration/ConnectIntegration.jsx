import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

// Pages above ubiquity baseline
import ConnectSalesforce from "./ConnectSalesforce/ConnectSalesforce";
import ConnectPipedrive from "./ConnectPipedrive/ConnectPipedrive";
import ConnectHubspot from "./ConnectHubspot/ConnectHubspot";
import ConnectZoho from "./ConnectZoho/ConnectZoho";
import ConnectBullhorn from "./ConnectBullhorn/ConnectBullhorn";

import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import ConnectSellsy from "./ConnectSellsy/ConnectSellsy";
import ConnectDynamics from "./ConnectDynamics/ConnectDynamics";

const ConnectIntegration = ({
	setDisableNext = () => null,
	setPostData = () => null,
}) => {
	const user = useRecoilValue(userInfo);
	switch (user.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return (
				<ConnectSalesforce setDisableNext={setDisableNext} setPostData={setPostData} />
			);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return (
				<ConnectPipedrive setDisableNext={setDisableNext} setPostData={setPostData} />
			);
		case INTEGRATION_TYPE.HUBSPOT:
			return <ConnectHubspot setDisableNext={setDisableNext} setPostData={setPostData} />;
		case INTEGRATION_TYPE.SELLSY:
			return <ConnectSellsy setDisableNext={setDisableNext} setPostData={setPostData} />;
		case INTEGRATION_TYPE.DYNAMICS:
			return (
				<ConnectDynamics setDisableNext={setDisableNext} setPostData={setPostData} />
			);

		case INTEGRATION_TYPE.ZOHO:
			return <ConnectZoho setDisableNext={setDisableNext} setPostData={setPostData} />;

		case INTEGRATION_TYPE.BULLHORN:
			return (
				<ConnectBullhorn setDisableNext={setDisableNext} setPostData={setPostData} />
			);
		default:
			return (
				<ConnectSalesforce setDisableNext={setDisableNext} setPostData={setPostData} />
			);
	}
};

export default ConnectIntegration;
