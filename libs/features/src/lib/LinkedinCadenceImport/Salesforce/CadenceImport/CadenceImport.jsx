import {
	Button,
	DeleteModal,
	Div,
	PageContainer,
	Spinner,
	Title,
	Tooltip,
	Modal,
} from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useCadenceImportSalesforce,
	useCadenceImportLinkedinSalesforce,
	useSocket,
	useUser,
	useEnrichments,
	useEnrichmentsConfig,
	// useExtensionFieldMap,
} from "@cadence-frontend/data-access";
import { ENV } from "@cadence-frontend/environments";
import {
	Cadences,
	ErrorGradient,
	More,
	Salesforce,
	SalesforceBox,
	Trash,
	LushaLogo,
} from "@cadence-frontend/icons";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useQuery } from "@cadence-frontend/utils";
import {
	BackButton,
	Checkbox,
	CollapseContainer,
	Table,
	ThemedButton,
	CheckboxWithTick,
} from "@cadence-frontend/widgets";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "./CadenceImport.module.scss";
import Actions from "./components/Actions/Actions";
import LinkLeadsModal from "../../components/LinkLeadsModal/LinkLeadsModal";
import {
	DATA_CATEGORY,
	DATA_CATEGORY_ID,
	getLeadsExcludingError,
	isLeadError,
	LEAD_STATUS,
	isLeadDuplicate,
} from "./constants";
import { ENRICHMENT_SERVICES } from "@cadence-frontend/constants";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const CadenceImport = () => {
	const navigate = useNavigate();
	const userLocal = useRecoilValue(userInfo);
	const { user } = useUser({ user: true });
	const { enrichmentsData } = useEnrichments(true);
	const {
		enrichmentsConfig,
		fetchEnrichmentsConfig,
		enrichmentsConfigLoading,
		updateEnrichmentsConfig,
	} = useEnrichmentsConfig();
	// const {
	// 	extensionFieldMaps,
	// 	updateAllExtensionFieldMaps,
	// 	fetchExtensionFieldMapsLoading,
	// } = useExtensionFieldMap(true);
	const { addError } = useContext(MessageContext);
	const [socket1] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket2] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket3] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const [socket4] = useSocket(ENV.BACKEND, "/socket-service/socket");
	const query = useQuery();
	const salesforce_id = query.get("salesforce_id");
	const search_url = query.get("search_url");
	const type = query.get("type");
	const limit = query.get("limit");
	const cookie = query.get("cookie");
	const sncookie = query.get("sncookie");
	const list_id = query.get("list_id");
	const selections = query.get("selections")?.split(",");

	//refs
	const loader = useRef({ ids: { loader1: "", loader2: "" }, length: 0 });
	const loader1 = useRef(0);
	const loader2 = useRef(0);
	const loader3 = useRef(0);

	//dropdowns
	const [optionsDropdown, setOptionsDropdown] = useState(false);
	const [cadencesDropdown, setCadencesDropdown] = useState(false);
	const [errorDropdown, setErrorDropdown] = useState(false);
	//states
	const [socketLoading, setSocketLoading] = useState(true);
	const [list, setList] = useState([]);
	const [checkedLeads, setCheckedLeads] = useState([]);
	const [crm, setCrm] = useState(true);
	const [checkedIssueLead, setCheckedIssueLead] = useState([]);
	const [isModal, setIsModal] = useState(false);
	const [cadenceSelected, setCadenceSelected] = useState({ id: "", name: "" });
	const [progress, setProgress] = useState(0);
	const [socketLoaderMessage, setSocketLoaderMessage] = useState("Importing Leads");
	const [exportedOnce, setExportedOnce] = useState(false);
	const [checked, setChecked] = useState(false);

	//modals
	const [deleteModal, setDeleteModal] = useState(false);
	const [linkLeadsModal, setLinkLeadsModal] = useState(false);

	//constants
	let TABLE_COLUMNS = [
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
		// "Location",
		"Job Position",
		"Linkedin Url",
		"Public ID",
		"Cadence",
		"Action",
	];
	const [tableColumns, setTableColumns] = useState(TABLE_COLUMNS);

	//api
	const cadenceImportDataAccess = useCadenceImportLinkedinSalesforce(
		{ salesforce_id, list_id, type, selections, lead_id: cadencesDropdown },
		{ leads: true }
	);

	var {
		leads,
		importLoading,
		addLoading,
		importError,
		addList,
		useSearchExport,
		useBulkEnrichments,
		useExtensionFieldMap,
	} = cadenceImportDataAccess;
	const { postSearchExport, postSearchExportLoading } = useSearchExport();
	const { postBulkEnrichment, postBulkEnrichmentLoading } = useBulkEnrichments();
	const { postExtensionFieldMap, postExtensionFieldMapLoading } = useExtensionFieldMap();
	let extensionFieldMaps = {};
	const [extensionFieldMapState, setExtensionFieldMap] = useState({});

	importLoading = false;
	importError = false;
	useEffect(() => {
		postExtensionFieldMap(
			{
				type: "salesforce",
			},
			{
				onSuccess: data => {
					extensionFieldMaps.lead_map = data?.data?.salesforce_lead;
					extensionFieldMaps.contact_map = data?.data?.salesforce_contact;
					setExtensionFieldMap({
						lead_map: data?.data?.salesforce_lead,
						contact_map: data?.data?.salesforce_contact,
					});
					addPhoneAndEmailToTable();
					setTableColumns(TABLE_COLUMNS);
				},
			}
		);
		loader1.current = uuidv4();
		loader2.current = uuidv4();
		loader3.current = uuidv4();
		postSearchExport(
			{
				cookie: cookie,
				profile_limit: limit,
				search_url: search_url,
				loader_id: loader1.current,
				li_a: sncookie,
			},
			{
				onSuccess: data => {
					if (data.msg === "Already fetched profiles") {
						setSocketLoading(false);
						importLoading = true;
						//add lead id
						data?.data?.map((item, index) => {
							data.data[index]["Id"] = index;
						});
						if (data.data) {
							let finalData = addPhoneAndEmailToList(data.data);
							setList(finalData);
						}
					}
				},
			}
		);
	}, []);

	useEffect(() => {
		setTableColumns(prevColumns => {
			// Make a shallow copy of the previous state
			const newColumns = [...prevColumns];

			// Update the Checkbox component with the new checked state
			newColumns[0] = (
				<Checkbox
					className={styles.checkBox}
					checked={
						checkedLeads?.length === getLeadsExcludingError(list)?.length &&
						list?.length > 0
					}
					onChange={() => {
						if (list?.length > 0)
							checkedLeads?.length !== getLeadsExcludingError(list).length
								? setCheckedLeads(getLeadsExcludingError(list))
								: setCheckedLeads([]);
						setChecked(prevChecked => !prevChecked);
					}}
				/>
			);

			return newColumns;
		});
	}, [checked, list, checkedLeads]);

	//funtions
	const handleCadencesClick = lead => {
		resetDropdowns();
		if (lead.Id === cadencesDropdown.id) setCadencesDropdown(false);
		else
			setCadencesDropdown({
				id: lead.Id,
				cadences: lead.Cadences.map(cad => ({
					name: cad.Cadences[0]?.name,
					cadence_id: cad.Cadences[0]?.cadence_id,
				})),
			});
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

	// const handleAddToCadence = (lead, stopPreviousCadences) => {
	// 	// loader.current = {
	// 	// 	ids: {
	// 	// 		loader1: uuidv4(),
	// 	// 		loader2: uuidv4(),
	// 	// 	},
	// 	// 	length:
	// 	// 		list.filter(
	// 	// 			lead =>
	// 	// 				checkedLeads.includes(lead.Id) &&
	// 	// 				lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL
	// 	// 		).length +
	// 	// 		list.filter(
	// 	// 			lead =>
	// 	// 				checkedLeads.includes(lead.Id) &&
	// 	// 				(lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL ||
	// 	// 					lead.status === LEAD_STATUS.LEAD_INACTIVE)
	// 	// 		).length,
	// 	// };
	// 	// console.log("---socket join room---");
	// 	// socket1.current.emit("join-room", loader.current.ids.loader1);
	// 	// socket2.current.emit("join-room", loader.current.ids.loader2);
	// 	// resetDropdowns();
	// 	// if (!cadenceSelected.id) return addError("Please select a cadence");
	// 	// setCheckedLeads([lead.Id]);
	// 	// let body = {};
	// 	// if (lead.status === LEAD_STATUS.LEAD_ABSENT_IN_TOOL) {
	// 	// 	body.add = {
	// 	// 		loaderId: loader.current.ids.loader1,
	// 	// 		cadence_id: cadenceSelected.id.toString(),
	// 	// 		[DATA_CATEGORY[type]]: [lead].map(l => {
	// 	// 			delete l.error;
	// 	// 			delete l.success;
	// 	// 			return l;
	// 	// 		}),
	// 	// 	};
	// 	// }
	// 	// if (lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL) {
	// 	// 	body.link = {
	// 	// 		stopPreviousCadences,
	// 	// 		loaderId: loader.current.ids.loader2,
	// 	// 		cadence_id: cadenceSelected.id.toString(),
	// 	// 		[DATA_CATEGORY[type]]: [lead].map(l => {
	// 	// 			delete l.error;
	// 	// 			delete l.success;
	// 	// 			return l;
	// 	// 		}),
	// 	// 	};
	// 	// }
	// 	// addList(body, {
	// 	// 	onSuccess: data => {
	// 	// 		setCheckedLeads([]);
	// 	// 		let errorLeads = [
	// 	// 			...(data[0]?.element_error || []),
	// 	// 			...(data[1]?.element_error || []),
	// 	// 		];
	// 	// 		let successLeads = [
	// 	// 			...(data[0]?.element_success || []),
	// 	// 			...(data[1]?.element_success || []),
	// 	// 		];
	// 	// 		let newLeads = [...errorLeads, ...successLeads];
	// 	// 		setList(prev =>
	// 	// 			prev
	// 	// 				.filter(lead =>
	// 	// 					newLeads.find(errLead => errLead[DATA_CATEGORY_ID[type]] === lead.Id)
	// 	// 				)
	// 	// 				.map(lead => {
	// 	// 					let errorLead = errorLeads.find(
	// 	// 						errLead => errLead[DATA_CATEGORY_ID[type]] === lead.Id
	// 	// 					);
	// 	// 					if (errorLead) return { ...lead, error: { msg: errorLead.msg } };
	// 	// 					return { ...lead, success: true };
	// 	// 				})
	// 	// 		);
	// 	// 	},
	// 	// 	onError: error =>
	// 	// 		addError(error?.response?.data?.msg || "Some error occured, please try again"),
	// 	// });
	// };

	const handleSalesforceIconClick = lead => {
		let url = "";
		if (type === "lead" || type === "lead_list")
			url = `${user?.Salesforce_Token?.instance_url}/lightning/r/Lead/${lead.Id}/view`;
		else
			url = `${user?.Salesforce_Token?.instance_url}/lightning/r/Contact/${lead.Id}/view`;
		if (url) window.open(url, "_blank");
		else addError({ text: "This lead does not have the required info." });
	};

	const resetDropdowns = () => {
		setOptionsDropdown(false);
		setCadencesDropdown(false);
		setErrorDropdown(false);
		setLinkLeadsModal(false);
	};

	//handle loader socket function for both loaders that adds both loader values and show it in the progress bar
	// const handleImportSocket = (data, id) => {
	// 	if (loader.current.ids.loader1 !== id && loader.current.ids.loader2 !== id) return;
	// 	if (loader.current.ids.loader1 === id) loader1.current = data.index;
	// 	if (loader.current.ids.loader2 === id) loader2.current = data.index;

	// 	let totalProgress =
	// 		((loader1.current + loader2.current) / loader.current.length) * 100;
	// 	setProgress(Math.floor(totalProgress));
	// };

	//sideeffects

	// useEffect(() => {
	// 	setList(leads);
	// 	if (leads) setCheckedLeads(getLeadsExcludingError(leads));
	// 	if (leads) {
	// 		console.log(leads);
	// 	}
	// }, [leads]);

	useEffect(() => {
		console.log("Set Checkbox Called");
		if (list?.length > 0)
			// checkedLeads?.length !== getLeadsExcludingError(list).length
			// 	? setCheckedLeads(getLeadsExcludingError(list))
			// 	: setCheckedLeads([]);
			setCheckedLeads(getLeadsExcludingError(list));
	}, [list]);

	// useEffect(() => {
	// 	setList([
	// 		{
	// 			first_name: "Kapil",
	// 			last_name: "Dev",
	// 			full_name: "Kapil Dev",
	// 			location: "India",
	// 			job_position: "Managing Director",
	// 			linkedin_url: "https://linkedin.com/in/devkapil",
	// 			public_id: "devkapil",
	// 			member_urn_id: "17588348",
	// 			account: {
	// 				name: "",
	// 				url: "",
	// 				linkedin_url: "",
	// 			},
	// 		},
	// 		{
	// 			first_name: "Feelix",
	// 			last_name: "Currea",
	// 			full_name: "Feelix Currea",
	// 			location: "India",
	// 			job_position: "CEO - Chief Executive Officer",
	// 			linkedin_url: "https://linkedin.com/in/feelix-currea-b317776",
	// 			public_id: "feelix-currea-b317776",
	// 			member_urn_id: "19816597",
	// 			account: {
	// 				name: "Personnel Search Services Group",
	// 				url: "https://bio.link/pssindia",
	// 				linkedin_url: "https://www.linkedin.com/company/23715",
	// 				city: "Mumbai",
	// 				country: "IN",
	// 				state: "Maharashtra",
	// 				size: "51-200",
	// 				zip_code: "400025",
	// 				industry: "Staffing & Recruiting",
	// 				location: "308 Prabhadevi Estate,, Mumbai, Maharashtra, 400025, IN",
	// 				phone_number: "+91  8657506265",
	// 				founded_year: 1981,
	// 			},
	// 		},
	// 	]);
	// 	//setCheckedLeads(getLeadsExcludingError(leads));
	// }, [leads]);

	//create 2 socket connections for 2 loaders (add, link)

	const handleSetExportProfiles = data => {
		if (data.action === "search") {
			setList([]);
			importLoading = true;

			//add lead id
			data?.data?.map((item, index) => {
				data.data[index]["Id"] = index;
			});

			if (data.data) {
				let finalData = addPhoneAndEmailToList(data.data);
				setList(finalData);
				setSocketLoading(false);
			}
		} else {
			setExportedOnce(true);
			setList([]);
			let pushArray = [];
			data?.data?.map((item, index) => {
				if (item.hasOwnProperty("error") || item.hasOwnProperty("success")) {
					//Append error to profile
					data.data[index].profile["Id"] = item.id;

					if (item.error.length > 0) data.data[index].profile["error"] = item.error;
					if (item.success.length > 0) data.data[index].profile["success"] = item.success;
					pushArray.push(data?.data[index].profile);
				}
			});
			setList(pushArray);
			setSocketLoading(false);
			setCheckedLeads([]);
		}
	};

	const handleLoaderProgress = data => {
		setProgress(0);
		let totalProgress = (data.index / data.size) * 100;
		setProgress(Math.floor(totalProgress));
	};

	useEffect(() => {
		socket4.current.emit("join-room", loader3.current);
		socket4.current.on("cadence-import-loader", data => {
			handleLoaderProgress(data);
		});

		socket3.current.emit("join-room", loader2.current);
		socket3.current.on("cadence-import-loader", data => {
			handleLoaderProgress(data);
		});
		socket2.current.emit("join-room", loader1.current);
		socket2.current.on("cadence-import-loader", data => {
			handleLoaderProgress(data);
		});
		socket1.current.emit("join-room", userLocal.email);

		socket1.current.on("profiles", data => {
			handleSetExportProfiles(data);
		});
	}, []);

	const addPhoneAndEmailToTable = () => {
		// alert("called");
		if (type === "salesforce_lead") {
			const phoneNumbers = extensionFieldMaps?.lead_map?.phone_numbers ?? null;
			const emails = extensionFieldMaps?.lead_map?.emails ?? null;
			if (phoneNumbers?.length > 0) {
				console.log("ADDING PHNO TO TABLE");
				phoneNumbers
					?.slice(0)
					.reverse()
					.map((item, index) => {
						TABLE_COLUMNS.splice(6, 0, item);
					});
			}
			if (emails?.length > 0) {
				console.log("ADDING EMAil TO TABLE");
				emails
					?.slice(0)
					.reverse()
					.map((item, index) => {
						TABLE_COLUMNS.splice(6, 0, item);
					});
			}
		} else {
			const phoneNumbers = extensionFieldMaps?.contact_map?.phone_numbers ?? null;
			const emails = extensionFieldMaps?.contact_map?.emails ?? null;
			if (phoneNumbers?.length > 0) {
				phoneNumbers
					?.slice(0)
					.reverse()
					.map((item, index) => {
						TABLE_COLUMNS.splice(6, 0, item);
					});
			}

			if (emails?.length > 0) {
				emails
					?.slice(0)
					.reverse()
					.map((item, index) => {
						TABLE_COLUMNS.splice(6, 0, item);
					});
			}
		}

		console.log({ TABLE_COLUMNS });
	};
	// addPhoneAndEmailToTable();

	const addPhoneAndEmailToList = data => {
		// alert("called blah blah blah");
		let emails_obj = {};
		let phone_numbers_obj = {};

		if (type === "salesforce_lead") {
			const phoneNumbers = extensionFieldMaps?.lead_map?.phone_numbers ?? null;
			const emails = extensionFieldMaps?.lead_map?.emails ?? null;
			if (phoneNumbers?.length > 0) {
				phoneNumbers?.map((item, index) => {
					phone_numbers_obj[item] = "";
				});
			}
			if (emails?.length > 0) {
				emails?.map((item, index) => {
					emails_obj[item] = "";
				});
			}
		} else {
			const phoneNumbers = extensionFieldMaps?.contact_map?.phone_numbers ?? null;
			const emails = extensionFieldMaps?.contact_map?.emails ?? null;
			if (phoneNumbers?.length > 0) {
				phoneNumbers?.map((item, index) => {
					phone_numbers_obj[item] = "";
				});
			}
			if (emails?.length > 0) {
				emails?.map((item, index) => {
					emails_obj[item] = "";
				});
			}
		}

		data.map((item, index) => {
			data[index]["phone_numbers"] = phone_numbers_obj;
			data[index]["emails"] = emails_obj;
		});

		return data;
	};

	const onRemoveSelected = () => {
		if ([...new Set(checkedIssueLead)].length) {
			const data = list?.filter(ld => {
				let isLead = [...new Set(checkedIssueLead)].find(lead => lead.Id === ld.Id);

				return isLead?.Id !== ld?.Id;
			});

			setCheckedIssueLead([]);

			const checkedData = checkedLeads.filter(ld => {
				let isLead = [...new Set(checkedIssueLead)].find(lead => lead.Id === ld);
				return isLead?.Id === ld?.Id;
			});

			setCheckedLeads(checkedData);

			setList(data);
			setIsModal(false);
		}
	};

	const removeFieldsNotFoundInExtensionFieldMap = enrichment => {
		let enrichment_email = enrichment.emails;
		let enrichment_phone_numbers = enrichment.phone_numbers;
		if (type === "salesforce_lead") {
			console.log("---removeFieldsNotFoundInExtensionFieldMap---");
			console.log({ extensionFieldMapState });
			const phoneNumbers = extensionFieldMapState?.lead_map?.phone_numbers ?? null;
			const emails = extensionFieldMapState?.lead_map?.emails ?? null;

			Object.keys(enrichment_phone_numbers).every(key => {
				if (phoneNumbers.includes(key)) {
					return true;
				} else {
					delete enrichment_phone_numbers[key];
					return false;
				}
			});

			Object.keys(enrichment_email).every(key => {
				if (emails.includes(key)) {
					return true;
				} else {
					delete enrichment_email[key];
					return false;
				}
			});
		} else {
			const phoneNumbers = extensionFieldMapState?.contact_map?.phone_numbers ?? null;
			const emails = extensionFieldMapState?.contact_map?.emails ?? null;

			Object.keys(enrichment_phone_numbers).every(key => {
				if (phoneNumbers.includes(key)) {
					return true;
				} else {
					delete enrichment_phone_numbers[key];
					return false;
				}
			});

			Object.keys(enrichment_email).every(key => {
				if (emails.includes(key)) {
					return true;
				} else {
					delete enrichment_email[key];
					return false;
				}
			});
		}

		let finalObj = { phone_numbers: enrichment_phone_numbers, emails: enrichment_email };
		return finalObj;
	};
	const handleLeadEnrich = service => {
		setProgress(0);
		setSocketLoading(true);
		//Filtering List according to checkboxes
		let profilesArrayToSend = [];
		checkedLeads.map((item, index) => {
			profilesArrayToSend.push(list[item]);
		});

		const successCb = data => {
			setSocketLoading(false);
			let list_copy = list;
			if (data?.data?.length) {
				switch (service) {
					case ENRICHMENT_SERVICES.LUSHA:
						for (let index = 0; index < data.data.length; index++) {
							const dataObj = data.data[index];

							if (dataObj.msg === "Error") {
								if (dataObj.error?.includes("limit")) {
									addError({ text: dataObj.error });
									break;
								}
								continue;
							}

							let lusha = {
								phone_numbers: {
									...list_copy[dataObj.id].phone_numbers, //Spread already existing phone number in list copy based on list copy index = id
									...dataObj.data.phone_numbers.lusha, //Spread data from enrichment
								},
								emails: {
									...list_copy[dataObj.id].emails,
									...dataObj.data.emails.lusha,
								},
							};
							lusha = removeFieldsNotFoundInExtensionFieldMap(lusha);
							list_copy[dataObj.id].phone_numbers = lusha.phone_numbers;
							list_copy[dataObj.id].emails = lusha.emails;
						}
						break;

					case ENRICHMENT_SERVICES.KASPR:
						for (let index = 0; index < data.data.length; index++) {
							const dataObj = data.data[index];

							if (dataObj.msg === "Error") {
								if (dataObj.error?.includes("limit")) {
									addError({ text: dataObj.error });
									break;
								}
								continue;
							}

							let kaspr = {
								phone_numbers: {
									...list_copy[dataObj.id].phone_numbers,
									...dataObj.data.phone_numbers.kaspr,
								},
								emails: {
									...list_copy[dataObj.id].emails,
									...dataObj.data.emails.kaspr,
								},
							};
							list_copy[dataObj.id].phone_numbers = kaspr.phone_numbers;
							list_copy[dataObj.id].emails = kaspr.emails;
						}
						break;

					case ENRICHMENT_SERVICES.HUNTER:
						for (let index = 0; index < data.data.length; index++) {
							const dataObj = data.data[index];

							if (dataObj.msg === "Error") {
								if (dataObj.error?.includes("limit")) {
									addError({ text: dataObj.error });
									break;
								}
								continue;
							}

							let hunter = {
								phone_numbers: {
									...list_copy[dataObj.id].phone_numbers,
								},
								emails: {
									...list_copy[dataObj.id].emails,
									...dataObj.data.emails.hunter,
								},
							};
							list_copy[dataObj.id].phone_numbers = hunter.phone_numbers;
							list_copy[dataObj.id].emails = hunter.emails;
						}
						break;

					case ENRICHMENT_SERVICES.DROPCONTACT:
						for (let index = 0; index < data.data.length; index++) {
							const dataObj = data.data[index];

							if (dataObj.msg === "Error") {
								if (dataObj.error?.includes("limit")) {
									addError({ text: dataObj.error });
									break;
								}
								continue;
							}

							let dropcontact = {
								phone_numbers: {
									...list_copy[dataObj.id].phone_numbers,
								},
								emails: {
									...list_copy[dataObj.id].emails,
									...dataObj.data.emails.dropcontact,
								},
							};

							list_copy[dataObj.id].phone_numbers = dropcontact.phone_numbers;
							list_copy[dataObj.id].emails = dropcontact.emails;
						}
						break;
				}
			}
			setList(list_copy);
		};
		const errorCb = err => {
			//setSocketLoading(false);
			setSocketLoading(false);
			addError({
				text: err?.response?.data?.msg,
				desc: err?.response?.data?.error,
				cId: err?.response?.data?.correlationId,
			});
		};
		switch (service) {
			case ENRICHMENT_SERVICES.LUSHA:
				setSocketLoaderMessage("Enriching Data from Lusha");
				postBulkEnrichment(
					{
						type: type,
						all_profiles: profilesArrayToSend,
						enrichment_type: service,
						loader_id: loader3.current,
					},
					{
						onError: errorCb,
						onSuccess: successCb,
					}
				);
				break;
			case ENRICHMENT_SERVICES.KASPR:
				setSocketLoaderMessage("Enriching Data from Kaspr");
				postBulkEnrichment(
					{
						type: type,
						all_profiles: profilesArrayToSend,
						enrichment_type: service,
						loader_id: loader3.current,
					},
					{
						onError: errorCb,
						onSuccess: successCb,
					}
				);
				break;
			case ENRICHMENT_SERVICES.HUNTER:
				setSocketLoaderMessage("Enriching Data from Hunter");
				postBulkEnrichment(
					{
						type: type,
						all_profiles: profilesArrayToSend,
						enrichment_type: service,
						loader_id: loader3.current,
					},
					{
						onError: errorCb,
						onSuccess: successCb,
					}
				);
				break;
			case ENRICHMENT_SERVICES.DROPCONTACT:
				setSocketLoaderMessage("Enriching Data from Drop Contact");
				postBulkEnrichment(
					{
						type: type,
						all_profiles: profilesArrayToSend,
						enrichment_type: service,
						loader_id: loader3.current,
					},
					{
						onError: errorCb,
						onSuccess: successCb,
					}
				);
				break;
		}
	};

	// useEffect(() => {
	// 	if (progress === 100) {
	// 		setSocketLoading(false);
	// 	}
	// }, [progress]);

	return (
		<PageContainer className={styles.pageContainer}>
			<BackButton onClick={() => navigate("/tasks")} />
			{importError?.error ? (
				<div className={styles.error}>
					<ErrorGradient size="38px" />
					<span className={styles.importFailed}>
						{COMMON_TRANSLATION.IMPORT_FAILED[user?.language?.toUpperCase()]}
					</span>
					<span>User does not have access to list</span>
					<CollapseContainer
						className={styles.errorCollapse}
						openByDefault={false}
						title={
							<div className={styles.header}>
								<SalesforceBox color="#00A1E0" /> Salesforce error message
							</div>
						}
					>
						<div className={styles.sfError}>{importError.msg}</div>
					</CollapseContainer>
				</div>
			) : socketLoading || addLoading ? (
				<div className={styles.loading}>
					<span className={styles.text}>
						{socketLoading && `${socketLoaderMessage} - ${progress}%`}
					</span>
					{addLoading && (
						<span className={styles.cadence}>
							<Cadences /> Adding {checkedLeads.length}{" "}
							{COMMON_TRANSLATION.PEOPLE_IN[user?.language?.toUpperCase()]}
							{cadenceSelected.name}
						</span>
					)}
					{socketLoading ? (
						<>
							<Spinner className={styles.spinner} />
							<progress max="100" value={progress}></progress>
						</>
					) : (
						<progress max="100" value={progress}></progress>
					)}
				</div>
			) : (
				<>
					<div className={styles.parent}>
						<Title className={styles.title} size="20px">
							Import
						</Title>
						{!exportedOnce && (
							<div className={styles.enrichments}>
								{enrichmentsConfig?.is_lusha_activated &&
									enrichmentsConfig?.lusha_linkedin_enabled &&
									enrichmentsConfig?.lusha_api_key &&
									enrichmentsData?.is_lusha_configured &&
									user?.lusha_service_enabled && (
										<ThemedButton
											className={styles.enrichBtn}
											theme={ThemedButtonThemes.GREY}
											// loading={enrichLeadLushaLoading}
											onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.LUSHA)}
											width="54px"
											height="40px"
											disabled={checkedLeads?.length === 0}
										>
											<LushaLogo size="20px" />
										</ThemedButton>
									)}
								{enrichmentsConfig?.is_kaspr_activated &&
									enrichmentsConfig?.kaspr_linkedin_enabled &&
									enrichmentsConfig?.kaspr_api_key &&
									enrichmentsData?.is_kaspr_configured &&
									user?.kaspr_service_enabled && (
										<ThemedButton
											className={styles.enrichBtn}
											theme={ThemedButtonThemes.GREY}
											// loading={enrichLeadKasprLoading}
											onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.KASPR)}
											width="54px"
											height="40px"
											disabled={checkedLeads?.length === 0}
										>
											<img
												src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/kaspr_logo.png"
												alt=""
											/>
										</ThemedButton>
									)}
								{enrichmentsConfig?.is_hunter_activated &&
									enrichmentsConfig?.hunter_linkedin_enabled &&
									enrichmentsConfig?.hunter_api_key &&
									enrichmentsData?.is_hunter_configured &&
									user?.hunter_service_enabled && (
										<ThemedButton
											className={styles.enrichBtn}
											theme={ThemedButtonThemes.GREY}
											// loading={enrichLeadHunterLoading}
											onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.HUNTER)}
											width="54px"
											height="40px"
											disabled={checkedLeads?.length === 0}
										>
											<img
												src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/hunter_logo.png"
												alt=""
											/>
										</ThemedButton>
									)}
								{enrichmentsConfig?.is_dropcontact_activated &&
									enrichmentsConfig?.dropcontact_linkedin_enabled &&
									enrichmentsConfig?.dropcontact_api_key &&
									enrichmentsData?.is_dropcontact_configured &&
									user?.dropcontact_service_enabled && (
										<ThemedButton
											className={styles.enrichBtn}
											theme={ThemedButtonThemes.GREY}
											// loading={enrichLeadDropcontactLoading}
											onClick={() => handleLeadEnrich(ENRICHMENT_SERVICES.DROPCONTACT)}
											width="54px"
											height="40px"
											disabled={checkedLeads?.length === 0}
										>
											<img src="https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/assets/dropcontact_logo.png" />
										</ThemedButton>
									)}
							</div>
						)}
					</div>
					{!exportedOnce && (
						<div className={styles.parent}>
							<div className={styles.row}>
								<CheckboxWithTick
									label={"Salesforce"}
									checked={!crm}
									onChange={value => {
										setCrm(prev => !prev);
									}}
									name={"name"}
								/>
								<CheckboxWithTick
									label={"Salesforce and Cadence"}
									checked={crm}
									onChange={value => {
										setCrm(prev => !prev);
									}}
									name={"name"}
								/>
							</div>
						</div>
					)}

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
						// socket2={socket2}
						setProgress={setProgress}
						setCheckedIssueLead={setCheckedIssueLead}
						checkedIssueLead={checkedIssueLead}
						onRemoveSelected={onRemoveSelected}
						isModal={isModal}
						setIsModal={setIsModal}
						search_url={search_url}
						type={type}
						setSocketLoading={setSocketLoading}
						loader2={loader2}
						crm={crm}
						setSocketLoaderMessage={setSocketLoaderMessage}
						exportedOnce={exportedOnce}
					/>

					<Table
						loading={importLoading}
						columns={tableColumns}
						noOfRows={6}
						className={styles.table}
						theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
						height="calc(100vh - 300px)"
					>
						{list?.map((lead, index) => {
							return (
								<tr key={lead.Id}>
									<td onClick={e => e.stopPropagation()}>
										<Checkbox
											className={styles.checkBox}
											checked={checkedLeads?.includes(lead.Id)}
											disabled={isLeadDuplicate(lead)}
											onChange={() => {
												checkedLeads?.includes(lead.Id)
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
											{!exportedOnce &&
											lead?.duplicate?.length &&
											lead.duplicate?.[0]?.integration_id > 0 &&
											type === "salesforce_lead" ? (
												<a
													href={`${userLocal.instance_url}/lightning/r/Lead/${lead.duplicate?.[0]?.integration_id}/view`}
													target="_blank"
													rel="noreferrer"
												>
													<Salesforce />
												</a>
											) : type === "salesforce_contact" ? (
												<a
													href={`${userLocal.instance_url}/lightning/r/Contact/${lead.duplicate?.[0]?.integration_id}/view`}
													target="_blank"
													rel="noreferrer"
												>
													<Salesforce />
												</a>
											) : null}
											{/* {!lead.duplicate?.[0]?.integration_id && lead?.integration_id?.length > 0 && type === "salesforce_lead" && (
												<a
													href={`${userLocal.instance_url}/lightning/r/Lead/${lead?.integration_id}/view`}
													target="_blank"
													rel="noreferrer"
												>
													<Salesforce />
												</a>
											)}
											{!lead.duplicate?.[0]?.integration_id && lead?.integration_id?.length > 0 && type === "salesforce_contact" && (
												<a
													href={`${userLocal.instance_url}/lightning/r/Contact/${lead?.integration_id}/view`}
													target="_blank"
													rel="noreferrer"
												>
													<Salesforce />
												</a>
											)} */}
											{/* <a
												href={`${userLocal.instance_url}/lightning/r/Lead/${lead.integration_id}/view`}
												target="_blank"
											>
												<Salesforce />
											</a> */}
											{lead.first_name} {lead.last_name}
										</div>
									</td>

									{/* <td>{lead.location}</td> */}

									<td>{lead.job_position ?? "NA"}</td>

									{/* <td>
										{lead?.emails?.map((mail, index) => index === 0 && mail.email_id)}
									</td> */}

									<td>{lead.linkedin_url}</td>

									<td>{lead.public_id ? lead.public_id : ""}</td>

									{lead?.emails
										? Object.keys(lead?.emails).length > 0 &&
										  Object.values(lead.emails).map((item, index) => {
												return <td>{item}</td>;
										  })
										: type === "salesforce_lead"
										? extensionFieldMapState?.lead_map?.emails.map((item, index) => {
												return <td></td>;
										  })
										: extensionFieldMapState?.contact_map?.emails.map((item, index) => {
												return <td></td>;
										  })}

									{lead?.phone_numbers
										? Object.keys(lead?.phone_numbers).length > 0 &&
										  Object.values(lead.phone_numbers).map((item, index) => {
												return <td>{item}</td>;
										  })
										: type === "salesforce_lead"
										? extensionFieldMapState?.lead_map?.phone_numbers.map(
												(item, index) => {
													return <td></td>;
												}
										  )
										: extensionFieldMapState?.contact_map?.phone_numbers.map(
												(item, index) => {
													return <td></td>;
												}
										  )}

									<td className={styles.actions}>
										<div className={styles.buttons}>
											{!exportedOnce && lead?.duplicate?.length > 0 && (
												<ThemedButton
													onClick={() =>
														handleErrorClick({
															id: lead.Id,
															error: "Duplicate exists in salesforce.",
														})
													}
													theme={ThemedButtonThemes.RED}
													className={styles.cadenceStatus}
													height="30px"
												>
													Duplicate
												</ThemedButton>
											)}
											{lead?.error?.length > 0 && (
												<ThemedButton
													onClick={() =>
														handleErrorClick({
															id: lead.Id,
															error: lead.error,
														})
													}
													theme={ThemedButtonThemes.RED}
													className={styles.cadenceStatus}
													height="30px"
												>
													{lead.error === "Duplicate exists in salesforce."
														? "Duplicate"
														: "Error"}
												</ThemedButton>
											)}
											{lead?.success?.length > 0 && (
												<ThemedButton
													theme={ThemedButtonThemes.GREEN}
													className={styles.cadenceStatus}
													height="30px"
												>
													Success
												</ThemedButton>
											)}

											{/* <ThemedButton
												onClick={() =>
													handleErrorClick({
														id: lead.Id,
														error: "User not present in cadence",
													})
												}
												theme={ThemedButtonThemes.RED}
												className={styles.cadenceStatus}
												height="30px"
											>
												Error
											</ThemedButton> */}
											{/* <ThemedButton
												onClick={() => handleCadencesClick(lead)}
												theme={ThemedButtonThemes.GREEN}
												className={styles.cadenceStatus}
												height="30px"
											>
												Active
											</ThemedButton>
											<ThemedButton
												onClick={() =>
													handleErrorClick({
														id: lead.Id,
														error: "User not present in cadence",
													})
												}
												theme={ThemedButtonThemes.RED}
												className={styles.cadenceStatus}
												height="30px"
											>
												Error
											</ThemedButton>
											<ThemedButton
												onClick={() =>
													handleErrorClick({ id: lead.Id, error: lead.error?.msg })
												}
												theme={ThemedButtonThemes.RED}
												className={styles.cadenceStatus}
												height="30px"
											>
												Error
											</ThemedButton> */}
										</div>
										<div
											className={`${styles.dropDownMenu} ${styles.cadences} ${
												lead.Id === errorDropdown.id ? styles.isActive : ""
											}`}
										>
											<div>
												<p>{errorDropdown?.error}</p>
											</div>
										</div>
									</td>

									{/* <td className={styles.actions}>
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
															id: lead.Id,
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
												lead.Id === cadencesDropdown.id ? styles.isActive : ""
											}`}
										>
											{cadencesDropdown?.cadences?.length ? (
												cadencesDropdown?.cadences?.map(cadence => (
													<div key={cadence.cadence_id}>{cadence.name}</div>
												))
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
									</td> */}

									<td className={styles.actions}>
										<Tooltip
											text={COMMON_TRANSLATION.MORE[user?.language?.toUpperCase()]}
										>
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
											{/* <Button
												disabled={isLeadError(lead)}
												onClick={() =>
													lead.status === LEAD_STATUS.LEAD_PRESENT_IN_TOOL
														? !cadenceSelected.id
															? addError("Please select a cadence")
															: setLinkLeadsModal(lead)
														: handleAddToCadence(lead)
												}
											>
												<Cadences />
												Add to cadence
											</Button> */}
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
							);
						})}
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
