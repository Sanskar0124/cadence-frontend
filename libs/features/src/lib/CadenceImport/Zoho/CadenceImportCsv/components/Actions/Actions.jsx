import { useState, useEffect } from "react";
import styles from "./Actions.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { Title } from "@cadence-frontend/components";
import { ThemedButton } from "@cadence-frontend/widgets";
import { DATA_CATEGORY, LEAD_STATUS } from "../../constants";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Exclude } from "@cadence-frontend/icons";
import WarningModal from "./components/WarningModal/WarningModal";
import { useQuery } from "@cadence-frontend/utils";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";

const Actions = ({
	list,
	checkedLeads,
	cadenceSelected,
	setCadenceSelected,
	setList,
	setIsModal,
	isModal,
	setCheckedIssueLead,
	checkedIssueLead,
	onRemoveSelected,
	setIsAdding,
	loader,
	socket1,
	socket2,
	resetDropdowns,
	cadenceImportDataAccess,
	isAddSuccess,
}) => {
	const user = useRecoilValue(userInfo);
	const query = useQuery();
	const type = query.get("type");
	const { addList } = cadenceImportDataAccess;
	const hideWorning = false;

	//states
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [iessuesInLead, setIessuesInLead] = useState({
		first_name: { name: "first name", leads: [] },
		last_name: { name: "last name", leads: [] },
		email: { name: "email", leads: [] },
		phone_number: { name: "phone number", leads: [] },
		linkedin_url: { name: "linkedin url", leads: [] },
		company_name: { name: "company name", leads: [] },
	});

	const onAdd = stopPreviousCadences => {
		setIsAdding(true);
		loader.current = {
			...loader.current,
			// ids: {
			// 	loader1: uuidv4(),
			// 	loader2: uuidv4(),
			// },
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
		// socket1.current.emit("join-room", loader.current.ids.loader1);
		// socket2.current.emit("join-room", loader.current.ids.loader2);
		resetDropdowns();

		let body = {
			add: {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),
				[DATA_CATEGORY[type]]: list
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
				[DATA_CATEGORY[type]]: list
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

	const onModalHandler = () => {
		setIsModal(true);
	};

	const onCloseWarningModal = () => {
		setIsModal(false);
	};

	useEffect(() => {
		const missingFirstName = list
			?.filter(lead => !lead.first_name)
			?.map(each => ({
				...each,
				issue: "first_name",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));
		const missingLastName = list
			?.filter(lead => !lead.last_name)
			?.map(each => ({
				...each,
				issue: "last_name",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));
		const missingLinkedin = list
			?.filter(lead => !lead.linkedin_url)
			?.map(each => ({
				...each,
				issue: "linkedin_url",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));
		const missingCompanyName = list
			?.filter(lead => !lead?.Account?.name)
			?.map(each => ({
				...each,
				issue: "company_name",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));

		const missingEmail = list
			?.filter((lead, i) => {
				const isMissingeEmail = lead.emails.some(em => {
					if (em.type === "Email") {
						return em.email_id === null;
					}
				});
				return isMissingeEmail || lead.emails?.length === 0;
			})
			?.map(each => ({
				...each,
				issue: "email",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));

		const missingPhoneNumber = list
			?.filter((lead, i) => {
				const isMissingePhoneNumber = lead?.phone_numbers?.some(
					ph =>
						ph.type !== "Company_phone__c" && ph.phone_number !== null && ph.phone_number
				);

				return !isMissingePhoneNumber || lead.phone_numbers?.length === 0;
			})
			?.map(each => ({
				...each,
				issue: "phone_number",
				allIssue: [
					"first_name",
					"last_name",
					"linkedin_url",
					"company_name",
					"email",
					"phone_number",
				],
			}));

		setIessuesInLead(prev => ({
			...prev,
			first_name: { name: "first name", leads: missingFirstName },
			last_name: { name: "last name", leads: missingLastName },
			email: {
				name: "email",
				leads: missingEmail,
			},
			phone_number: { name: "phone number", leads: missingPhoneNumber },
			linkedin_url: { name: "linkedin url", leads: missingLinkedin },
			company_name: { name: "company name", leads: missingCompanyName },
		}));
	}, [isModal, list]);

	let totalIssue = 0;

	Object.keys(iessuesInLead).forEach(issue => {
		totalIssue = totalIssue + iessuesInLead[issue]?.leads?.length;
	});

	return (
		<>
			<div className={styles.actions}>
				<div className={styles.left}>
					<p>{COMMON_TRANSLATION.BULK_ACTIONS[user?.language?.toUpperCase()]}</p>
					<Title size={16}>
						{CADENCE_TRANSLATION.PEOPLE_SELECTED[user?.language?.toUpperCase()]} -{" "}
						{checkedLeads?.length} out of {list?.filter(lead => lead.shown)?.length ?? 0}
					</Title>
				</div>

				<div className={styles.right}>
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
						className={styles.btnAdd}
					>
						<span>{COMMON_TRANSLATION.ADD[user?.language?.toUpperCase()]}</span>{" "}
						<span>{checkedLeads?.length > 0 && `(${checkedLeads?.length})`}</span>
					</ThemedButton>

					{totalIssue && hideWorning ? (
						<ThemedButton
							onClick={() => onModalHandler()}
							theme={ThemedButtonThemes.WHITE}
							className={styles.btnExclude}
							disabled={isAddSuccess}
						>
							<Exclude /> <span>{totalIssue}</span>
						</ThemedButton>
					) : null}
				</div>
				<LinkLeadsModal
					modal={linkLeadsModal}
					setModal={setLinkLeadsModal}
					onAdd={onAdd}
				/>
			</div>
			<WarningModal
				onClose={onCloseWarningModal}
				isModal={isModal}
				iessuesInLead={iessuesInLead}
				totalIssue={totalIssue}
				list={list}
				setCheckedIssueLead={setCheckedIssueLead}
				checkedIssueLead={checkedIssueLead}
				onRemoveSelected={onRemoveSelected}
			/>
		</>
	);
};

export default Actions;
