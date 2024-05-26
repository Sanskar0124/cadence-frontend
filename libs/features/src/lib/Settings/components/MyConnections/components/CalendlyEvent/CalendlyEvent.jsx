/* eslint-disable no-console */

import { Div } from "@cadence-frontend/components";
import { MessageContext } from "@cadence-frontend/contexts";
import { useCalendlyAuth, useUser } from "@cadence-frontend/data-access";
import {
	Profile as PROFILE_TRANSLATION,
	Settings as SETTINGS_TRANSLATION,
} from "@cadence-frontend/languages";
import { Select } from "@cadence-frontend/widgets";
import { useContext, useEffect, useState } from "react";
import styles from "./CalendlyEvent.module.scss";
import { SEARCH_OPTIONS } from "../../../Search/constants";

const CalendlyEvent = ({ onlyButton = false }) => {
	const [calendlyUrl, setCalendlyUrlState] = useState({
		calendly_url: "",
	});
	const { user } = useUser({ user: true });
	const { addError, addSuccess } = useContext(MessageContext);
	const {
		calendlyEventType: calendlyEventType,
		calendlyEventTypeLoading: calendlyEventTypeLoading,
		setCalendlyUrl: setCalendlyUrl,
		setCalendlyUrlLoading: setCalendlyUrlLoading,
	} = useCalendlyAuth(true);

	const postCalendlyUrl = e => {
		setCalendlyUrlState(prev => ({ ...prev, calendly_url: e.value }));
		const data = { calendly_url: e.value };
		console.log(data);

		setCalendlyUrl(data, {
			onError: err => {
				addError({
					text: err.response?.data?.msg,
					desc: err?.response?.data?.error || "Please contact support",
					cId: err?.response?.data?.correlationId,
				});
			},
			onSuccess: () => {
				addSuccess("Calendly Event Saved Successfully");
			},
		});
	};

	useEffect(() => {
		getCalendlyUrlValueFromUser();
	}, [user]);

	const getCalendlyUrlValueFromUser = () => {
		setCalendlyUrlState(prev => ({ ...prev, calendly_url: user?.calendly_url }));
	};
	return (
		<div className={styles.container} id={SEARCH_OPTIONS.SELECT_EVENT}>
			{!onlyButton && (
				<div className={styles.title}>
					<h2>
						{PROFILE_TRANSLATION.SELECT_CALENDLY_EVENT[user?.language?.toUpperCase()]}
					</h2>
					<p>
						{
							PROFILE_TRANSLATION.CALENDLY_EVENT_DESCRIPTION[
								user?.language?.toUpperCase()
							]
						}
					</p>
				</div>
			)}
			<div className={styles.settings}>
				<Div loading={calendlyEventTypeLoading || setCalendlyUrlLoading}>
					<Select
						placeholder={
							SETTINGS_TRANSLATION.SELECT_EVENT_NAME[user?.language.toUpperCase()]
						}
						options={calendlyEventType?.collection?.map(op => ({
							label: op.name,
							value: op.scheduling_url,
						}))}
						setValue={val =>
							setCalendlyUrlState(prev => ({ ...prev, calendly_url: val }))
						}
						value={calendlyUrl.calendly_url}
						isSearchable
						width={"400px"}
						height={"50px"}
						onChange={e => {
							postCalendlyUrl(e);
						}}
					/>
				</Div>
			</div>
		</div>
	);
};

export default CalendlyEvent;
