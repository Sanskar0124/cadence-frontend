import { Download, NoLeads } from "@cadence-frontend/icons";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { useContext, useState } from "react";
import styles from "./ImportGSLeads.module.scss";
import { useNavigate } from "react-router-dom";
import {
	Common as COMMON_TRANSLATION,
	Cadence as CADENCE_TRANSLATION,
} from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const ImportGSLeads = ({ cadence }) => {
	const navigate = useNavigate();
	const { addError } = useContext(MessageContext);
	const [sheetUrl, setSheetUrl] = useState("");
	const user = useRecoilValue(userInfo);

	const importLeads = () => {
		if (sheetUrl.split("/").length !== 7) return addError({ text: "Invalid Sheet Url" });
		sessionStorage.removeItem(`csv_field_map`);
		sessionStorage.setItem("sheet_url", sheetUrl);
		let importUrl = `/import-csv?cadence_id=${cadence?.cadence_id}&cadence_name=${cadence?.name}`;
		navigate(importUrl);
	};

	return (
		<div className={styles.importLeads}>
			<div className={styles.noLeads}>
				<NoLeads />
				<span>
					{CADENCE_TRANSLATION?.CURRENTLY_NO_LEADS_PRESENT[user?.language?.toUpperCase()]}
				</span>
				<p>
					{COMMON_TRANSLATION?.ADD_A[user?.language?.toUpperCase()]}{" "}
					<a
						href="https://docs.google.com/spreadsheets/d/1YaTlcjUWbIMz0uTN0yKffDpV9P25uf2BlknSStG9BFo/edit#gid=0"
						target="_blank"
						rel="noreferrer"
					>
						{COMMON_TRANSLATION?.GOOGLE_SHEETS[user?.language?.toUpperCase()]}
					</a>{" "}
					{CADENCE_TRANSLATION?.LINK_TO_IMPORT_LEADS[user?.language?.toUpperCase()]}
				</p>
			</div>
			<div className={styles.import}>
				<Input
					placeholder={CADENCE_TRANSLATION?.ENTER_LINK[user?.language?.toUpperCase()]}
					value={sheetUrl}
					setValue={setSheetUrl}
				/>
				<ThemedButton
					theme={ThemedButtonThemes.GREY}
					width="fit-content"
					height="40px"
					onClick={importLeads}
					disabled={!sheetUrl.length}
				>
					<Download /> {CADENCE_TRANSLATION?.IMPORT_LEADS[user?.language?.toUpperCase()]}
				</ThemedButton>
			</div>
		</div>
	);
};

export default ImportGSLeads;
