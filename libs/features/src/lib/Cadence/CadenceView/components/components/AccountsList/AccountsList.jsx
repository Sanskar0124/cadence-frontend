import { useState } from "react";

import { ThemedButton, Table, Checkbox } from "@cadence-frontend/widgets";
import { MessageContext } from "@cadence-frontend/contexts";
import { TableThemes, ThemedButtonThemes } from "@cadence-frontend/themes";
import { useCadenceForAccounts } from "@cadence-frontend/data-access";
import { getLabelFromEnum } from "@cadence-frontend/utils";
import {
	Plus,
	Sort,
	More,
	Play,
	Pause,
	Stop,
	ArrowUp,
	Paused,
	Trash,
	Copy,
} from "@cadence-frontend/icons";

import { CADENCE_STATUS } from "../../../../constants";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";

import styles from "./AccountsList.module.scss";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ErrorBoundary } from "@cadence-frontend/components";

const AccountsList = ({ cadenceId }) => {
	const { accounts, accountsLoading } = useCadenceForAccounts({ cadenceId });

	const [checkedAccounts, setCheckedAccounts] = useState([]);
	const [isDropDownActive, setIsDropDownActive] = useState(false);
	const user = useRecoilValue(userInfo);

	const TABLE_COLUMNS = [
		<Checkbox
			className={styles.checkBox}
			checked={
				checkedAccounts.length ===
					accounts?.filter(account => account.salesforce_account_id).length &&
				accounts.length > 0
			}
			onClick={() => {
				if (accounts?.length > 0)
					checkedAccounts.length !==
					accounts?.filter(account => account.salesforce_account_id).length
						? setCheckedAccounts(
								accounts
									.filter(account => account.salesforce_account_id)
									.map(account => account?.salesforce_account_id)
						  )
						: setCheckedAccounts([]);
			}}
		/>,
		"S No.",
		"Name",
		"Phone",
		"Linkedin username",
		"Owner name",
		"Actions",
	];

	const handleCadencePause = async (e, cadence) => {
		e.stopPropagation();
		try {
			const body = { cadence_id: cadence.cadence_id };
			// await pauseCadence(body, {
			// 	onError: (err, _, context) => {
			// 		addError("Failed to pause cadence.");
			// 	},
			// });
		} catch (err) {
			console.log(err);
		}
	};

	const handleCadenceResume = async (e, cadence) => {
		e.stopPropagation();
		try {
			// await launchCadence(cadence.cadence_id, {
			// 	onError: (err, _, context) => {
			// 		addError("Failed to launch cadence.");
			// 	},
			// });
		} catch (err) {
			console.log(err.message);
		}
	};

	const handleMenuClick = (e, account) => {
		e.stopPropagation();
		if (account.account_id === isDropDownActive) setIsDropDownActive(false);
		else setIsDropDownActive(account.account_id);
	};

	return (
		<ErrorBoundary>
			<div className={styles.accountsList}>
				<Table
					loading={accountsLoading}
					columns={TABLE_COLUMNS}
					noOfRows={accounts?.length}
					className={styles.table}
					theme={TableThemes.WHITE_AND_LIGHT_PURPLE}
				>
					{accounts?.length > 0 &&
						accounts?.map((account, index) => (
							<tr
								key={account.account_id}
								// onClick={() =>
								// 	(window.location = `/cadence/${account.cadence_id}?name=${account.name}`)
								// }
							>
								<td>
									<Checkbox
										className={styles.checkBox}
										checked={
											account.salesforce_account_id &&
											checkedAccounts.includes(account.salesforce_account_id)
												? true
												: false
										}
										onClick={() => {
											checkedAccounts.includes(account.salesforce_account_id)
												? setCheckedAccounts(prevState =>
														prevState.filter(
															item => item !== account.salesforce_account_id
														)
												  )
												: setCheckedAccounts(prevState => [
														...prevState,
														account.salesforce_account_id,
												  ]);
										}}
									/>
								</td>
								<td className={styles.cadenceName}>{index + 1}</td>
								<td>{account.name}</td>
								<td>{account?.phone_number ?? "-"}</td>
								<td className="td-linkedin">{account?.linkedin_url ?? "-"}</td>
								<td className="td-linkedin">
									{(account?.User?.first_name ?? " ") + " " + account?.User?.last_name ??
										" "}
								</td>
								<td className={styles.actions}>
									<ThemedButton
										className={styles.dotsBtn}
										theme={ThemedButtonThemes.GREY}
										onClick={e => handleMenuClick(e, account)}
										width="fit-content"
									>
										<More />
									</ThemedButton>
									<div
										className={`${styles.dropDownMenu} ${
											account?.account_id === isDropDownActive ? styles.isActive : ""
										}`}
									>
										<button
											className={styles.menuOptionBtn}
											// onClick={e => handleDuplicateClick(e, cadence)}
										>
											<Copy />
											{COMMON_TRANSLATION.DUPLICATE[user?.language?.toUpperCase()]}
										</button>
										<button
											className={styles.menuOptionBtn}
											// onClick={e => handleDeleteClick(e, cadence)}
										>
											<Trash />
											{COMMON_TRANSLATION.DELETE[user?.language?.toUpperCase()]}
										</button>
										<button
											className={styles.menuOptionBtn}
											// onClick={e => handleSetTimerClick(e, cadence)}
										>
											<Paused />
											Set timer
										</button>
									</div>
								</td>
							</tr>
						))}
				</Table>
			</div>
		</ErrorBoundary>
	);
};

export default AccountsList;
