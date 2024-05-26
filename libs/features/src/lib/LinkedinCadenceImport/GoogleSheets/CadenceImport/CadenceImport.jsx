import {
	Button,
	DeleteModal,
	Div,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useCadenceImportGoogleSheets,
	useSocket,
	useUser,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import { Cadences, ErrorGradient, More, Trash } from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import { BackButton, Checkbox, Table, ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import {
	DATA_CATEGORY_ID,
	getLeadsExcludingError,
	isLeadError,
	LEAD_STATUS,
} from "./constants";

const CadenceImport = () => {
	const navigate = useNavigate();
	const { user } = useUser({ user: true });
	const { addError } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const sheet_url = sessionStorage.getItem("sheet_url");
	const cadence_id = query.get("cadence_id");
	const cadence_name = query.get("cadence_name");
	const type = ""; //temp

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
	const [progress, setProgress] = useState(0);
	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	//api
	const cadenceImportDataAccess = useCadenceImportGoogleSheets({
		sheet_url,
		cadence_id,
		enabled: true,
	});

	const { leads, importLoading, addLoading, importError, addList } =
		cadenceImportDataAccess;

	//funtions

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	const handleImportSocket = (data, id) => {
		if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
		if (loader.current.ids.loader1 === id) loader1.current = data.index;
		if (loader.current.ids.loader2 === id) loader2.current = data.index;

		let totalProgress =
			((loader1.current + loader2.current) / loader.current.length) * 100;
		setProgress(Math.floor(totalProgress));
	};

	const handleCadencesClick = lead => {
		resetDropdowns();
		if (lead.sr_no === cadencesDropdown.sr_no) setCadencesDropdown(false);
		else setCadencesDropdown({ sr_no: lead.sr_no, cadences: lead.cadences });
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
		if (lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL) {
			body.link = {
				stopPreviousCadences,
				loaderId: loader.current.ids.loader2,
				leads: [lead].map(l => {
					delete l.error;
					delete l.success;
					return l;
				}),
			};
			body.add = {};
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
						.filter(lead =>
							newLeads.find(errLead => errLead?.[DATA_CATEGORY_ID?.[type]] === lead.Id)
						)
						.map(lead => {
							let errorLead = errorLeads.find(
								errLead => errLead?.[DATA_CATEGORY_ID?.[type]] === lead.Id
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
		socket2.current.on("cadence-import-loader", data =>
			handleImportSocket(data, loader.current.ids.loader2)
		);
	}, []);

	useEffect(() => {
		setList(leads);
		setCheckedLeads(getLeadsExcludingError(leads));
	}, [leads]);

	const textDelete = COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()];
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
			<BackButton onClick={() => navigate(`/cadence/${cadence_id}?tab=list`)} />
			{importError?.error ? (
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
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]} {cadence_name}
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
							<tr key={lead.sr_no}>
								<td onClick={e => e.stopPropagation()}>
									<Checkbox
										className={styles.checkBox}
										checked={checkedLeads?.includes(lead.sr_no)}
										disabled={isLeadError(lead)}
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
									<div>{lead["Full Name"]}</div>
								</td>
								<td>{lead["Company"]} </td>
								<td>{lead["Job Position"] ?? "NA"}</td>
								<td>
									{lead?.emails?.map((mail, index) => index === 0 && mail.email_id)}
								</td>
								<td>{lead.owner_full_name}</td>
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
										{lead.status === LEAD_STATUS.USER_NOT_PRESENT && (
											<ThemedButton
												onClick={() =>
													handleErrorClick({
														id: lead.sr_no,
														error: "User not present in cadence",
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
													handleErrorClick({ id: lead.sr_no, error: lead.error?.msg })
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
									<div
										className={`${styles.dropDownMenu} ${styles.cadences} ${
											lead.sr_no === errorDropdown.id ? styles.isActive : ""
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
											onClick={() => handleMenuClick(lead.sr_no)}
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
											lead.sr_no === optionsDropdown ? styles.isActive : ""
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
										<Button
											onClick={() =>
												setDeleteModal({
													name: `${lead.first_name ?? ""} ${lead.last_name ?? ""}`,
													id: lead.sr_no,
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
