import { userInfo } from "@cadence-frontend/atoms";
import { useSettings } from "@cadence-frontend/data-access";
import { Edit } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { capitalize, useQuery } from "@cadence-frontend/utils";
import { BackButton, ThemedButton } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
	FIELD_MAPPING_AVAILABLE,
	ParseRingoverFieldsAll,
	getQualificationButtonText,
} from "./constants";
import styles from "./FieldMapping.module.scss";
import LeaveWarningModal from "./LeaveWarningModal/LeaveWarningModal";
import MatchFields from "./MatchFields/MatchFields";
import QuickView from "./QuickView/QuickView";
import {
	Settings as SETTINGS_TRANSLATION,
	Common as COMMON_TRANSLATIONS,
	useIntegrationTranslations,
} from "@cadence-frontend/languages";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const FieldMapping = ({
	postDataRef,
	ifUnsavedChanges,
	setIfUnsavedChanges,
	setSaveBtnLoading,
	customvariables,
	setCustomVariables,
}) => {
	const navigate = useNavigate();
	const user = useRecoilValue(userInfo);
	const query = useQuery();
	const edit_map = query.get("edit_map");
	const alternateOnClickFunction = useRef(() => null);
	const [ringoverFields, setRingoverFields] = useState({});

	const [isEdit, setIsEdit] = useState(false);
	const [leaveWarningModal, setLeaveWarningModal] = useState(false);

	const { fetchRingoverFieldsMutate } = useSettings({ enabled: false });

	const INTEGRATION_TRANSLATIONS = useIntegrationTranslations(user?.integration_type);

	const onEdit = field => {
		setIsEdit(true);
		navigate(`?view=crm_and_mf&edit_map=true&current_view=${field}`);
	};

	const onBackToSettings = () => {
		setIsEdit(false);
		setIfUnsavedChanges(() => false);
		navigate("?view=crm_and_mf");
	};

	useEffect(() => {
		if (edit_map) setIsEdit(true);
	}, []);

	useEffect(() => {
		if (!isEdit) fetchRingoverFields();
	}, [isEdit]);

	useEffect(() => {
		alternateOnClickFunction.current = ({ cb }) => {
			if (typeof ifUnsavedChanges === "function" && ifUnsavedChanges())
				setLeaveWarningModal({ cb });
			else cb();
		};
	}, [ifUnsavedChanges]);

	const fetchRingoverFields = () => {
		fetchRingoverFieldsMutate(null, {
			onSuccess: ringoverFieldsFromServer => {
				setRingoverFields(ringoverFieldsFromServer);
			},
		});
	};

	return (
		<div id={SEARCH_OPTIONS.FIELD_MAPPING}>
			{Object.keys(FIELD_MAPPING_AVAILABLE[user.integration_type]).map(field => (
				<div className={styles.container}>
					<div className={styles.title}>
						<h2>
							{SETTINGS_TRANSLATION.FIELDS_FOR[user?.language?.toUpperCase()]}{" "}
							{FIELD_MAPPING_AVAILABLE[user.integration_type][field]}
						</h2>
						<p>{INTEGRATION_TRANSLATIONS.MATCH_FIELDS[user?.language?.toUpperCase()]}</p>
						<ThemedButton
							width="fit-content"
							theme={ThemedButtonThemes.GREY}
							onClick={() => onEdit(field)}
							height="40px"
						>
							<Edit />{" "}
							<div>{COMMON_TRANSLATIONS.EDIT[user?.language?.toUpperCase()]}</div>
						</ThemedButton>
					</div>
					<div className={styles.settings}>
						<QuickView
							ringoverFields={ringoverFields}
							fieldType={field}
							qualText={getQualificationButtonText(
								field,
								ringoverFields,
								user.integration_type
							)}
						/>
					</div>
				</div>
			))}
			{isEdit && (
				<div className={styles.fieldMapping}>
					<BackButton
						onClick={() => alternateOnClickFunction.current({ cb: onBackToSettings })}
						text="Settings"
					/>
					<MatchFields
						setDisableNext={() => null}
						setIfUnsavedChanges={setIfUnsavedChanges}
						postDataRef={postDataRef}
						setSaveBtnLoading={setSaveBtnLoading}
						customvariables={customvariables}
						setCustomVariables={setCustomVariables}
					/>
				</div>
			)}
			<LeaveWarningModal modal={leaveWarningModal} setModal={setLeaveWarningModal} />
		</div>
	);
};
export default FieldMapping;
