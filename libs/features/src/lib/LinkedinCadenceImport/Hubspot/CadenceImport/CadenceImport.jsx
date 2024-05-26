import {
	Button,
	DeleteModal,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useCadenceImportHubspot,
	useSocket,
	useUser,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	Cadences,
	ColumnMapping,
	ErrorGradient,
	Hubspot,
	More,
	Trash,
} from "@cadence-frontend/icons";
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

const CadenceImport = () => {
	const navigate = useNavigate();
	const { user } = useUser({ user: true });
	const { addError, addSuccess } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const webhook = query.get("webhook");
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState({ lead_id: "", cadences: "" });
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
	const cadenceImportDataAccess = useCadenceImportHubspot(
		{ webhook },
		{ leads: Boolean(webhook) }
	);

	const {
		leads,
		importLoading,
		addLoading,
		importError,
		addList,
		deleteLead,
		deleteLoading,
	} = cadenceImportDataAccess;

	//funtions

	const handleCadencesClick = lead => {
		resetDropdowns();
		if (lead.lead_id === cadencesDropdown.lead_id)
			setCadencesDropdown({ lead_id: "", cadences: "" });
		else setCadencesDropdown({ lead_id: lead.lead_id, cadences: lead.cadences });
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
		resetDropdowns();
		if (webhook) {
			deleteLead(
				{ contact_id: deleteModal.id },
				{
					onSuccess: () => {
						addSuccess("Deleted contact from import successfully");
						setList(prev => prev.filter(lead => lead.id !== deleteModal.id));
					},
					onError: err =>
						addError({
							text: err?.response?.data?.msg,
							desc: err?.response?.data?.error,
							cId: err?.response?.data?.correlationId,
						}),
				}
			);
		} else {
			setList(prev => prev.filter(lead => lead.id !== deleteModal.id));
		}
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
		if (!cadenceSelected.id) return addError({ text: "Please select a cadence" });
		setCheckedLeads([lead.id]);
		let body = {};
		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				cadence_id: cadenceSelected.id.toString(),
				contacts: [lead].map(l => {
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
				contacts: [lead].map(l => {
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
						.filter(lead => newLeads.find(errLead => errLead.id === lead.id))
						.map(lead => {
							let errorLead = errorLeads.find(errLead => errLead.id === lead.id);
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

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown({ lead_id: "", cadences: "" });
		setErrorDropdown(false);
		setLinkLeadsModal(false);
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
		if (webhook) {
			setList(leads);
			setCheckedLeads(getLeadsExcludingError(leads));
		} else {
			const contactsArr = JSON.parse(
				sessionStorage.getItem(`contacts-cadence-${cadence_id}`)
			);
			setList(contactsArr);
		}
	}, [leads]);

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		socket1.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader1)
		);
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
	}, []);

	useEffect(() => {
		if (cadence_id && cadence_name)
			setCadenceSelected({ id: cadence_id, name: cadence_name });
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
		"Owner",
		"Cadence",
		"Action",
	];

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<BackButton
					onClick={() => {
						sessionStorage.clear();
						cadence_id
							? navigate(`/cadence/${cadence_id}?tab=list`)
							: navigate("/cadence");
					}}
				/>
				{!webhook && !importError?.error && !importLoading && (
					<div className={styles.backToCSV}>
						<Tooltip text="Column mapping" className={styles.csvTooltip}>
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								onClick={() =>
									cadence_id
										? navigate(
												`/import-csv?cadence_id=${cadence_id}&cadence_name=${cadence_name}`
										  )
										: navigate("/cadence")
								}
								width="fit-content"
							>
								<ColumnMapping />
							</ThemedButton>
						</Tooltip>
					</div>
				)}
			</div>
			{webhook && importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{importError.msg}</span>
				</div>
			) : importLoading || addLoading ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{importLoading ? "Importing Leads" : `Adding - ${progress}%`}
					</span>
					{addLoading && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}{" "}
							{cadenceSelected.name}
						</span>
					)}
					{importLoading ? (
						<Spinner className={styles.spinner} />
					) : (
						<progress max="100" value={progress}></progress>
					)}
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
						// loading={importLoading}
						columns={TABLE_COLUMNS}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height={`calc(100vh - ${webhook ? "190px" : "230px"})`}
					>
						{list?.map((lead, index) => (
							<tr key={lead.id}>
								<td onClick={e => e.stopPropagation()}>
									<Checkbox
										className={styles.checkBox}
										checked={checkedLeads?.includes(lead.id)}
										disabled={isLeadError(lead)}
										onChange={() => {
											checkedLeads.includes(lead.id)
												? setCheckedLeads(prevState =>
														prevState.filter(item => item !== lead.id)
												  )
												: setCheckedLeads(prevState => [...prevState, lead.id]);
										}}
									/>
								</td>
								<td>{index + 1}</td>
								<td className={styles.name}>
									<div>
										<Hubspot size="2rem" />
										{lead.first_name} {lead.last_name}
									</div>
								</td>
								<td>{lead.company_name ?? lead.Account?.name}</td>
								<td>{lead.job_position ?? "NA"}</td>
								<td>{lead.emails?.find(em => em.email_id)?.email_id}</td>
								<td>
									{lead.owner?.first_name
										? `${lead.owner?.first_name} ${lead.owner?.last_name}`
										: lead.owner}
								</td>
								<td className={styles.actions}>
									<div className={styles.buttons}>
										{lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL &&
											!lead.error &&
											!lead.success && (
												<ThemedButton
													onClick={() => handleCadencesClick(lead)}
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
														id: lead.id,
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
													handleErrorClick({ id: lead.id, error: lead.error?.msg })
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
											lead.lead_id === cadencesDropdown?.lead_id ? styles.isActive : ""
										}`}
									>
										{cadencesDropdown?.cadences?.length ? (
											cadencesDropdown?.cadences?.map(cadence => (
												<div>{cadence.Cadences[0]?.name}</div>
											))
										) : (
											<div>
												{COMMON_TRANSLATION.NO_CADENCES[user?.language?.toUpperCase()]}
											</div>
										)}
									</div>
									<div
										className={`${styles.dropDownMenu} ${styles.cadences} ${
											lead.id === errorDropdown.id ? styles.isActive : ""
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
											onClick={() => handleMenuClick(lead.id)}
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
											lead.id === optionsDropdown ? styles.isActive : ""
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
													id: lead.id,
												})
											}
											className={styles.deleteBtn}
										>
											<Trash />
											{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]
												?.slice(0, 1)
												.toUpperCase() +
												COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]?.slice(
													1
												)}
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
						loading={deleteLoading}
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
