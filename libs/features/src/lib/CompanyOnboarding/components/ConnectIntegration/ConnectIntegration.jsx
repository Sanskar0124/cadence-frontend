import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

// Pages above ubiquity baseline
import ConnectSalesforce from "./ConnectSalesforce/ConnectSalesforce";
import ConnectPipedrive from "./ConnectPipedrive/ConnectPipedrive";
import ConnectHubspot from "./ConnectHubspot/ConnectHubspot";
import ConnectSellsy from "./ConnectSellsy/ConnectSellsy";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";
import ConnectZoho from "./ConnectZoho/ConnectZoho";
import ConnectBullhorn from "./ConnectBullHorn/ConnectBullhorn";
import ConnectDynamics from "./ConnectDynamics/ConnectDynamics";

const ConnectIntegration = ({ setDisableNext = () => null, postDataRef }) => {
	const user = useRecoilValue(userInfo);

	switch (user.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return (
				<ConnectSalesforce setDisableNext={setDisableNext} postDataRef={postDataRef} />
			);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return (
				<ConnectPipedrive setDisableNext={setDisableNext} postDataRef={postDataRef} />
			);
		case INTEGRATION_TYPE.HUBSPOT:
			return <ConnectHubspot setDisableNext={setDisableNext} postDataRef={postDataRef} />;
		case INTEGRATION_TYPE.SELLSY:
			return <ConnectSellsy setDisableNext={setDisableNext} postDataRef={postDataRef} />;

		case INTEGRATION_TYPE.ZOHO:
			return <ConnectZoho setDisableNext={setDisableNext} postDataRef={postDataRef} />;

		case INTEGRATION_TYPE.BULLHORN:
			return (
				<ConnectBullhorn setDisableNext={setDisableNext} postDataRef={postDataRef} />
			);
		case INTEGRATION_TYPE.DYNAMICS:
			return (
				<ConnectDynamics setDisableNext={setDisableNext} postDataRef={postDataRef} />
			);
		default:
			return (
				<ConnectSalesforce setDisableNext={setDisableNext} postDataRef={postDataRef} />
			);
	}
};

export default ConnectIntegration;
