import { ENV } from "@cadence-frontend/environments";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import "./Editor.scss";
import TextEditor from "@cadence-ringover/editor";
import "./Editor.css";
import styles from "./Editor.module.scss";
import { Close, Info } from "@cadence-frontend/icons";
import { SearchBar } from "@cadence-frontend/widgets";
import { Div, ErrorBoundary, Spinner, Tooltip } from "@cadence-frontend/components";

import {
	Colors,
	stripTrackingImage,
	useDidMountEffect,
	useForceUpdate,
} from "@cadence-frontend/utils";
import {
	useOutsideClickHandler,
	clearAttachments,
	processCustomVariables,
} from "@cadence-frontend/utils";
import {
	CUSTOM_VARIABLES_OPTIONS,
	EDITOR_CONFIG,
	ACCOUNT_CUSTOM_VARIABLES,
	LEAD_CUSTOM_VARIABLES,
	USER_CUSTOM_VARIABLES,
	MISC_CUSTOM_VARIABLES,
	EDITOR_ATTACHMENT_EVENTS_ENUM,
	IS_CUSTOM_VAR_FIELD_MAP_AVAILABLE,
	formatter,
	getLeadAccountVariablesByIntegration,
	INTEGRATION_MAP_KEYS,
	reconcileAttachments,
	COUNT_AVAILABLE,
	parseEditorValues,
	CUSTOM_VARS_NAMES_BY_INTEGRATION,
} from "./constants";
import { MessageContext } from "@cadence-frontend/contexts";
import {
	useSettings,
	useUser,
	useEmailSignature,
	useAttachments,
} from "@cadence-frontend/data-access";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import {
	LEAD_INTEGRATION_TYPES,
	CRM_CUSTOM_VARIABLES,
	INTEGRATION_TYPE,
	IS_CUSTOM_VARS_AVAILABLE,
} from "@cadence-frontend/constants";
import CalendlyErrorModal from "./components/CalendlyErrorModal/CalendlyErrorModal";

