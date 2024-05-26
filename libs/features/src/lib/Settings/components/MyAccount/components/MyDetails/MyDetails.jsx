import { Div, ProfilePicture, Spinner } from "@cadence-frontend/components";
import { Camera } from "@cadence-frontend/icons";
import { useContext, useRef, useState } from "react";
import { ROLES_MAP } from "./constants";
import styles from "./MyDetails.module.scss";

import { MessageContext } from "@cadence-frontend/contexts";
import { Profile as PROFILE_TRANSLATION } from "@cadence-frontend/languages";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { ThemedButton } from "@cadence-frontend/widgets";
import ChangePassword from "./ChangePassword/ChangePassword";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const MyDetails = ({ userDataAccess }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const language = useRecoilValue(userInfo).language;
	const imgRef = useRef(null);
	const { user, userLoading, updateProfileImage, updateProfileImageLoading } =
		userDataAccess;

	// const [changePassword, setChangePassword] = useState(false);

	const [image, setImage] = useState(null);

	const handleImageChange = e => {
		const [file] = e.target.files;
		if (file) {
			const ext = file.type.split("/")[1];
			if (ext === "jpeg" || ext === "png") {
				// to update the image displayed in the modal
				imgRef.current.src = URL.createObjectURL(file);
				setImage(file);
			} else {
				addError({ text: "Image should be of type jpeg/jpg/png" });
			}
		}
		e.target.value = null;
	};

	const onUpdateProfileImage = () => {
		const formData = new FormData();
		formData.append("image", image);
		updateProfileImage(formData, {
			onError: err => {
				addError({
					text: err.response?.data?.msg || "Error updating profile image",
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
				setTimeout(window.location.reload(), 3000);
			},
			onSuccess: () => {
				addSuccess("Profile picture saved");
				setTimeout(window.location.reload(), 3000);
			},
		});
	};

	return (
		<div className={styles.container} id={SEARCH_OPTIONS.MY_DETAILS}>
			<div className={styles.title}>
				<h2>{PROFILE_TRANSLATION.MY_DETAILS[language?.toUpperCase()]}</h2>
				{/* {changePassword && <h2 className={styles.resetPassTitle}>Password Re-set</h2>} */}
			</div>
			<div className={styles.settings}>
				<div className={styles.details}>
					<div className={styles.image}>
						<ProfilePicture ref={imgRef} />
						<input type="file" id="profile-picture" hidden onChange={handleImageChange} />
						<label className={styles.fileLabel} htmlFor="profile-picture">
							<Camera />
						</label>
					</div>
					<div className={styles.info}>
						<Div loading={userLoading} className={styles.name}>
							{user?.first_name ?? "NA"} {user?.last_name}
						</Div>
						<Div loading={userLoading} className={styles.role}>
							{user?.role && ROLES_MAP[user?.role][language?.toUpperCase()]}
						</Div>
						<Div loading={userLoading} className={styles.email}>
							{user?.email && user?.email}
						</Div>
						{image && (
							<ThemedButton
								theme={ThemedButtonThemes.TRANSPARENT}
								onClick={onUpdateProfileImage}
								width="fit-content"
							>
								{updateProfileImageLoading ? (
									<>
										{PROFILE_TRANSLATION.SAVING_PROFILE_IMAGE[language?.toUpperCase()]}
										<Spinner className={styles.loader} />
									</>
								) : (
									"Save profile image"
								)}
							</ThemedButton>
						)}
					</div>
				</div>
				{/* {changePassword && (
					<ChangePassword
						userDataAccess={userDataAccess}
						setChangePassword={setChangePassword}
					/>
				)} */}
			</div>
		</div>
	);
};

export default MyDetails;
