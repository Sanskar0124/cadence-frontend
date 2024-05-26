import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { INTEGRATION_TYPE } from "@cadence-frontend/constants";

// Integrations
import SalesforceLeadExportModal from "./Salesforce/LeadExportModal/LeadExportModal";
import PipedriveLeadExportModal from "./Pipedrive/LeadExportModal/LeadExportModal";
import HubspotLeadExportModal from "./Hubspot/LeadExportModal/LeadExportModal";
import ZohoLeadExportModal from "./Zoho/LeadExportModal/LeadExportModal";
import SellsyLeadExportModal from "./Sellsy/LeadExportModal/LeadExportModal";
import BullhornLeadExportModal from "./Bullhorn/LeadExportModal/LeadExportModal";

const LeadExportModal = ({ modal, setModal, refetch }) => {
	const user_info = useRecoilValue(userInfo);

	switch (user_info?.integration_type) {
		case INTEGRATION_TYPE.SALESFORCE:
			return (
				<SalesforceLeadExportModal modal={modal} setModal={setModal} refetch={refetch} />
			);
		case INTEGRATION_TYPE.PIPEDRIVE:
			return (
				<PipedriveLeadExportModal modal={modal} setModal={setModal} refetch={refetch} />
			);
		case INTEGRATION_TYPE.HUBSPOT:
			return (
				<HubspotLeadExportModal modal={modal} setModal={setModal} refetch={refetch} />
			);
		case INTEGRATION_TYPE.ZOHO:
			return <ZohoLeadExportModal modal={modal} setModal={setModal} refetch={refetch} />;
		case INTEGRATION_TYPE.SELLSY:
			return (
				<SellsyLeadExportModal modal={modal} setModal={setModal} refetch={refetch} />
			);
		case INTEGRATION_TYPE.BULLHORN:
			return (
				<BullhornLeadExportModal modal={modal} setModal={setModal} refetch={refetch} />
			);
	}
};

export default LeadExportModal;
