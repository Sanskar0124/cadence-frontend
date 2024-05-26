import { useUser } from "@cadence-frontend/data-access";
import { TriangleDown, Wrench } from "@cadence-frontend/icons";
import { InputThemes } from "@cadence-frontend/themes";
import { Colors } from "@cadence-frontend/utils";
import { Title } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { Input, Label } from "@cadence-frontend/widgets";
import { themeStyles } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import { QueryClient } from "react-query";
import { components } from "react-select";
import TimezoneSelect from "react-timezone-select";
import Language from "./components/Language/Language";
import ProfilePhoto from "./components/ProfilePhoto/ProfilePhoto";
import SuccessModal from "./components/SuccessModal/SuccessModal";
import Toggle from "./components/Toggle/Toggle";
import styles from "./General.module.scss";
import {
	Profile as PROFILE_TRANSLATION,
	Common as COMMON_TRANSLATION,
	Errors as ERROR_TRANSLATION,
} from "@cadence-frontend/languages";
import {
	PHONE_INTEGRATIONS,
	ROLES,
	SESSION_STORAGE_KEYS,
} from "@cadence-frontend/constants";

import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import CalendlyAuth from "./components/CalendlyAuth/CalendlyAuth";

const General = ({ postDataRef, setDisableNext }) => {
	const {
		user,
		updateUser,
		updateLoading,
		updateProfileImage,
		updateProfileImageLoading,
	} = useUser({ user: true });
	const { addError } = useContext(MessageContext);
	const { roundedStyles } = themeStyles({ numberOfOptionsVisible: 5, width: "578px" });
	const currentUser = useRecoilValue(userInfo);

	const [image, setImage] = useState(null);
	const [timezone, setTimezone] = useState("");
	const [calendlyUrl, setCalendlyUrl] = useState("");
	const [createCustomTask, setCreateCustomTask] = useState(false);
	const [saveDetailsSuccess, setSaveDetailsSuccess] = useState(false);
	const [imageUploadSuccess, setImageUploadSucess] = useState(false);
	const [successModal, setSuccessModal] = useState(false);

	useEffect(() => {
		if (!user?.create_agendas_from_custom_task) setCreateCustomTask(true);
	}, []);

	useEffect(() => {
		setDisableNext(updateLoading || updateProfileImageLoading);
	}, [updateLoading, updateProfileImageLoading]);

	const save = () => {
		if (image) {
			const formData = new FormData();
			formData.append("image", image);
			updateProfileImage(formData, {
				onError: err =>
					addError({
						text: err.response?.data?.msg,
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					}),
				onSuccess: () => setImageUploadSucess(true),
			});
		}

		if (
			calendlyUrl.length &&
			!calendlyUrl.match(
				/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
			)
		)
			return addError({
				text: ERROR_TRANSLATION.ENTER_VALID_URL[currentUser?.language?.toUpperCase()],
			});

		if (!timezone)
			return addError({
				text: ERROR_TRANSLATION.SELECT_VALID_TIMEZONE[
					currentUser?.language?.toUpperCase()
				],
			});

		updateUser(
			{
				calendly_url: calendlyUrl,
				create_agendas_from_custom_task: createCustomTask,
				timezone,
			},
			{
				onError: (err, _, context) => {
					addError({
						text: err.response?.data?.msg ?? "Error saving details",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					QueryClient.setQueryData("user", context.previousUser);
				},
				onSuccess: () => setSaveDetailsSuccess(true),
			}
		);
	};

	useEffect(() => {
		postDataRef.current = save;
		return () => (postDataRef.current = null);
	}, [image, timezone, calendlyUrl, createCustomTask, currentUser]);

	useEffect(() => {
		if (user && !sessionStorage.getItem(SESSION_STORAGE_KEYS.IS_LANGUAGE_UPDATED)) {
			setCalendlyUrl(user?.calendly_url ?? "");
			setCreateCustomTask(user?.create_agendas_from_custom_task ?? false);
			if (user?.timezone) setTimezone(user?.timezone);
		}
	}, [user]);

	useEffect(() => {
		if (saveDetailsSuccess && (image === null || imageUploadSuccess)) {
			setSuccessModal(true);
			setSaveDetailsSuccess(false);
			setImageUploadSucess(false);
		}
	}, [saveDetailsSuccess, imageUploadSuccess]);

	const DropdownIndicator = props => {
		return (
			<components.DropdownIndicator {...props}>
				<TriangleDown color={Colors.lightBlue} />
			</components.DropdownIndicator>
		);
	};

	return (
		<div className={styles.generalContainer}>
			<div className={styles.header}>
				<div className={styles.title}>
					<div className={styles.icon}>
						<Wrench size={14} />
					</div>
					<Title size="1.43rem">
						{COMMON_TRANSLATION.GENERAL[user?.language?.toUpperCase()]}
					</Title>
				</div>

				<p className={styles.subTitle}>
					{PROFILE_TRANSLATION.TO_WRAP_UP_YOUR_ONBOARDING[user?.language?.toUpperCase()]}
				</p>
			</div>
			<div className={styles.body}>
				<div className={styles.block}>
					<h5 className={styles.labels}>
						{PROFILE_TRANSLATION.PROFILE_PHOTO[user?.language?.toUpperCase()]}
					</h5>
					<ProfilePhoto image={image} setImage={setImage} />
				</div>
				<div className={styles.block}>
					{/* <h5>{PROFILE_TRANSLATION.CALENDY_LINK[user?.language?.toUpperCase()]}</h5>
					<Input
						width="578px"
						height="40px"
						value={calendlyUrl}
						setValue={setCalendlyUrl}
						theme={InputThemes.WHITE_WITH_GREY_BORDER}
						placeholder="eg : www.calendly.com/micheldupont"
					/> */}
					<CalendlyAuth />
				</div>
				<div className={styles.block}>
					<Label required className={styles.labels}>
						{PROFILE_TRANSLATION.TIMEZONE[user?.language?.toUpperCase()]}
					</Label>
					<TimezoneSelect
						value={timezone}
						onChange={timezone => setTimezone(timezone.value)}
						styles={roundedStyles}
						components={{ DropdownIndicator }}
						placeholder={COMMON_TRANSLATION.SELECT[user?.language?.toUpperCase()]}
					/>
				</div>
				<div className={styles.block}>
					<h5 className={styles.labels}>
						{PROFILE_TRANSLATION.LANGUAGE[user?.language?.toUpperCase()]}
					</h5>
					<Language />
				</div>
				<div className={styles.block}>
					<h5 className={styles.labels}>
						{COMMON_TRANSLATION.CUSTOM_TASK[user?.language?.toUpperCase()]}
					</h5>
					<div className={styles.customTask}>
						<p>
							{
								PROFILE_TRANSLATION.CALENDAR_EVENTS_FOR_CUSTOM_TASKS[
									user?.language?.toUpperCase()
								]
							}
						</p>
						<Toggle
							checked={createCustomTask}
							onChange={() => setCreateCustomTask(prev => !prev)}
							className={styles.toggle}
						/>
					</div>
				</div>
			</div>
			<SuccessModal modal={successModal} setModal={setSuccessModal} />
		</div>
	);
};

export default General;
