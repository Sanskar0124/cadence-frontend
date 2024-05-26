import { Leads, NoLeads } from "@cadence-frontend/icons";
import styles from "./ImportLeadsForTour.module.scss";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useEffect, useState } from "react";
import ImportModal from "./ImportModal/ImportModal";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@cadence-frontend/utils";

const ImportLeadsForTour = ({ refetchLeads }) => {
	const navigate = useNavigate();
	const query = useQuery();
	const import_leads = query.get("import_leads");
	const user = useRecoilValue(userInfo);
	const [modal, setModal] = useState(false);

	const onImport = () => {
		navigate("?view=list&import_leads=true");
		setModal(true);
	};

	useEffect(() => {
		if (import_leads) setModal(true);
	}, []);

	return (
		<div className={styles.importLeads}>
			<div>
				<NoLeads />
				<span>
					{CADENCE_TRANSLATION?.CURRENTLY_NO_LEADS_PRESENT[user?.language?.toUpperCase()]}
				</span>
				<p>{CADENCE_TRANSLATION.LEADS_NEEDED_TO_LAUNCH[user?.language?.toUpperCase()]}</p>
			</div>
			<ThemedButton
				theme={ThemedButtonThemes.PRIMARY}
				width="fit-content"
				id="tour-import-leads-modal-btn"
				onClick={onImport}
			>
				<Leads />{" "}
				<div>{CADENCE_TRANSLATION?.IMPORT_LEADS[user?.language?.toUpperCase()]}</div>
			</ThemedButton>
			{modal && (
				<ImportModal modal={modal} setModal={setModal} refetchLeads={refetchLeads} />
			)}
		</div>
	);
};
export default ImportLeadsForTour;
