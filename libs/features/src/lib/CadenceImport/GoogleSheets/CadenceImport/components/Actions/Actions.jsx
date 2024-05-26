import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useState } from "react";
import { LEAD_STATUS } from "../../constants";
import styles from "./Actions.module.scss";
// import Reassign from "./components/Reassign/Reassign";
import { userInfo } from "@cadence-frontend/atoms";
import { Title } from "@cadence-frontend/components";
import {
	Cadence as CADENCE_TRANSLATION,
	Common as COMMON_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";

const Actions = ({
	cadenceImportDataAccess,
	checkedLeads,
	list,
	resetDropdowns,
	loader,
	socket1,
	setIsAdding,
}) => {
	const { addList, isAddSuccess } = cadenceImportDataAccess;
	const user = useRecoilValue(userInfo);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	const onAdd = stopPreviousCadences => {
		setIsAdding(true);
		loader.current = {
			ids: {
				loader1: uuidv4(),
			},
			length: list.filter(
				lead =>
					checkedLeads.includes(lead.sr_no) &&
					lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
			).length,
		};
		socket1.current.emit("join-room", loader.current.ids.loader1);
		resetDropdowns();
		const body = {
			add: {
				loaderId: loader.current.ids.loader1,
				leads: list
					.filter(
						lead =>
							checkedLeads.includes(lead.sr_no) &&
							lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
					)
					.map(lead => {
						delete lead.error;
						delete lead.success;
						return lead;
					}),
			},
			link: {},
		};
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
				<ThemedButton
					onClick={() =>
						list.filter(
							lead =>
								checkedLeads.includes(lead.sr_no) &&
								lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
						).length
							? setLinkLeadsModal(true)
							: onAdd(false)
					}
					theme={ThemedButtonThemes.PRIMARY}
					disabled={checkedLeads?.length === 0 || isAddSuccess}
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
