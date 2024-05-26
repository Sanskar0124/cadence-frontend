import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useLead, useLeadSalesforce } from "@cadence-frontend/data-access";
import { userInfo } from "@cadence-frontend/atoms";
import { MessageContext } from "@cadence-frontend/contexts";
import LeadActivity from "./components/LeadActivity/LeadActivity";
import LeadHeader from "./components/LeadHeader/LeadHeader";
import LeadInfo from "./components/LeadInfo/LeadInfo";

import styles from "./Lead.module.scss";
import { GlobalModals } from "@cadence-frontend/widgets";
import { GLOBAL_MODAL_TYPES, INTEGRATION_TYPE } from "@cadence-frontend/constants";

const Lead = () => {
	const { leadId } = useParams();

	const user = useRecoilValue(userInfo);

	const leadDataAccess = useLead(null, false);
	const {
		fetchAddresses,
		activeLeadId,
		setActiveLeadId,
		leadInfo,
		leadInfoRefetch,
		leadInfoLoading,
		fieldMap,
		fieldMapLoading,
		fieldMapRefetch,
		cadenceList,
		cadenceListLoading,
		cadenceListRefetch,
		leadActivities,
		activitiesLoading,
		activitiesRefetch,
		leadCountryData,
	} = leadDataAccess;

	const leadSalesforceDataAccess = useLeadSalesforce(
		{
			integration_id: leadInfo?.lead?.data.integration_id,
			integration_type: leadInfo?.lead?.data.integration_type,
			account_integration_id: leadInfo?.lead?.data.Account?.integration_id,
			lead: fieldMap?.Company_Setting?.Integration_Field_Map,
		},
		leadInfo?.lead?.data.integration_id
	);

	const { addError } = useContext(MessageContext);
	const [activities, setActivities] = useState([]);
	const [showCustomTaskModal, setShowCustomTaskModal] = useState(false);
	const [calendarDisplay, setCalendarDisplay] = useState(false);
	const [hotLeadFromSocket, setHotLeadFromSocket] = useState(false);
	const [companyAddress, setCompanyAddress] = useState([]);
	const [countries, setCountries] = useState([]);

	const refetchLeadDetails = () => {
		leadInfoRefetch();
		fieldMapRefetch();
		cadenceListRefetch();
		activitiesRefetch();
	};

	const handleCustomTaskModal = () => {
		setShowCustomTaskModal(prev => !prev);
		setCalendarDisplay(false);
	};

	useEffect(() => {
		if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
			leadCountryData(null, {
				onSuccess: data => {
					setCountries(data?.data);
				},
				onError: err => {
					addError({
						text: err.response?.data?.msg ?? "Error while fetching country",
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
		}

		setActiveLeadId(leadId);
	}, [leadId]);

	useEffect(() => {
		refetchLeadDetails();
	}, [activeLeadId]);

	//For sellsy company address is fetched from different route which is called upon after lead is fetched.
	useEffect(() => {
		user?.integration_type === INTEGRATION_TYPE.SELLSY &&
			leadInfo?.Account?.integration_id &&
			fetchAddresses(leadInfo?.Account?.integration_id, {
				onSuccess: data => {
					setCompanyAddress(data?.[0]);
				},
				onError: err => {
					addError({
						text: err?.response?.data?.msg,
						desc: err?.response?.data?.error,
						cId: err?.response?.data?.correlationId,
					});
				},
			});
	}, [leadInfo]);

	useEffect(() => {
		if (leadActivities) setActivities([...leadActivities]?.reverse());
	}, [leadActivities]);

	return (
		<div className={styles.leadPage}>
			<LeadHeader
				lead={leadInfo?.lead?.data}
				fieldMap={fieldMap}
				leadLoading={leadInfoLoading || fieldMapLoading}
				refetchLead={refetchLeadDetails}
				handleCustomTaskModal={handleCustomTaskModal}
				leadDataAccess={leadDataAccess}
				leadSalesforceDataAccess={leadSalesforceDataAccess}
			/>
			<div className={styles.main}>
				<LeadInfo
					lead={leadInfo?.lead?.data}
					fieldMap={fieldMap}
					cadenceList={cadenceList}
					refetchLead={refetchLeadDetails}
					leadLoading={leadInfoLoading || fieldMapLoading || cadenceListLoading}
					userTimeZone={user.timezone}
					hotLeadFromSocket={hotLeadFromSocket}
					setHotLeadFromSocket={setHotLeadFromSocket}
					countries={countries}
					leadSalesforceDataAccess={leadSalesforceDataAccess}
				/>
				<LeadActivity
					lead={leadInfo?.lead?.data}
					activities={activities}
					cadenceList={cadenceList}
					refetchLead={refetchLeadDetails}
					setActivities={setActivities}
					user={user}
					leadLoading={leadInfoLoading || activitiesLoading || cadenceListLoading}
					handleCustomTaskModal={handleCustomTaskModal}
					hotLeadFromSocket={hotLeadFromSocket}
					setHotLeadFromSocket={setHotLeadFromSocket}
				/>
			</div>
			<GlobalModals
				modalProps={{ isModal: showCustomTaskModal, onClose: handleCustomTaskModal }}
				typeSpecificProps={{
					lead: leadInfo?.lead?.data,
					calendarDisplay,
					setCalendarDisplay,
				}}
				type={GLOBAL_MODAL_TYPES.CUSTOM_TASK}
			/>
		</div>
	);
};

export default Lead;
