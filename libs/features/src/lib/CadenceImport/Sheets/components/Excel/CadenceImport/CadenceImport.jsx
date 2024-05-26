import { userInfo } from "@cadence-frontend/atoms";
import {
	Button,
	DeleteModal,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCadenceImportExcel, useSocket } from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	CadenceBox,
	Cadences,
	ColumnMapping,
	ErrorGradient,
	More,
	Trash,
} from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { BackButton, Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import ImportSuccessModal from "../../../../components/ImportSuccessModal/ImportSuccessModal";
import ErrorModal from "../../../../components/ErrorModal/ErrorModal";
import LinkLeadsModal from "../../../../components/LinkLeadsModal/LinkLeadsModal";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import LeadDetailsModal from "./components/LeadDetailsModal/LeadDetailsModal";
import { LEAD_STATUS, getLeadsExcludingError, isLeadError } from "./constants";

const CadenceImport = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const { addError } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const excel_field_map = JSON.parse(sessionStorage.getItem("csv_field_map"));
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");

	//refs
	const loader = useRef({ ids: { loader1: uuidv4(), loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	const leadsPreviewedRef = useRef(false);
	const roomJoinedRef = useRef(false);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [progress, setProgress] = useState(0);
	const [isAdding, setIsAdding] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState(true);
	const [roomJoined, setRoomJoined] = useState(false);

	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);
	const [leadDetailsModal, setLeadDetailsModal] = useState(null);
	const [importSuccessModal, setImportSuccessModal] = useState(false);
	const [errorModal, setErrorModal] = useState(false);

	//api
	const cadenceImportDataAccess = useCadenceImportExcel({
		cadence_id,
		excel_field_map,
		previewLoaderId: loader?.current?.ids?.loader1,
	});

	const {
		previewLeadsViaExcel,
		previewLeadsViaExcelLoading,
		previewLeadsViaExcelError,
		addList,
		isAddSuccess,
	} = cadenceImportDataAccess;

	//funtions

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalLeads = isAddSuccess ? loader.current.length : data.size;
		let totalProgress = ((loader1.current + loader2.current) / totalLeads) * 100;
		setProgress(Math.floor(totalProgress));
	};

	const handleImportResponse = data => {
		if (leadsPreviewedRef?.current) {
			setCheckedLeads([]);
			let errorLeads = [...(data?.element_error || [])];
			let successLeads = [...(data?.element_success || [])];
			let newLeads = [...errorLeads, ...successLeads];
			setList(prev =>
				prev
					.filter(lead => newLeads.find(newLead => newLead.sr_no === lead.sr_no))
					.map(lead => {
						let errorLead = errorLeads.find(errLead => errLead.sr_no === lead.sr_no);
						let successLead = successLeads.find(
							succLead => succLead.sr_no === lead.sr_no
						);
						if (errorLead)
							return { ...lead, error: { msg: errorLead.msg, type: errorLead.type } };
						return { ...lead, success: true, success_lead_id: successLead.lead_id };
					})
					.sort(a => {
						if (a.error) return -1;
						if (a.success) return 1;
						return 0;
					})
			);
			setImportSuccessModal({
				successCount: successLeads.length,
				errorCount: errorLeads.length,
				show: true,
				cadence_id,
			});
			setTimeout(() => setProgress(0), 1000);
			setIsAdding(false);
		} else {
			if (data?.error) {
				addError({ text: data?.error ?? "Error in fetching contacts" });
				cadence_id ? navigate(`/cadence/${cadence_id}?tab=list`) : navigate("/cadence");
			} else {
				setList(data?.data?.previewLeads);
				setCheckedLeads(getLeadsExcludingError(data?.data?.previewLeads));
			}
			setProgress(0);
			loader1.current = 0;
			setIsPreviewing(false);
		}
	};
	const handleRoomJoined = data => {
		setRoomJoined(true);
	};
	const handleCadencesClick = (lead, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (lead.sr_no === cadencesDropdown.sr_no) setCadencesDropdown(false);
		else setCadencesDropdown({ sr_no: lead.sr_no, cadences: lead.cadences });
	};

	const handleErrorClick = ({ id, error, e }) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === errorDropdown.id) setErrorDropdown(false);
		else setErrorDropdown({ id, error });
	};

	const handleMenuClick = (id, e) => {
		e.stopPropagation();
		resetDropdowns();
		if (id === optionsDropdown) setOptionsDropdown(false);
		else setOptionsDropdown(id);
	};

	const handleDelete = () => {
		setList(prev => prev.filter(lead => lead.sr_no !== deleteModal.id));
		setCheckedLeads(prev => prev.filter(sr_no => sr_no !== deleteModal.id));
	};

	const handleAddToCadence = (lead, stopPreviousCadences) => {
		setIsAdding(true);
		loader.current = {
			...loader.current,
			length: list.filter(
				lead =>
					checkedLeads.includes(lead.sr_no) &&
					lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
			).length,
		};

		resetDropdowns();
		let body = {};
		if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
			body.add = {
				loaderId: loader.current.ids.loader1,
				leads: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
			body.link = {};
		}
		addList(body);
	};

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
		setLinkLeadsModal(false);
	};

	//sideeffects

	//create 2 socket connections for 2 loaders (add, link)
	useEffect(() => {
		socket1.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader1)
		);
		socket1.current.on("cadence-import-response", data => handleImportResponse(data));
		socket1.current.on("msg", data => handleRoomJoined(data));

		socket1.current.emit("join-room", loader.current.ids.loader1);
		//To handle if room not joins for more than 10s
		const timeout = setTimeout(() => {
			if (!roomJoinedRef.current) {
				cadence_id ? navigate(`/cadence/${cadence_id}?tab=list`) : navigate("/cadence");
			}
		}, 10000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	useEffect(() => {
		if (!isPreviewing) {
			leadsPreviewedRef.current = !isPreviewing;
		}
	}, [isPreviewing]);
	useEffect(() => {
		roomJoinedRef.current = roomJoined;
	}, [roomJoined]);

	useEffect(() => {
		if (roomJoined) {
			previewLeadsViaExcel(null);
		}
	}, [roomJoined]);

	const textDelete = COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()];
	//constants

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedLeads?.length > 0 &&
				checkedLeads?.length === getLeadsExcludingError(list)?.length &&
				list?.length > 0
			}
			onChange={() => {
				if (list?.length > 0)
					checkedLeads?.length !== getLeadsExcludingError(list).length
						? setCheckedLeads(getLeadsExcludingError(list))
						: setCheckedLeads([]);
			}}
			disabled={isAddSuccess}
		/>,
		"Sno.",
		"Name",
		"Company",
		"Title",
		"Phone",
		"Email",
		"Owner",
		"Status",
		"Action",
	];

	const handleLeadClick = lead => {
		setLeadDetailsModal(lead);
	};

	return (
		<PageContainer className={styles.pageContainer}>
			<div className={styles.header}>
				<BackButton
					onClick={() => {
						cadence_id
							? navigate(`/cadence/${cadence_id}?tab=list`)
							: navigate("/cadence");
					}}
				/>
				{!isPreviewing && !isAdding && (
					<div className={styles.backToCSV}>
						<Tooltip text="Column mapping" className={styles.csvTooltip}>
							<ThemedButton
								theme={ThemedButtonThemes.WHITE}
								onClick={() =>
									cadence_id
										? navigate(
												`/import-csv?type=csv&cadence_id=${cadence_id}&cadence_name=${cadence_name}`
										  )
										: navigate("/cadence")
								}
								width="fit-content"
								disabled={isAddSuccess}
							>
								<ColumnMapping />
							</ThemedButton>
						</Tooltip>
					</div>
				)}
			</div>
			{previewLeadsViaExcelError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>{previewLeadsViaExcelError.msg}</span>
				</div>
			) : isPreviewing || isAdding ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{isPreviewing ? `Importing Leads - ${progress}%` : `Adding - ${progress}%`}
					</span>
					{isAdding && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]} {cadence_name}
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
						list={list}
						resetDropdowns={resetDropdowns}
						loader={loader}
						socket1={socket1}
						setIsAdding={setIsAdding}
					/>
					<Table
						loading={previewLeadsViaExcelLoading}
						columns={TABLE_COLUMNS}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height="calc(100vh - 190px)"
					>
						{list?.map((lead, index) => (
							<tr
								key={lead.sr_no}
								onClick={() => {
									handleLeadClick(lead);
								}}
							>
								<td onClick={e => e.stopPropagation()}>
									<Checkbox
										className={styles.checkBox}
										checked={checkedLeads?.includes(lead.sr_no)}
										disabled={isLeadError(lead) || isAddSuccess}
										onChange={() => {
											checkedLeads.includes(lead.sr_no)
												? setCheckedLeads(prevState =>
														prevState.filter(item => item !== lead.sr_no)
												  )
												: setCheckedLeads(prevState => [...prevState, lead.sr_no]);
										}}
									/>
								</td>
								<td>{index + 1}</td>
								<td className={styles.name}>
									<div>
										{lead.success_lead_id && (
											<CadenceBox
												size="2rem"
												onClick={e => {
													e.stopPropagation();
													window.open(`/crm/leads/${lead.success_lead_id}`);
												}}
												style={{ cursor: "pointer" }}
											/>
										)}{" "}
										<div
											className={styles.leadName}
											title={`${lead.first_name ?? ""} ${lead.last_name ?? ""}`}
										>
											{lead.first_name ?? ""} {lead.last_name ?? ""}
										</div>
									</div>
								</td>
								<td title={lead.company ?? ""}>{lead.company ?? ""} </td>
								<td title={lead.job_position ?? "NA"}>{lead.job_position ?? "NA"}</td>
								<td title={lead.primary_phone ?? "NA"}>{lead.primary_phone ?? "NA"}</td>
								<td title={lead?.primary_email ?? "NA"}>{lead?.primary_email ?? "NA"}</td>
								<td title={lead.Owner?.Name ?? ""}>{lead.Owner?.Name ?? ""}</td>
								<td className={styles.actions}>
									<div className={styles.buttons}>
										{lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL &&
											!lead.error &&
											!lead.success && (
												<ThemedButton
													onClick={e => handleCadencesClick(lead, e)}
													theme={ThemedButtonThemes.GREEN}
													className={styles.cadenceStatus}
													height="30px"
												>
													Active
												</ThemedButton>
											)}
										{(lead.status === LEAD_STATUS.USER_NOT_PRESENT ||
											lead.status === LEAD_STATUS.ANOTHER) && (
											<ThemedButton
												// onClick={e =>
												// 	handleErrorClick({
												// 		id: lead.sr_no,
												// 		error:
												// 			lead.status === LEAD_STATUS.USER_NOT_PRESENT
												// 				? "User not present in cadence"
												// 				: lead.fieldStatus,
												// 		e: e,
												// 	})
												// }
												onClick={e => {
													e.preventDefault();
													e.stopPropagation();
													setErrorModal({
														type: lead?.error?.type ?? "default",
														msg:
															lead.status === LEAD_STATUS.USER_NOT_PRESENT
																? "User not present in cadence"
																: lead.fieldStatus,
													});
												}}
												theme={ThemedButtonThemes.RED}
												className={styles.cadenceStatus}
												height="30px"
											>
												Error
											</ThemedButton>
										)}
										{lead.error && (
											<ThemedButton
												// onClick={e =>
												// 	handleErrorClick({
												// 		id: lead.sr_no,
												// 		error: lead.error?.msg,
												// 		e: e,
												// 	})
												// }
												onClick={e => {
													e.preventDefault();
													e.stopPropagation();
													setErrorModal({
														type: lead?.error?.type ?? "default",
														msg: lead.error ? lead.error?.msg : lead.status,
													});
												}}
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
											lead.sr_no === cadencesDropdown.sr_no ? styles.isActive : ""
										}`}
									>
										{cadencesDropdown?.cadences?.length ? (
											cadencesDropdown?.cadences?.map(cadence => (
												<div>{cadence.name}</div>
											))
										) : (
											<div>
												{COMMON_TRANSLATION.NO_CADENCES[user?.language?.toUpperCase()]}
											</div>
										)}
									</div>
								</td>
								<td className={styles.actions}>
									<Tooltip text={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}>
										<ThemedButton
											className={styles.dotsBtn}
											theme={ThemedButtonThemes.GREY}
											onClick={e => handleMenuClick(lead.sr_no, e)}
											height="40px"
											width="60px"
											disabled={isAddSuccess}
										>
											<div>
												<More />
											</div>
										</ThemedButton>
									</Tooltip>
									<div
										className={`${styles.dropDownMenu} ${
											lead.sr_no === optionsDropdown ? styles.isActive : ""
										}`}
									>
										<Button
											disabled={isLeadError(lead)}
											onClick={e => {
												e.stopPropagation();
												lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
													? setLinkLeadsModal(lead)
													: handleAddToCadence(lead);
											}}
											className={styles.addTocadenceBtn}
										>
											<Cadences />
											Add to cadence
										</Button>
										<Button
											onClick={e => {
												e.stopPropagation();
												setDeleteModal({
													name: `${lead.first_name ?? ""} ${lead.last_name ?? ""}`,
													id: lead.sr_no,
												});
											}}
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
					<LeadDetailsModal modal={leadDetailsModal} setModal={setLeadDetailsModal} />
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
					<ImportSuccessModal
						modal={importSuccessModal}
						setModal={setImportSuccessModal}
						cadenceSelected={{ id: cadence_id }}
					/>
					<ErrorModal modal={errorModal} setModal={setErrorModal} />
				</>
			)}
		</PageContainer>
	);
};

export default CadenceImport;
