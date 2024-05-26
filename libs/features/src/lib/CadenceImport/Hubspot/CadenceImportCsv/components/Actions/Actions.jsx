import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import React, { useContext, useState } from "react";
import { LEAD_STATUS } from "../../constants";
import styles from "./Actions.module.scss";
// import Reassign from "./components/Reassign/Reassign";

import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Title } from "@cadence-frontend/components";
import SelectCadence from "../../../components/SelectCadence/SelectCadence";

const Actions = ({
	cadenceImportDataAccess,
	checkedLeads,
	setCheckedLeads,
	list,
	importFrom,
	setList,
	cadenceSelected,
	setCadenceSelected,
	resetDropdowns,
	loader,
	socket1,
	socket2,
	setIsAdding,
	setProgress,
	setImportSuccessModal,
}) => {
	const query = useQuery();
	const { addError } = useContext(MessageContext);
	const { addList, isAddSuccess } = cadenceImportDataAccess;
	const user = useRecoilValue(userInfo);
	const cadence_id = query.get("cadence_id");

	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	const onAdd = stopPreviousCadences => {
		setIsAdding(true);
		loader.current = {
			...loader.current,

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
		setList(prev => prev.map(i => ({ ...i, shown: false })));
		addList(body);
	};

	return (
		<div className={styles.actions}>
			<div className={styles.left}>
				<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
				<Title size={16}>
					{CADENCE_TRANSLATION.PEOPLE_SELECTED[user?.language?.toUpperCase()]} -{" "}
					{checkedLeads?.length} out of {list?.filter(lead => lead.shown)?.length ?? 0}
				</Title>
			</div>
			<div className={styles.right}>
				{/* <Reassign
					cadenceSelected={cadenceSelected}
					setCadenceSelected={setCadenceSelected}
					list={list}
				/> */}
				{importFrom !== "csv" && (
					<SelectCadence
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						disabled={checkedLeads?.length === 0}
					/>
				)}
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
					disabled={checkedLeads?.length === 0 || !cadenceSelected?.id || isAddSuccess}
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