const Editor = ({
	value,
	setValue,
	className,
	files,
	setFiles,
	disabled = false,
	height = "100%",
	width = "100%",
	loading = false,
	theme = "no_attachments",
	showAllMiscVars = true,
	showCRMCustomVars = false,
	// fileIdsRef,
	lead = null,
	fieldMap = null,
	style,
	charLimit = null,
	placeholder,
	...rest
}) => {
	const editorRef = useRef(null);
	const { deleteAttachment } = useAttachments();

	const { fetchSfMap, fetchSfMapLoading } = useSettings(false);
	const textareaRef = useRef(null);
	const { addError } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [customVariables, setCustomVariables] = useState({
		account_map: {},
		lead_map: {},
		user_map: user,
		loading: true,
	});
	const [editorReady, setEditorReady] = useState(true);

	useEffect(() => {
		if (charLimit) {
			// if (parseEditorValues(value)?.length < charLimit) {
			// 	setNumberOfChar(parseEditorValues(value)?.length);
			// } else

			if (parseEditorValues(value)?.length > charLimit) {
				addError({ text: `Please enter characters below ${charLimit}` });
			}

			// else if (parseEditorValues(value)?.length === 0) {
			// 	setNumberOfChar(0);
			// }
		}
	}, [value]);

	useEffect(() => {
		clearAttachments();
		setCustomVariablesMap();
		reconcileAttachments(files);
		return () => {
			clearAttachments();
		};
	}, []);

	const getCRMCustomVariablesMap = fieldMap => {
		const crmCustomVarsMap = {};

		if (showCRMCustomVars && IS_CUSTOM_VARS_AVAILABLE.includes(user?.integration_type)) {
			const account_map =
				fieldMap?.[INTEGRATION_MAP_KEYS[user.integration_type].account_map] ?? {};
			const lead_map =
				fieldMap?.[INTEGRATION_MAP_KEYS[user.integration_type].lead_map] ?? {};

			switch (user?.integration_type) {
				case INTEGRATION_TYPE.SALESFORCE:
				case INTEGRATION_TYPE.ZOHO: {
					const contact_map = fieldMap?.contact_map ?? {};

					switch (lead?.integration_type) {
						case LEAD_INTEGRATION_TYPES.SALESFORCE_LEAD:
						case LEAD_INTEGRATION_TYPES.ZOHO_LEAD: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.LEAD] =
								lead_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "lead")
								) ?? [];
							break;
						}
						case LEAD_INTEGRATION_TYPES.SALESFORCE_CONTACT:
						case LEAD_INTEGRATION_TYPES.ZOHO_CONTACT: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.CONTACT] =
								contact_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "contact")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
								account_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "account")
								) ?? [];
							break;
						}
						default: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.LEAD] =
								lead_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "lead")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.CONTACT] =
								contact_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "contact")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
								account_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "account")
								) ?? [];
						}
					}
					break;
				}
				case INTEGRATION_TYPE.HUBSPOT:
				case INTEGRATION_TYPE.SELLSY: {
					crmCustomVarsMap[CRM_CUSTOM_VARIABLES.LEAD] =
						lead_map?.variables?.map(variable =>
							formatter(variable?.target_value?.label, "contact")
						) ?? [];
					crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
						account_map?.variables?.map(variable =>
							formatter(variable?.target_value?.label, "company")
						) ?? [];
					break;
				}
				case INTEGRATION_TYPE.PIPEDRIVE: {
					crmCustomVarsMap[CRM_CUSTOM_VARIABLES.LEAD] =
						lead_map?.variables?.map(variable =>
							formatter(variable?.target_value?.label, "person")
						) ?? [];
					crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
						account_map?.variables?.map(variable =>
							formatter(variable?.target_value?.label, "organization")
						) ?? [];
					break;
				}
				case INTEGRATION_TYPE.BULLHORN: {
					const contact_map = fieldMap?.contact_map ?? {};
					const candidate_map = fieldMap?.candidate_map ?? {};

					switch (lead?.integration_type) {
						case LEAD_INTEGRATION_TYPES.BULLHORN_LEAD: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.LEAD] =
								lead_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "lead")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
								account_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "account")
								) ?? [];
							break;
						}
						case LEAD_INTEGRATION_TYPES.BULLHORN_CONTACT: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.CONTACT] =
								contact_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "contact")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
								account_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "account")
								) ?? [];
							break;
						}
						case LEAD_INTEGRATION_TYPES.BULLHORN_CANDIDATE: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.CANDIDATE] =
								candidate_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "candidate")
								) ?? [];
							break;
						}
						default: {
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.LEAD] =
								lead_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "lead")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.CONTACT] =
								contact_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "contact")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.CANDIDATE] =
								candidate_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "candidate")
								) ?? [];
							crmCustomVarsMap[CRM_CUSTOM_VARIABLES.ACCOUNT] =
								account_map?.variables?.map(variable =>
									formatter(variable?.target_value?.label, "account")
								) ?? [];
						}
					}
					break;
				}
			}
		}

		return crmCustomVarsMap;
	};

	const setCustomVariablesMap = () => {
		if (lead) {
			const crmCustomVarsMap = getCRMCustomVariablesMap(
				fieldMap?.Company_Setting?.Integration_Field_Map
			);
			setCustomVariables(prev => ({
				...prev,
				account_map: lead?.Account,
				lead_map: lead,
				...crmCustomVarsMap,
				loading: false,
			}));
		} else {
			fetchSfMap(null, {
				onSuccess: res => {
					const map = {
						account_map: res[INTEGRATION_MAP_KEYS[user.integration_type].account_map],
						lead_map: res[INTEGRATION_MAP_KEYS[user.integration_type].lead_map],
					};
					const crmCustomVarsMap = getCRMCustomVariablesMap(res);
					setCustomVariables(prev => ({
						...prev,
						...map,
						...crmCustomVarsMap,
						loading: false,
					}));
				},
			});
		}
	};

	const handleRemoveFile = file => {
		if (typeof setFiles !== "function") return;
		setFiles(prev =>
			prev.filter(f => f?.original_name !== file?.original_name || f?.name !== file?.name)
		);
		window.sessionStorage.removeItem(`${file.original_name}-attachment`);
		if (file.deletable) {
			deleteAttachment(file.attachment_id);
		}
	};

	const addAttachment = e => onUploadAttachments(e);
	const updateAttachmentInList = useCallback(
		e => {
			if (typeof setFiles !== "function") return;
			let ind = files?.findIndex(f => f?.original_name === e?.detail.original_name);
			let fileUpload = JSON.parse(
				window.sessionStorage.getItem(`${e.detail.original_name}-attachment`)
			);
			if (e.detail) fileUpload = e.detail;

			setFiles(prev =>
				prev?.map((file, index) =>
					index === ind
						? { ...file, ...fileUpload, loading: false, deletable: true }
						: file
				)
			);
		},
		[files]
	);

	let toolbarId = `toolbar-${Math.floor(Math.random() * 100 + 1)}`;
	const onUploadAttachments = fileUploadEvent => {
		if (fileUploadEvent) {
			const file_object = {
				original_name: fileUploadEvent?.detail?.name,
				loading: true,
				id: null,
				file: fileUploadEvent.detail,
			};
			let ind = files?.findIndex(
				f =>
					f?.original_name === fileUploadEvent?.detail.name ||
					f?.name === fileUploadEvent?.detail.name
			);

			if (ind !== -1) return;
			setFiles(prev => [...prev, file_object]);
		}
	};

	// listen to events to add attachments on window
	useEffect(() => {
		window.addEventListener(
			EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_BEGIN,
			addAttachment
		);
		window.addEventListener(
			EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_SUCCESS,
			updateAttachmentInList
		);
		window.addEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.ATTACHMENT_LIMIT, () => {
			addError({ text: "You can't upload more than 2 files" });
		});
		window.addEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_SIZE_LIMIT, () => {
			addError({ text: "File size limit exceeded (5MB)" });
		});

		return () => {
			window.removeEventListener(
				EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_BEGIN,
				addAttachment
			);
			window.removeEventListener(
				EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_UPLOAD_SUCCESS,
				updateAttachmentInList
			);
			window.removeEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.ATTACHMENT_LIMIT, () => {
				addError({ text: "You can't upload more than 2 files" });
			});
			window.removeEventListener(EDITOR_ATTACHMENT_EVENTS_ENUM.FILE_SIZE_LIMIT, () => {
				addError({ text: "File size limit exceeded (5MB)" });
			});
		};
	}, [files]);

	useDidMountEffect(() => {
		setEditorReady(false);
		setTimeout(() => setEditorReady(true), 1000);
	}, [theme]);

	const toolbarRef = useRef(null);

	return (
		<ErrorBoundary>
			{editorReady ? (
				<Div
					dataTestId="TextEditorTest"
					className={`editor ${theme === "message" ? "message" : ""} ${className ?? ""}`}
					loading={loading}
					style={{ height, width, ...style }}
				>
					{theme === "message" || rest.type === "sms" || rest.type === "linkedin" ? (
						<textarea
							disabled={disabled}
							ref={textareaRef}
							value={value}
							onChange={e => {
								setValue(e.target.value);
							}}
							placeholder={placeholder}
						/>
					) : (
						<CKEditor
							editor={TextEditor}
							config={{
								...EDITOR_CONFIG[theme],
								link: {
									defaultProtocol: "https://",
								},
								authorization_token: user?.ringover_tokens?.id_token,
								backend: ENV.BACKEND,
								htmlSupport: {
									allow: [
										{
											name: /^(div|span|p|img|a|table|tr|th|td)$/,
											classes: true,
											styles: true,
										},
									],
								},
							}}
							data={stripTrackingImage(value) ?? ""}
							onReady={editor => {
								//add toolbar
								window.editor = editor;
								if (disabled) {
									editor.enableReadOnlyMode("ck-editor-lock");
								} else {
									editorRef.current = editor;
									// document.querySelector(`#${toolbarId}`);

									// editor.on("handle_attachment_click", addAttachment);
									//adjust tooltip position

									toolbarRef.current.appendChild(editor.ui.view.toolbar.element);

									while (toolbarRef.current.childNodes.length > 1) {
										toolbarRef.current.removeChild(toolbarRef.current.firstChild);
									}

									editor?.ui.view.toolbar.items.map(item => {
										//button positionging( without dropdowns)
										item.tooltipPosition = "se";
										//for dropdowns
										if (item.buttonView) {
											item.buttonView.tooltipPosition = "se";
										}
										return item;
									});
								}
							}}
							onChange={(event, editor) => {
								setValue(editor.getData());
							}}
							isReadOnly={disabled}
							placeholder={placeholder}
						/>
					)}
					{files?.length > 0 && (
						<div className={styles.filesSelected}>
							{files?.map(file => (
								<div>
									<span key={file?.original_name}>
										{file?.loading && <Spinner size="18px" color={Colors.mainPurple} />}
										<span className={styles.fileName}>
											{file?.original_name || file?.name}
										</span>
										<button
											className={styles.removeFile}
											onClick={() => handleRemoveFile(file)}
										>
											<Close />
										</button>
									</span>
								</div>
							))}
						</div>
					)}
					{theme === "message" ? (
						!disabled && (
							<div className="toolbar">
								<CustomVariablesDropdown
									textareaRef={textareaRef}
									value={value}
									setValue={setValue}
									customVariables={customVariables}
									template={lead ? false : true}
									loading={fetchSfMapLoading}
									showAllMiscVars={showAllMiscVars}
									theme={theme}
									user={user}
									lead={lead}
									charLimit={charLimit}
								/>
							</div>
						)
					) : (
						<>
							{!disabled && (
								<div id={toolbarId} className="toolbar" ref={toolbarRef}></div>
							)}

							{!disabled && (
								<CustomVariablesDropdown
									editorRef={editorRef}
									value={value}
									setValue={setValue}
									customVariables={customVariables}
									template={lead ? false : true}
									loading={fetchSfMapLoading}
									showAllMiscVars={showAllMiscVars}
									theme={theme}
									user={user}
									lead={lead}
									charLimit={charLimit}
								/>
							)}
						</>
					)}
				</Div>
			) : (
				<div className={styles.loaderWrapper}>
					<Spinner color={Colors.lightBlue} size="2rem" />{" "}
				</div>
			)}
		</ErrorBoundary>
	);
};

