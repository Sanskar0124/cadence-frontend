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
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";
import { useQuery } from "@cadence-frontend/utils";

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
	leadType,
	cadenceImportDataAccess,
	setIsAdding,
}) => {
	const user = useRecoilValue(userInfo);
	const query = useQuery();
	const cadence_id = query.get("cadence_id");
	const { addList, isAddSuccess } = cadenceImportDataAccess;
	const { addError } = useContext(MessageContext);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	const onAdd = stopPreviousCadences => {
		setIsAdding(true);
		loader.current = {
			// ids: {
			// 	loader1: uuidv4(),
			// 	loader2: uuidv4(),
			// },
			...loader.current,
			length:
				list.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						(lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL ||
							lead.status === LEAD_STATUS.LEAD_INACTIVE)
				).length +
				list.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
				).length,
		};
		//	socket1.current.emit("join-room", loader.current.ids.loader1);
		//	socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();

		let body = {
			add: {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),

				[leadType + "s"]: list
					.filter(
						lead =>
							checkedLeads.includes(lead.Id) &&
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
				[leadType + "s"]: list
					.filter(
						lead =>
							checkedLeads.includes(lead.Id) &&
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

		addList(body);
		setList(prev => ({
			...prev,
			[leadType]: prev[leadType].map(i => ({ ...i, shown: false })),
		}));
	};

	return (
		<div className={styles.actions}>
			<div className={styles.left}>
				{checkedLeads?.length && !isAddSuccess ? (
					<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
				) : null}

				{checkedLeads?.length && !isAddSuccess ? (
					<Title size={16}>
						{CADENCE_TRANSLATION.LEAD_SELECTED[user?.language?.toUpperCase()]} -{" "}
						{checkedLeads?.length} out of {list?.length ?? 0}
					</Title>
				) : null}
			</div>

			<div className={styles.right}>
				{/* <SelectCadence
					cadenceSelected={cadenceSelected}
					setCadenceSelected={setCadenceSelected}
				/> */}

				<ThemedButton
					onClick={() => {
						list.filter(
							lead =>
								checkedLeads.includes(lead.Id) &&
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
