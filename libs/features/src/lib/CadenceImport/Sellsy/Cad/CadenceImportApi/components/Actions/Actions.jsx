import React, { useContext, useState } from "react";
import styles from "./Action.module.scss";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { Title } from "@cadence-frontend/components";
import { Exclude } from "@cadence-frontend/icons";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import Reassign from "./components/Reassign/Reassign";
import { v4 as uuidv4 } from "uuid";
import { LEAD_STATUS } from "../../constants";
import { MessageContext } from "@cadence-frontend/contexts";
import LinkLeadsModal from "../../../../../components/LinkLeadsModal/LinkLeadsModal";

const Actions = ({
	cadenceSelected,
	setCadenceSelected,
	socket1,
	socket2,
	loader,
	resetDropdowns,
	checkedLeads,
	setCheckedLeads,
	list,
	setList,
	cadenceImportDataAccess,
	setProgress,
	setAddtoCadenceError,
	addLeadsBtn,
	showAddLeadsBtn,
}) => {
	const user = useRecoilValue(userInfo);
	const { addList, isAddSuccess } = cadenceImportDataAccess;
	const { addError } = useContext(MessageContext);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	const onAdd = stopPreviousCadences => {
		loader.current = {
			ids: {
				loader1: uuidv4(),
				loader2: uuidv4(),
			},
			length:
				list.filter(
					lead =>
						checkedLeads.includes(lead.id) &&
						(lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length +
				list.filter(
					lead =>
						checkedLeads.includes(lead.id) &&
						lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
				).length,
		};
		socket1.current.emit("join-room", loader.current.ids.loader1);
		socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();

		let body = {
			add: {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),

				contacts: list
					.filter(
						lead =>
							checkedLeads.includes(lead.id) &&
							lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
					)
					.map(lead => {
						delete lead.error;
						delete lead.success;
						return lead;
					}),
			},

			link: {
				stopPreviousCadences,
				loaderId: loader.current.ids.loader2,
				cadence_id: cadenceSelected.id.toString(),
				contacts: list
					.filter(
						lead =>
							checkedLeads.includes(lead.id) &&
							(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
								lead.status === LEAD_STATUS.LEAD_INACTIVE)
					)
					.map(lead => {
						delete lead.error;
						delete lead.success;
						return lead;
					}),
			},
		};

		addList(body, {
			onSuccess: data => {
				setCheckedLeads([]);
				let errorLeads = [
					...(data[0]?.element_error || []),
					...(data[1]?.element_error || []),
				];
				let successLeads = [
					...(data[0]?.element_success || []),
					...(data[1]?.element_success || []),
				];

				const newLeads = [...errorLeads, ...successLeads];

				const leads = list
					?.filter(lead =>
						newLeads.find(errLead =>
							errLead.id ? errLead.id === lead.id : errLead?.integration_id === lead.id
						)
					)
					.map(lead => {
						let errorLead = errorLeads.find(errLead =>
							errLead.id ? errLead.id === lead.id : errLead?.integration_id === lead.id
						);
						let successLead = successLeads.find(succLead =>
							succLead.id ? succLead.id === lead.id : succLead?.integration_id === lead.id
						);
						if (errorLead) return { ...lead, error: { msg: errorLead.msg } };
						return { ...lead, success: true, success_lead_id: successLead.lead_id };
					});
				setList(leads);
			},

			onError: error => setAddtoCadenceError(error?.response?.data?.msg),
		});
	};

	return (
		<div className={styles.actions}>
			<div className={styles.left}>
				{checkedLeads?.length && !isAddSuccess ? (
					<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
				) : null}

				{checkedLeads?.length && !isAddSuccess ? (
					<Title size={16}>
						{CADENCE_TRANSLATION.PEOPLE_SELECTED[user?.language?.toUpperCase()]} -{" "}
						{checkedLeads?.length} out of {list?.length ?? 0}
					</Title>
				) : null}
			</div>

			<div className={styles.right}>
				<SelectCadence
					cadenceSelected={cadenceSelected}
					setCadenceSelected={setCadenceSelected}
				/>

				<ThemedButton
					onClick={() => {
						list.filter(
							lead =>
								checkedLeads.includes(lead.id) &&
								lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
						).length
							? setLinkLeadsModal(true)
							: onAdd(false);
					}}
					theme={ThemedButtonThemes.PRIMARY}
					disabled={checkedLeads?.length === 0 || isAddSuccess}
					className={styles.btnAdd}
				>
					<span>{COMMON_TRANSLATION.ADD[user?.language?.toUpperCase()]}</span>{" "}
					<span>{checkedLeads?.length > 0 && `(${checkedLeads?.length})`}</span>
				</ThemedButton>
			</div>

			<LinkLeadsModal modal={linkLeadsModal} setModal={setLinkLeadsModal} onAdd={onAdd} />
		</div>
	);
};

export default Actions;