export default Editor;

const CustomVariablesDropdown = ({
	textareaRef,
	value,
	setValue,
	customVariables,
	editorRef,
	template,
	loading,
	showAllMiscVars,
	theme,
	user,
	lead,
	charLimit,
}) => {
	const userDataAccess = useUser({ user: true });
	const [dropdown, setDropdown] = useState(false);
	const [customVariableOptions, setCustomVariablesOptions] = useState(
		CUSTOM_VARIABLES_OPTIONS
	);
	const [showModal, setShowModal] = useState(false);
	const [modalMessage, setModalMessage] = useState({ top: "", bottom: "", button: "" });
	const [search, setSearch] = useState("");

	const dropDownRef = useRef();

	const { signatures, signatureLoading } = useEmailSignature();

	const onClose = () => {
		setDropdown(false);
	};
	useOutsideClickHandler(dropDownRef, onClose, false);

	const handleOptionClick = option => {
		if (checkCalendlyLinkExists(option)) return;
		if (textareaRef?.current) {
			let selectionStart = textareaRef?.current?.selectionStart;
			let selectionEnd = textareaRef?.current?.selectionEnd;
			setValue(
				`${value?.slice(0, selectionStart)}${option}${value?.slice(selectionEnd)}`
			);
			textareaRef.current.focus();
			setDropdown(false);
		} else {
			editorRef.current.model.change(writer => {
				const range = editorRef.current.model.document.selection.getFirstRange();
				editorRef.current.model.insertContent(writer.createText(option), range);
			});
			setDropdown(false);
		}
	};

	const filterCustomVariables = () => {
		try {
			let account_variables = [];
			let lead_variables = [];
			let user_variables = [];
			let candidate_variables = [];
			let crm_custom_variables = [];

			if (lead || IS_CUSTOM_VAR_FIELD_MAP_AVAILABLE.includes(user.integration_type)) {
				// filter company custom variables
				account_variables = Object.keys(ACCOUNT_CUSTOM_VARIABLES)?.filter(cv =>
					ACCOUNT_CUSTOM_VARIABLES[cv].predicate(customVariables?.account_map)
				);
				// filter lead custom variables
				lead_variables = Object.keys(LEAD_CUSTOM_VARIABLES)?.filter(cv =>
					LEAD_CUSTOM_VARIABLES[cv].predicate(customVariables?.lead_map)
				);

				//for bullhorn only
				if (user.integration_type === INTEGRATION_TYPE.BULLHORN) {
					candidate_variables = Object.keys(LEAD_CUSTOM_VARIABLES)?.filter(cv =>
						LEAD_CUSTOM_VARIABLES[cv].predicate(customVariables?.candidate_map)
					);
				}

				if (lead_variables.length > 0) lead_variables.unshift("Person");
				if (account_variables.length > 0) account_variables.unshift("Company");
				if (candidate_variables.length > 0) candidate_variables.unshift("Candidate");
			}

			// CRM custom Variables
			if (customVariables[CRM_CUSTOM_VARIABLES.LEAD]?.length)
				crm_custom_variables = [
					...crm_custom_variables,
					`Custom variables ${
						CUSTOM_VARS_NAMES_BY_INTEGRATION[user?.integration_type].lead
					}`,
					...customVariables[CRM_CUSTOM_VARIABLES.LEAD],
				];
			if (customVariables[CRM_CUSTOM_VARIABLES.CONTACT]?.length)
				crm_custom_variables = [
					...crm_custom_variables,
					"Custom variables Contact",
					...customVariables[CRM_CUSTOM_VARIABLES.CONTACT],
				];
			if (customVariables[CRM_CUSTOM_VARIABLES.CANDIDATE]?.length)
				crm_custom_variables = [
					...crm_custom_variables,
					"Custom variables Candidate",
					...customVariables[CRM_CUSTOM_VARIABLES.CANDIDATE],
				];
			if (customVariables[CRM_CUSTOM_VARIABLES.ACCOUNT]?.length)
				crm_custom_variables = [
					...crm_custom_variables,
					`Custom variables ${
						CUSTOM_VARS_NAMES_BY_INTEGRATION[user?.integration_type].account
					}`,
					...customVariables[CRM_CUSTOM_VARIABLES.ACCOUNT],
				];

			// filter user custom variables
			user_variables = Object.keys(USER_CUSTOM_VARIABLES)?.filter(cv =>
				USER_CUSTOM_VARIABLES[cv].predicate(customVariables?.user_map)
			);

			// remove unsubscribe link & user signature from MISC_CUSTOM_VARIABLES if theme === 'message'
			let misc_variables =
				theme === "message"
					? MISC_CUSTOM_VARIABLES.filter(
							cv => cv !== "{{unsubscribe(Unsubscribe)}}" && cv !== "{{user_signature}}"
					  )
					: MISC_CUSTOM_VARIABLES;

			// Some Misc variables are removed if showAllMiscVars is false
			if (!showAllMiscVars)
				misc_variables = misc_variables.filter(
					cv =>
						cv !== "{{ringover_meet}}" &&
						cv !== "{{user_signature}}" &&
						cv !== "{{custom_link()}}" &&
						cv !== "{{unsubscribe(Unsubscribe)}}"
				);

			if (user_variables.length > 0) user_variables.unshift("Sender");

			let AVAILABLE_CUSTOM_VARIABLES = [];
			// Available LIST
			if (lead || IS_CUSTOM_VAR_FIELD_MAP_AVAILABLE.includes(user.integration_type)) {
				AVAILABLE_CUSTOM_VARIABLES = [
					...lead_variables,
					...account_variables,
					...candidate_variables,
				];
			} else {
				AVAILABLE_CUSTOM_VARIABLES = [
					...getLeadAccountVariablesByIntegration(user.integration_type),
				];
			}

			if (user.language === "english") {
				misc_variables = misc_variables.filter(
					cv =>
						cv !== "{{today_day(fr)}}" &&
						cv !== "{{today_day(es)}}" &&
						cv !== "{{tomorrow_day(fr)}}" &&
						cv !== "{{tomorrow_day(es)}}" &&
						cv !== "{{N_days_day(fr)}}" &&
						cv !== "{{N_days_day(es)}}" &&
						cv !== "{{N_days_ago_day(fr)}}" &&
						cv !== "{{N_days_ago_day(es)}}" &&
						cv !== "{{N_week_days_from_now_day(fr)}}" &&
						cv !== "{{N_week_days_from_now_day(es)}}" &&
						cv !== "{{N_week_days_ago_day(fr)}}" &&
						cv !== "{{N_week_days_ago_day(es)}}"
				);
			}

			if (user.language === "french") {
				misc_variables = misc_variables.filter(
					cv =>
						cv !== "{{today_day(en)}}" &&
						cv !== "{{today_day(es)}}" &&
						cv !== "{{tomorrow_day(en)}}" &&
						cv !== "{{tomorrow_day(es)}}" &&
						cv !== "{{N_days_day(en)}}" &&
						cv !== "{{N_days_day(es)}}" &&
						cv !== "{{N_days_ago_day(en)}}" &&
						cv !== "{{N_days_ago_day(es)}}" &&
						cv !== "{{N_week_days_from_now_day(en)}}" &&
						cv !== "{{N_week_days_from_now_day(es)}}" &&
						cv !== "{{N_week_days_ago_day(en)}}" &&
						cv !== "{{N_week_days_ago_day(es)}}"
				);
			}

			if (user.language === "spanish") {
				misc_variables = misc_variables.filter(
					cv =>
						cv !== "{{today_day(en)}}" &&
						cv !== "{{today_day(fr)}}" &&
						cv !== "{{tomorrow_day(en)}}" &&
						cv !== "{{tomorrow_day(fr)}}" &&
						cv !== "{{N_days_day(en)}}" &&
						cv !== "{{N_days_day(fr)}}" &&
						cv !== "{{N_days_ago_day(en)}}" &&
						cv !== "{{N_days_ago_day(fr)}}" &&
						cv !== "{{N_week_days_from_now_day(en)}}" &&
						cv !== "{{N_week_days_from_now_day(fr)}}" &&
						cv !== "{{N_week_days_ago_day(en)}}" &&
						cv !== "{{N_week_days_ago_day(fr)}}"
				);
			}

			//Add user all signature variables
			// if (signatures.length > 0 && showAllMiscVars) {
			// 	let deleteUserSignature = false;
			// 	let elementsToInsertPrimary = [];
			// 	let elementsToInsert = [];
			// 	signatures.map(item => {
			// 		if (item.is_primary) {
			// 			deleteUserSignature = true;
			// 			elementsToInsertPrimary.push(`{{user_signature_primary}} (${item.name})`);
			// 		} else {
			// 			elementsToInsert.push(`{{user_signature}} (${item.name})`);
			// 		}
			// 	});
			// 	const indexOfUserSignature = misc_variables.indexOf("{{user_signature}}");
			// 	misc_variables.splice(
			// 		indexOfUserSignature + 1,
			// 		0,
			// 		...elementsToInsertPrimary,
			// 		...elementsToInsert
			// 	);
			// 	if (deleteUserSignature) misc_variables.splice(indexOfUserSignature, 1);
			// }

			AVAILABLE_CUSTOM_VARIABLES.push(
				...user_variables,
				...crm_custom_variables,
				...misc_variables
			);

			setCustomVariablesOptions(AVAILABLE_CUSTOM_VARIABLES);
		} catch (err) {
			// do nothing
		}
	};

	const searchCustomVariables = customVariableOptions => {
		const filteredArray = customVariableOptions.filter(item => {
			if (!item.includes("{{")) return true;
			return item?.toLowerCase().includes(search.toLowerCase());
		});

		let indexesToDelete = [];

		//Remove label if there are no custom variables after the label after filtering
		filteredArray.forEach((item, index) => {
			if (!item?.includes("{{")) {
				if (!filteredArray[index + 1]?.includes("{{")) indexesToDelete.push(index);
			}
		});
		indexesToDelete.reverse().forEach(index => {
			filteredArray.splice(index, 1);
		});
		if (filteredArray.length === 0) filteredArray.push("No variables found");
		return filteredArray;
	};

	useEffect(() => {
		filterCustomVariables();
	}, [customVariables, signatures]);

	const getClassName = () => {
		if (theme === "email") return "customVariablesEditorSend";
		else if (theme === "message") return "customVariables";
		else if (template && theme !== "no_attachments") return "customVariablesEditorSend";
		else return "customVariablesEditorTemplate";
	};

	const checkCalendlyLinkExists = option => {
		if (option !== "{{calendly_link}}") return;

		if (
			userDataAccess?.user?.calendly_access_token &&
			(userDataAccess?.user?.calendly_url === "" ||
				userDataAccess?.user?.calendly_url === null)
		) {
			setModalMessage({
				top: "Event name not selected",
				bottom:
					"To use your calendy custom variable for booking demos please select the event name.",
				button: "Select event name",
			});
			setShowModal(prev => !prev);
			return true;
		} else if (
			userDataAccess?.user?.calendly_url === "" ||
			userDataAccess?.user?.calendly_url === null
		) {
			setModalMessage({
				top: "Calendly url not found",
				bottom:
					"To use your calendy custom variable for booking demos please connect with calendly if you have a premium account or for free users enter your calendly event link ",
				button: "Set calendly url",
			});
			setShowModal(prev => !prev);
			return true;
		} else {
			return false;
		}

		// if (
		// 	userDataAccess?.user?.calendly_url === "" ||
		// 	userDataAccess?.user?.calendly_url === null
		// ) {
		// 	setModalMessage({
		// 		top: "Event name not selected",
		// 		bottom:
		// 			"To use your calendy custom variable for booking demos please select the event name.",
		// 		button: "Select event name",
		// 	});
		// 	setShowModal(prev => !prev);
		// 	return true;
		// } else if (
		// 	userDataAccess?.user?.calendly_access_token === "" ||
		// 	userDataAccess?.user?.calendly_access_token === null
		// ) {
		// 	setModalMessage({
		// 		top: "Connect with calendly",
		// 		bottom:
		// 			"To use your calendy custom variable for booking demos please connect with calendly.",
		// 		button: "Connect with calendly",
		// 	});
		// 	setShowModal(prev => !prev);
		// 	return true;
		// } else {
		// 	return false;
		// }
	};

	return (
		<div
			ref={dropDownRef}
			className={`${getClassName()} ${charLimit ? "countActive" : ""}`}
		>
			<button
				onClick={() => {
					if (textareaRef?.current) textareaRef.current.focus();
					setDropdown(curr => !curr);
				}}
			>
				{"{{A}}"}
			</button>

			{charLimit && (
				<div className="charCountWrapper">
					<p>
						<span
							style={
								value && parseEditorValues(value)?.length > charLimit
									? { color: "#f77272" }
									: {}
							}
						>
							{parseEditorValues(value)?.length}
						</span>{" "}
						/ <span>{charLimit}</span>
					</p>{" "}
					<Tooltip
						text={"Character count includes html"}
						className={"charCountText"}
						theme="LEFT"
					>
						<Info size={"15px"} />
					</Tooltip>
				</div>
			)}

			{dropdown && (
				<div className="options">
					<div className="searchBox">
						<SearchBar
							height="34px"
							width="215px"
							value={search}
							setValue={setSearch}
							// onSearch={handleSearch}
						/>
					</div>

					{loading || userDataAccess.userLoading
						? new Array(15).fill(0).map(() => (
								<Div
									loading={true}
									span={true}
									style={{
										width: "93%",
										margin: "0.3em 0.5em",
									}}
								></Div>
						  ))
						: searchCustomVariables(customVariableOptions)?.map(option =>
								option.includes("{{") ? (
									<button onClick={() => handleOptionClick(option)}>{option}</button>
								) : (
									<span>{option}</span>
								)
						  )}
				</div>
			)}
			<CalendlyErrorModal
				showModal={showModal}
				setShowModal={setShowModal}
				modalMessage={modalMessage}
			/>
		</div>
	);
};
