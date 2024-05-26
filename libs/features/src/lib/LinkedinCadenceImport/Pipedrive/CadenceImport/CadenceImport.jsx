import {
	Button,
	DeleteModal,
	Div,
	PageContainer,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useCadenceImportPipedrive,
	useSocket,
	useUser,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import { Cadences, More, Pipedrive, Trash } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { BackButton, Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import {
	getLeadsExcludingError,
	isLeadError,
	LEAD_ERROR_MSG_MAP,
	LEAD_STATUS,
} from "./constants";

import { getPipedriveUrl } from "@cadence-frontend/utils";

const CadenceImport = () => {
	const navigate = useNavigate();
	const { user } = useUser({ user: true });
	const { addError } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const view = query.get("view");
	const type = ""; //temp
	const selectedIds = query.get("selectedIds");
	const excludedIds = query.get("excludedIds");

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [cadenceSelected, setCadenceSelected] = useState({ id: "", name: "" });
	const [progress, setProgress] = useState(0);
	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	//api
	const cadenceImportDataAccess = useCadenceImportPipedrive(
		{ view, selectedIds, excludedIds, lead_id: cadencesDropdown },
		{ leads: true }
	);

	const {
		leads,
		importLoading,
		addLoading,
		importError,
		addList,
		cadencesAssociated,
		cadencesAssociatedLoading,
		fetchCadenceAssociated,
	} = cadenceImportDataAccess;

	//funtions

	const handleCadencesClick = (id = 0) => {
		resetDropdowns();
		if (id === cadencesDropdown) setCadencesDropdown(false);
		else setCadencesDropdown(id);
	};

	const handleErrorClick = ({ id, error }) => {
		resetDropdowns();
		if (id === errorDropdown.id) setErrorDropdown(false);
		else setErrorDropdown({ id, error });
	};

	const handleMenuClick = id => {
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		setList(prev => prev.filter(lead => lead.Id !== deleteModal.id));
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
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
		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.Id]);
		let body = {};
		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),
				persons: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}
		if (lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL) {
			body.link = {
				stopPreviousCadences,
				loaderId: loader.current.ids.loader2,
				cadence_id: cadenceSelected.id.toString(),
				persons: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
		}
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
						.filter(lead => newLeads.find(errLead => errLead.integration_id === lead.Id))
						.map(lead => {
							let errorLead = errorLeads.find(
								errLead => errLead.integration_id === lead.Id
							);
							if (errorLead) return { ...lead, error: { msg: errorLead.msg } };
							return { ...lead, success: true };
						})
				);
			},
			onError: error =>
				addError({
					text: error?.response?.data?.msg || "Some error occured, please try again",
					desc: error?.response?.data?.error ?? "Please contact support",
					cId: error?.response?.data?.correlationId,
				}),
		});
	};

	const handleIntegrationIconClick = (e, lead) => {
		e.stopPropagation();
		const url = getPipedriveUrl(lead.Id, user.Pipedrive_Token?.instance_url);
		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
	};

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalProgress =
			((loader1.current + loader2.current) / loader.current.length) * 100;
		setProgress(Math.floor(totalProgress));
	};

	//sideeffects

	useEffect(() => {
		setList(leads);
		setCheckedLeads(getLeadsExcludingError(leads));
	}, [leads]);

	useEffect(() => {
		if (cadencesDropdown) fetchCadenceAssociated(cadencesDropdown);
	}, [cadencesDropdown]);

	// useEffect(() => {
	// 	window.onbeforeunload = () => "Are you sure you want to leave?";
	// }, []);

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		socket1.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader1)
		);
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
	}, []);

	//constants

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length === getLeadsExcludingError(list)?.length && list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !== getLeadsExcludingError(list).length
						? setCheckedLeads(getLeadsExcludingError(list))
						: setCheckedLeads([]);
			}}
		/>,
		"Sno.",
		"Name",
		"Company",
		"Title",
		"Email",
		"Pipedrive Owner",
		"Cadence",
		"Action",
	];

	const textDelete = COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()];

	return (
		<PageContainer className={styles.pageContainer}>
			<BackButton onClick={() => navigate("/tasks")} />
			{importError?.error ? (
				<div className={styles.error}>
					<span>{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}</span>
					<span>{importError.msg}</span>
				</div>
			) : importLoading || addLoading ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{importLoading ? "Importing" : "Adding"} - {progress}%
					</span>
					{addLoading && (
						<span className={styles.cadence}>
							<Cadences />
							Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}{" "}
							{cadenceSelected.name}
						</span>
					)}
					<progress max="100" value={progress}></progress>
				</div>
			) : (
				<>
					<Title className={styles.title} size="20px">
						Import
					</Title>
					<Actions
						cadenceImportDataAccess={cadenceImportDataAccess}
						checkedLeads={checkedLeads}
						setCheckedLeads={setCheckedLeads}
						list={list}
						setList={setList}
						cadenceSelected={cadenceSelected}
						setCadenceSelected={setCadenceSelected}
						resetDropdowns={resetDropdowns}
						loader={loader}
						socket1={socket1}
						socket2={socket2}
						setProgress={setProgress}
					/>
					<Table
						loading={importLoading}
						columns={TABLE_COLUMNS}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height="calc(100vh - 190px)"
					>
						{list?.map((lead, index) => (
							<tr key={lead.Id}>
								<td onClick={e => e.stopPropagation()}>
									<Checkbox
										className={styles.checkBox}
										checked={checkedLeads?.includes(lead.Id)}
										disabled={isLeadError(lead)}
										onChange={() => {
											checkedLeads.includes(lead.Id)
												? setCheckedLeads(prevState =>
														prevState.filter(item => item !== lead.Id)
												  )
												: setCheckedLeads(prevState => [...prevState, lead.Id]);
										}}
									/>
								</td>
								<td>{index + 1}</td>
								<td className={styles.name}>
									<div>
										<Pipedrive
											size="1.75rem"
											onClick={e => handleIntegrationIconClick(e, lead)}
										/>
										{lead.first_name} {lead.last_name}
									</div>
								</td>
								<td>{lead.Account?.name}</td>
								<td>{lead.job_position ?? "NA"}</td>
								<td>
									{lead?.emails?.map((mail, index) => index === 0 && mail.email_id)}
								</td>
								<td>{lead.Owner?.Name}</td>
								<td className={styles.actions}>
									<div className={styles.buttons}>
										{lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL &&
											!lead.error &&
											!lead.success && (
												<ThemedButton
													onClick={() => handleCadencesClick(lead.lead_id)}
													theme={ThemedButtonThemes.GREEN}
													className={styles.cadenceStatus}
													height="30px"
												>
													Active
												</ThemedButton>
											)}
										{isLeadError(lead) && (
											<ThemedButton
												onClick={() =>
													handleErrorClick({
														id: lead.Id,
														error: LEAD_ERROR_MSG_MAP[lead.status],
													})
												}
												theme={ThemedButtonThemes.RED}
												className={styles.cadenceStatus}
												height="30px"
											>
												Error
											</ThemedButton>
										)}
										{lead.error && (
											<ThemedButton
												onClick={() =>
													handleErrorClick({ id: lead.Id, error: lead.error?.msg })
												}
												theme={ThemedButtonThemes.RED}
												className={styles.cadenceStatus}
												height="30px"
											>
												Error
											</ThemedButton>
										)}
										{lead.success && (
											<ThemedButton
												theme={ThemedButtonThemes.GREEN}
												className={styles.cadenceStatus}
												height="30px"
											>
												Success
											</ThemedButton>
										)}
									</div>
									<div
										className={`${styles.dropDownMenu} ${styles.cadences} ${
											lead.lead_id === cadencesDropdown ? styles.isActive : ""
										}`}
									>
										{cadencesAssociatedLoading ? (
											<Placeholder />
										) : cadencesAssociated?.length > 0 ? (
											cadencesAssociated?.map(cadence => <div>{cadence.name}</div>)
										) : (
											<div>
												{COMMON_TRANSLATION.NO_CADENCES[user?.language?.toUpperCase()]}
											</div>
										)}
									</div>
									<div
										className={`${styles.dropDownMenu} ${styles.cadences} ${
											lead.Id === errorDropdown.id ? styles.isActive : ""
										}`}
									>
										<div>{errorDropdown?.error}</div>
									</div>
								</td>
								<td className={styles.actions}>
									<Tooltip text={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}>
										<ThemedButton
											className={styles.dotsBtn}
											theme={ThemedButtonThemes.GREY}
											onClick={() => handleMenuClick(lead.Id)}
											height="40px"
											width="60px"
										>
											<div>
												<More />
											</div>
										</ThemedButton>
									</Tooltip>
									<div
										className={`${styles.dropDownMenu} ${
											lead.Id === optionsDropdown ? styles.isActive : ""
										}`}
									>
										<Button
											disabled={isLeadError(lead)}
											onClick={() =>
												lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
													? setLinkLeadsModal(lead)
													: handleAddToCadence(lead)
											}
										>
											<Cadences />
											Add to cadence
										</Button>
										{/* <Button>
											<ReAssign />
											Re-assign
										</Button> */}
										<Button
											onClick={() =>
												setDeleteModal({
													name: `${lead.first_name ?? ""} ${lead.last_name ?? ""}`,
													id: lead.Id,
												})
											}
											className={styles.deleteBtn}
										>
											<Trash />
											{textDelete.slice(0, 1).toUpperCase() + textDelete.slice(1)}
										</Button>
									</div>
								</td>
							</tr>
						))}
					</Table>
					<DeleteModal
						modal={deleteModal}
						setModal={setDeleteModal}
						item={deleteModal?.name}
						onDelete={handleDelete}
					/>
					<LinkLeadsModal
						modal={linkLeadsModal}
						setModal={setLinkLeadsModal}
						onAdd={stopPreviousCadences => {
							handleAddToCadence(linkLeadsModal, stopPreviousCadences);
							resetDropdowns();
						}}
					/>
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(2).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
