import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { userInfo } from "@cadence-frontend/atoms";

import SnovAddon from "./SnovAddon/SnovAddon";
import { LEAD_INTEGRATION_TYPE_MAP } from "../../constants";

const Snov = props => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);

	const integrationProps = LEAD_INTEGRATION_TYPE_MAP[user.integration_type];

	if (!integrationProps) navigate("/404");

	return <SnovAddon {...props} {...integrationProps} />;
};

export default Snov;
