import { useContext } from "react";
import { QueryClient } from "react-query";
import { MessageContext } from "@cadence-frontend/contexts";
import { useUser } from "@cadence-frontend/data-access";
import TimezoneSelect from "react-timezone-select";
import styles from "./Timezone.module.scss";
import { themeStyles } from "@cadence-frontend/widgets";

const Timezone = () => {
	const { whiteStyles } = themeStyles("578px", "44px", false, "15px");
	const { addError } = useContext(MessageContext);
	const { user, updateUser } = useUser(false);

	const onUpdate = timezone => {
		updateUser(
			{ timezone: timezone.value },
			{
				onError: (err, _, context) => {
					addError({
						text: "Error updating timezone",
						desc: err?.response?.data?.error ?? "Please contact support",
						cId: err?.response?.data?.correlationId,
					});
					QueryClient.setQueryData("user", context.previousUser);
				},
			}
		);
	};

	return (
		<div className={styles.timezone}>
			<TimezoneSelect
				value={user?.timezone || ""}
				onChange={onUpdate}
				styles={whiteStyles}
			/>
		</div>
	);
};

export default Timezone;
