import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { userInfo } from "@cadence-frontend/atoms";

import DropcontactAddon from "./DropcontactAddon/DropcontactAddon";
import { LEAD_INTEGRATION_TYPE_MAP } from "../../constants";

const Dropcontact = props => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);

	const integrationProps = LEAD_INTEGRATION_TYPE_MAP[user.integration_type];

	if (!integrationProps) navigate("/404");

	return <DropcontactAddon {...props} {...integrationProps} />;
};

export default Dropcontact;
