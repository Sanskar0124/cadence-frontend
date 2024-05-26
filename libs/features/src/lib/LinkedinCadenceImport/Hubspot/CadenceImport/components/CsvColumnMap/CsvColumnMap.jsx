import { useCSVImportHubspot, useSettings } from "@cadence-frontend/data-access";
import { Close, Document, MailDeleted } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { MessageContext } from "@cadence-frontend/contexts";
import { ThemedButton } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate, useSearchParams } from "react-router-dom";
import ColumnMapping from "./components/ColumnMapping/ColumnMapping";
import ExtractedColumns from "./components/ExtractedColumns/ExtractedColumns";
import {
	DEFAULT_IT_FIELDS_STRUCT,
	getUnique,
	getRequiredField,
	VIEWS,
} from "./constants";
import styles from "./CsvColumnMap.module.scss";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";

function CsvColumnMap() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const cadenceName = searchParams.get("cadence_name");
	const cadenceId = searchParams.get("cadence_id");
	const { addError, addSuccess } = useContext(MessageContext);
	const [ringoverFields, setRingoverFields] = useState(Array(14).fill(null));
	const [extractedColumns, setExtractedColumns] = useState([]);
	const [displayedColumns, setDisplayedColumns] = useState([]);
	const [mappingFieldCompany, setMappingFieldCompany] = useState([]);
	const [mappingFieldContact, setMappingFieldContact] = useState([]);

	const csvImportHuspotDataAccess = useCSVImportHubspot();
	const {
		postContactsMutation,
		postContactsLoading,
		extractColumns,
		extractColumnsLoading,
	} = csvImportHuspotDataAccess;

	const user = useRecoilValue(userInfo);

	const {
		fetchSfMap,
		fetchSfMapLoading,
		fetchCompanyHpFieldsMutate,
		fetchContactHpFieldsMutate,
	} = useSettings({
		role: user.role,
		enabled: false,
	});

	const [mappingField, setMappingField] = useState([]);
	const [contactField, setContactField] = useState([]);
	const [companyField, setCompanyField] = useState([]);
	const [allSFFields, setallSFFields] = useState();
	const [originalItFields, setOriginalItFields] = useState(DEFAULT_IT_FIELDS_STRUCT);
	const [checkEmailsPhone, setCheckEmailsPhone] = useState({ email: [], phone: [] });

	const fetchSfFieldMap = () => {
		fetchContactHpFieldsMutate(VIEWS.CONTACT, {
			onSuccess: itFieldsFromServer => {
				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.CONTACT]: itFieldsFromServer?.map((field, i) => ({
						index: i,
						...field,
					})), //will have name, type, picklistVlaues(conditionally)
				}));
			},

			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});
		fetchCompanyHpFieldsMutate(VIEWS.COMPANY, {
			onSuccess: itFieldsFromServer => {
				setOriginalItFields(prev => ({
					...prev,
					[VIEWS.COMPANY]: itFieldsFromServer?.map((field, i) => ({
						index: i,
						...field,
					})), //will have name, type, picklistVlaues(conditionally)
				}));
			},

			onError: err => {
				addError({
					text: err?.response?.data?.msg,
					desc: err?.response?.data?.error,
					cId: err?.response?.data?.correlationId,
				});
			},
		});

		fetchSfMap(null, {
			onSuccess: ringoverFieldsFromServer => {
				const company = Object.keys(ringoverFieldsFromServer?.company_map)
					.map(f => ringoverFieldsFromServer?.company_map[f])
					.filter(f => f !== "name");

				let arr = [];

				Object.keys(ringoverFieldsFromServer?.contact_map).forEach(f => {
					if (f === "emails") {
						setCheckEmailsPhone(prev => ({
							...prev,
							email: [...ringoverFieldsFromServer?.contact_map[f]],
						}));
					} else if (f === "phone_numbers") {
						setCheckEmailsPhone(prev => ({
							...prev,
							phone: [...ringoverFieldsFromServer?.contact_map[f]],
						}));
					}

					if (f === "emails" || f === "phone_numbers") {
						arr.push(ringoverFieldsFromServer?.contact_map[f]);
					} else {
						arr.push(ringoverFieldsFromServer?.contact_map[f]);
					}
				});

				setContactField([
					...arr.flat(1).filter(f => f !== "firstname" && f !== "company"),
				]);

				setCompanyField([...company]);
			},

			onError: error => {
				// addError(error?.response?.data?.msg, error?.response?.data?.error);
			},
		});
	};

	useEffect(() => {
		fetchSfFieldMap();
	}, []);

	useEffect(() => {
		if (originalItFields?.contact?.length && originalItFields?.company?.length) {
			const getLabelForContact = originalItFields.contact.filter(f =>
				contactField.some(e => e === f.name)
			);
			setMappingFieldContact(getLabelForContact);
			const getLabelForCompany = originalItFields.company.filter(f =>
				companyField.some(e => e === f.name)
			);
			// .map(f => (f.name === "phone" ? { ...f, name: "company_phone" } : f));
			setMappingFieldCompany(getLabelForCompany);

			setMappingField(
				getRequiredField([
					...getLabelForCompany,
					...getLabelForContact,

					...[
						{ index: 0, name: "record_id", label: "Record ID", type: "string" },
						{ index: 1, name: "first_name", label: "First Name", type: "string" },

						{
							index: 2,
							name: "company_name",
							label: "Associated Company",
							type: "string",
						},
						{
							index: 3,
							name: "company_id",
							label: "Associated Company IDs",
							type: "string",
						},
						{
							index: 4,
							name: "owner",
							label: "Contact owner",
							type: "string",
						},
					],
				])?.map((f, i) => ({ ...f, index: i }))
			);
		}
	}, [originalItFields]);

	const handleDragEnd = e => {
		// console.log(e)
		const source = e.source;
		const destination = e.destination;

		const destinationDroppableId = e.destination?.droppableId;

		if (destination === undefined || destination === null) return null;

		if (
			source.droppableId === "extracted-col" &&
			destination.droppableId !== "extracted-col"
		) {
			//move extracted field to ringover field
			const insertIndex = e.destination.index;
			const extractedColIndex = e.source.index;
			const extractedColValue = extractedColumns[extractedColIndex];

			if (insertIndex > 100) {
				return;
			} else {
				if (
					(destinationDroppableId === "Record ID" && e.draggableId === "Record ID") ||
					(destinationDroppableId === "Associated Company IDs" &&
						e.draggableId === "Associated Company IDs") ||
					(destinationDroppableId === "Contact owner" &&
						e.draggableId === "Contact owner")
				) {
					const newRingoverFields = ringoverFields.filter(
						val => val !== extractedColValue
					);

					const deletedItem = ringoverFields[insertIndex];

					newRingoverFields.splice(insertIndex, 1, extractedColValue);

					setRingoverFields(newRingoverFields);
					// console.log(newRingoverFields);
					const newDisplayedColumns = displayedColumns;
					//move current value back to display list
					newDisplayedColumns.splice(
						extractedColumns.indexOf(deletedItem),
						0,
						deletedItem
					);
					//and remove selected field from display list
					newDisplayedColumns.splice(displayedColumns.indexOf(extractedColValue), 1);
					setDisplayedColumns(newDisplayedColumns);
				} else if (
					destinationDroppableId !== "Record ID" &&
					e.draggableId !== "Record ID" &&
					destinationDroppableId !== "Associated Company IDs" &&
					e.draggableId !== "Associated Company IDs" &&
					destinationDroppableId !== "Contact owner" &&
					e.draggableId !== "Contact owner"
				) {
					const newRingoverFields = ringoverFields.filter(
						val => val !== extractedColValue
					);

					const deletedItem = ringoverFields[insertIndex];

					newRingoverFields.splice(insertIndex, 1, extractedColValue);

					setRingoverFields(newRingoverFields);
					// console.log(newRingoverFields);
					const newDisplayedColumns = displayedColumns;
					//move current value back to display list
					newDisplayedColumns.splice(
						extractedColumns.indexOf(deletedItem),
						0,
						deletedItem
					);
					//and remove selected field from display list
					newDisplayedColumns.splice(displayedColumns.indexOf(extractedColValue), 1);
					setDisplayedColumns(newDisplayedColumns);
				}
			}
		} else if (
			source.droppableId !== "extracted-col" &&
			destination.droppableId === "extracted-col"
		) {
			//remove field from ringovermapped fields
			const ringoverIndex = e.source.index;
			const val = ringoverFields[ringoverIndex];
			const newRingoverFields = ringoverFields;

			newRingoverFields.splice(ringoverIndex, 1, null);
			setRingoverFields(newRingoverFields);

			//move extracted field back to display list
			const newDisplayedColumns = displayedColumns;
			newDisplayedColumns.splice(extractedColumns.indexOf(val), 0, val);
			setDisplayedColumns(newDisplayedColumns);
		} else if (
			source.droppableId !== "extracted-col" &&
			destination.droppableId !== "extracted-col"
		) {
			//reorder ringover field
			const intitalIndex = e.source.index;
			const newIndex = e.destination.index;
			const newRingoverFields = ringoverFields;
			if (newIndex > 100) {
				return;
			} else {
				if (intitalIndex !== newIndex) {
					//swap
					if (
						(destinationDroppableId === "Record ID" && e.draggableId === "Record ID") ||
						(destinationDroppableId === "Associated Company IDs" &&
							e.draggableId === "Associated Company IDs")
					) {
						[newRingoverFields[intitalIndex], newRingoverFields[newIndex]] = [
							newRingoverFields[newIndex],
							newRingoverFields[intitalIndex],
						];
						setRingoverFields(newRingoverFields);
					} else if (
						destinationDroppableId !== "Record ID" &&
						e.draggableId !== "Record ID" &&
						destinationDroppableId !== "Associated Company IDs" &&
						e.draggableId !== "Associated Company IDs"
					) {
						[newRingoverFields[intitalIndex], newRingoverFields[newIndex]] = [
							newRingoverFields[newIndex],
							newRingoverFields[intitalIndex],
						];
						setRingoverFields(newRingoverFields);
					}
				}
			}
		}
	};

	useEffect(() => {
		//set default values of RingoverField if extracted columns has it
		extractColumns(null, {
			onSuccess: res => {
				setExtractedColumns(res);

				const defaultDisplayedColumns = [...res];

				mappingField.forEach((value, index) => {
					if (res?.includes(value.label)) {
						//set default selection if values match
						const newRingoverFields = ringoverFields;

						newRingoverFields.splice(index, 1, value.label);
						setRingoverFields(newRingoverFields);
						//remove default selected column from selection display

						defaultDisplayedColumns.splice(
							defaultDisplayedColumns.indexOf(value.label),
							1
						);
					}
				});
				//set displayed columns after removing the ones used for default selection
				setDisplayedColumns(defaultDisplayedColumns);
			},
			onError: err =>
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error ?? "Please contact support",
					cId: err?.response?.data?.correlationId,
				}),
		});
	}, [originalItFields, mappingField]);

	const handleCancel = () => {
		navigate(`/cadence/${cadenceId}`);
	};

	function getFormData(object) {
		const formData = new FormData();
		Object.keys(object).forEach(key => {
			if (
				key === "emails" ||
				key === "last_name" ||
				key === "job_position" ||
				key === "zipcode" ||
				key === "phone_numbers" ||
				key === "account_phone_number" ||
				key === "country" ||
				key === "account_linkedin_url" ||
				key === "record_id" ||
				key === "first_name" ||
				key === "company_name" ||
				key === "company_id" ||
				key === "owner"
			) {
				if (key === "emails" || key === "phone_numbers") {
					formData.append(key, JSON.stringify(object[key]));
				} else {
					formData.append(key, object[key]);
				}
			} else {
				// console.log("Error Handling");
			}
		});
		return formData;
	}
	const handleImportLeads = checkEmailsPhone => {
		if (
			!ringoverFields.includes("Record ID") ||
			!ringoverFields.includes("First Name") ||
			!ringoverFields.includes("Associated Company") ||
			!ringoverFields.includes("Associated Company IDs") ||
			!ringoverFields.includes("Contact owner")
		) {
			return addError({ text: "Required fields are empty" });
		} else {
			const checkEmailPhoneContain = word => {
				if (word?.toLowerCase().split(" ").includes("phone")) {
					return { phone: true };
				} else if (word?.toLowerCase().split(" ").includes("email")) {
					return { email: true };
				} else {
					return false;
				}
			};

			const check = name => {
				const contactEmails = checkEmailsPhone.email;
				const contactPhones = checkEmailsPhone.phone;

				if (contactEmails.includes(name)) {
					return { email: true };
				} else if (contactPhones.includes(name) || contactPhones.includes(name)) {
					return { phone: true };
				}
			};

			const getSuitabelCompanyObj = obj => {
				const newObj = {};

				Object.keys(obj).forEach(key => {
					if (key === "zip") {
						newObj["zipcode"] = obj[key];
					} else if (key === "phone") {
						newObj["account_phone_number"] = obj[key];
					} else if (key === "website") {
						newObj["account_linkedin_url"] = obj[key];
					} else {
						newObj[key] = obj[key];
					}
				});

				return newObj;
			};

			const getSuitabelContactObj = obj => {
				const newObj = {};

				Object.keys(obj).forEach(key => {
					if (key === "lastname") {
						newObj["last_name"] = obj[key];
					} else if (key === "jobtitle") {
						newObj["job_position"] = obj[key];
					} else {
						newObj[key] = obj[key];
					}
				});

				return newObj;
			};

			const getSuitabelDefautlObj = obj => {
				const newObj = {};
				Object.keys(obj).forEach(key => {
					newObj[key] = obj[key];
				});

				return newObj;
			};

			const obj = {};

			let emailArray = [];
			let phoneArray = [];

			const mappingFieldForContact = mappingFieldContact.map((f, i) => ({
				...f,
				index: i,
			}));
			const mappingFieldForCompany = mappingFieldCompany.map((f, i) => ({
				...f,
				index: i,
			}));
			const defaultFields = [];

			mappingField.forEach(f => {
				if (companyField.includes(f.name)) {
					// mappingFieldForCompany.push(f)
				} else if (contactField.includes(f.name)) {
					// mappingFieldForContact.push(f)
				} else {
					defaultFields.push(f);
				}
			});

			const contactObj = {};
			const companyObj = {};
			const defaultObj = {};

			mappingFieldForContact?.forEach((rf, i) => {
				extractedColumns?.forEach((e, idx) => {
					if (rf.label) {
						if (rf.label === e) {
							if (check(rf.name)?.phone) {
								phoneArray.push({
									type: mappingField?.find(fi => fi.label === rf.label).name,
									column_index: idx,
								});

								obj.phone_numbers = { elements: phoneArray };

								contactObj.phone_numbers = { elements: phoneArray };
							} else if (check(rf.name)?.email) {
								emailArray.push({
									type: mappingField?.find(fi => fi.label === rf.label).name,
									column_index: idx,
								});

								obj.emails = { elements: emailArray };
								contactObj.emails = { elements: emailArray };
							} else {
								obj[mappingField?.find(fi => fi.label === rf.label).name] = idx;
								contactObj[mappingField?.find(fi => fi.label === rf.label).name] = idx;
							}
						}
					}
				});
			});

			mappingFieldForCompany.forEach((rf, i) => {
				extractedColumns?.forEach((e, idx) => {
					if (rf.label) {
						if (rf.label === e) {
							obj[mappingField?.find(fi => fi.label === rf.label).name] = idx;
							companyObj[mappingField?.find(fi => fi.label === rf.label).name] = idx;
						}
					}
				});
			});

			defaultFields.forEach((rf, i) => {
				extractedColumns?.forEach((e, idx) => {
					if (rf.label) {
						if (rf.label === e) {
							obj[mappingField?.find(fi => fi.label === rf.label).name] = idx;
							defaultObj[mappingField?.find(fi => fi.label === rf.label).name] = idx;
						}
					}
				});
			});

			postContactsMutation(
				getFormData({
					...getSuitabelContactObj(contactObj),
					...getSuitabelCompanyObj(companyObj),
					...getSuitabelDefautlObj(defaultObj),
				}),
				{
					onSuccess: mssg => {
						sessionStorage.setItem(
							`contacts-cadence-${cadenceId}`,
							JSON.stringify(mssg.contacts)
						);
						navigate(
							`/cadence-import?cadence_id=${cadenceId}&cadence_name=${cadenceName}`
						);
					},
					onError: mssg => {
						addError({ text: "Error Occured while trying to save mappings" });
					},
				}
			);
		}
	};
	return (
		<div className={styles.importCsv}>
			<div className={styles.header}>
				<div className={styles.cancel} onClick={handleCancel}>
					<Close color={"#037dfc"} />
					Cancel Import
				</div>
				<div className={styles.file}>
					<Document />
					{sessionStorage.getItem("file-name-csv")}
				</div>
				<ThemedButton
					theme={ThemedButtonThemes.PRIMARY}
					onClick={() => handleImportLeads(checkEmailsPhone)}
					className={styles.actionBtn}
					loading={postContactsLoading}
					loadingText="Importing"
				>
					Import Leads
				</ThemedButton>
			</div>
			<div className={styles.workspace}>
				<DragDropContext onDragEnd={e => handleDragEnd(e)}>
					<ColumnMapping
						ringoverFields={ringoverFields}
						extractColumnsLoading={extractColumnsLoading}
						// column={allSFFields}
						column={mappingField}
					/>
					<ExtractedColumns
						extractedColumns={extractedColumns}
						displayedColumns={displayedColumns}
						extractColumnsLoading={extractColumnsLoading}
					/>
				</DragDropContext>
			</div>
		</div>
	);
}

export default CsvColumnMap;
