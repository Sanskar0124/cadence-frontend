import { NoTemplates, PlusOutline } from "@cadence-frontend/icons";
import { TableThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { Skeleton } from "@cadence-frontend/components";
import { THEMES } from "@cadence-frontend/widgets";
import { isActionPermitted } from "../../utils";
import styles from "./Placeholder.module.scss";
import { Templates as TEMPLATES_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const AddTemplateButton = ({ setAddEditModal }) => {
	const user = useRecoilValue(userInfo);
	return (
		<div
			className={styles.Container_content_button}
			onClick={() => {
				setAddEditModal({ isAdd: true });
			}}
		>
			<PlusOutline color={`${Colors.lightBlue}`} />{" "}
			{TEMPLATES_TRANSLATION.ADD_TEMPLATE[user?.language?.toUpperCase()]}
		</div>
	);
};

const Placeholder = ({ setAddEditModal, addNewDisabled, width = "100%", user }) => {
	return (
		<div className={`${styles.Container}`} style={{ width: width }}>
			<div className={styles.Container_content}>
				<div className={styles.Container_content_image}>
					<NoTemplates />
				</div>
				<div className={styles.Container_content_text}>
					{TEMPLATES_TRANSLATION.NO_TEMPLATE_FOUND[user?.language?.toUpperCase()]}
				</div>
				{!addNewDisabled && <AddTemplateButton setAddEditModal={setAddEditModal} />}
			</div>
		</div>
	);
};

Placeholder.propTypes = {};

export default Placeholder;
