import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@cadence-frontend/icons";

import styles from "./BackButton.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const BackButton = ({ link, text, onClick, className, disabled }) => {
	const navigate = useNavigate();

	const handleOnClick = () => {
		if (disabled) return;
		if (onClick && typeof onClick === "function") onClick();
		else if (link) navigate(link);
		else navigate(-1);
	};
	const user = useRecoilValue(userInfo);

	return (
		<div
			className={`${styles.backBtn} ${disabled ? styles.disabled : ""} ${
				className ?? ""
			}`}
			onClick={handleOnClick}
		>
			<span>
				<ArrowLeft />
			</span>
			<span>{text ?? COMMON_TRANSLATION.GO_BACK[user?.language?.toUpperCase()]}</span>
		</div>
	);
};

export default BackButton;
