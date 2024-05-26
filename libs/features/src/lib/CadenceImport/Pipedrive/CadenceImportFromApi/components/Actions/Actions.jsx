import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useState } from "react";
import { LEAD_STATUS, getDataCategoryId } from "../../../constants";
import styles from "./Actions.module.scss";
// import Reassign from "./components/Reassign/Reassign";
import SelectCadence from "./components/SelectCadence/SelectCadence";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { Title } from "@cadence-frontend/components";
import { useQuery } from "@cadence-frontend/utils";

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
	setIsAdding,
	setProgress,
	setImportSuccessModal,
}) => {
	const query = useQuery();
	const type = query.get("type");
	const cadence_id = query.get("cadence_id");
	const { addError } = useContext(MessageContext);
	const { addList, isAddSuccess } = cadenceImportDataAccess;
	const user = useRecoilValue(userInfo);

	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	const onAdd = stopPreviousCadences => {
		setIsAdding(true);
		loader.current = {
			ids: {
				loader1: uuidv4(),
				loader2: uuidv4(),
			},
			length:
				list.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
						lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
				).length +
				list.filter(
					lead =>
						checkedLeads.includes(lead.Id) &&
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
				persons: list
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
				persons: list
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
		setList(prev => prev.map(i => ({ ...i, shown: false })));
		addList(body);
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
				{/* {type !== "create_lead" && (
					<SelectCadence
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						list={list}
						checkedLeads={checkedLeads}
					/>
				)} */}
				<ThemedButton
					onClick={() =>
						list.filter(
							lead =>
								checkedLeads.includes(lead.Id) &&
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
