import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import React, { useContext, useState } from "react";
import { LEAD_STATUS } from "../../constants";
import styles from "./Actions.module.scss";
// import Reassign from "./components/Reassign/Reassign";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Title } from "@cadence-frontend/components";

const Actions = ({
	cadenceImportDataAccess,
	checkedLeads,
	setCheckedLeads,
	list,
	setList,
	cadenceSelected,
	setCadenceSelected,
	resetDropdowns,
	loader,
	socket1,
	socket2,
	setProgress,
}) => {
	const query = useQuery();
	const { addError } = useContext(MessageContext);
	const { addList } = cadenceImportDataAccess;
	const user = useRecoilValue(userInfo);

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
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
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
		const body = {
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
							lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
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
				let newLeads = [...errorLeads, ...successLeads];
				setList(prev =>
					prev
						.filter(lead => newLeads.find(errLead => errLead.id === lead.id))
						.map(lead => {
							let errorLead = errorLeads.find(errLead => errLead.id === lead.id);
							if (errorLead) return { ...lead, error: { msg: errorLead.msg } };
							return { ...lead, success: true };
						})
						.sort(a => {
							if (a.error) return -1;
							if (a.success) return 1;
							return 0;
						})
				);
				setTimeout(() => setProgress(0), 1000);
			},
			onError: error =>
				addError({
					text: error?.response?.data?.msg,
					desc: error?.response?.data?.error,
					cId: error?.response?.data?.correlationId,
				}),
		});
	};

	return (
		<div className={styles.actions}>
			<div className={styles.left}>
				<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
				<Title size={16}>
					{CADENCE_TRANSLATION.PEOPLE_SELECTED[user?.language?.toUpperCase()]} -{" "}
					{checkedLeads?.length} out of {list?.length ?? 0}
				</Title>
			</div>
			<div className={styles.right}>
				{/* <Reassign
					cadenceSelected={cadenceSelected}
					setCadenceSelected={setCadenceSelected}
					list={list}
				/> */}
				<ThemedButton
					onClick={() =>
						list.filter(
							lead =>
								checkedLeads.includes(lead.id) &&
								lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
						).length
							? setLinkLeadsModal(true)
							: onAdd(false)
					}
					theme={ThemedButtonThemes.PRIMARY}
					disabled={checkedLeads?.length === 0 || !cadenceSelected?.id}
				>
					<div>
						{COMMON_TRANSLATION.ADD[user?.language?.toUpperCase()]}{" "}
						{checkedLeads?.length > 0 && `(${checkedLeads?.length})`}
					</div>
				</ThemedButton>
			</div>
			<LinkLeadsModal modal={linkLeadsModal} setModal={setLinkLeadsModal} onAdd={onAdd} />
		</div>
	);
};

export default Actions;
