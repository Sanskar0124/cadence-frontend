import {
	MinusOutline,
	Plus,
	RoundedTick,
	Edit,
	SuccessTick,
	Minus,
} from "@cadence-frontend/icons";
import { Input, ThemedButton } from "@cadence-frontend/widgets";
import React, { useState, useEffect, useContext } from "react";
import styles from "./AddReasons.module.scss";
import InputField from "./components/InputField";
import { MessageContext } from "@cadence-frontend/contexts";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const AddReasons = ({ reasons, taskSettings, setTaskSettings }) => {
	const { addError, addSuccess } = useContext(MessageContext);
	const user = useRecoilValue(userInfo);

	const [hideInput, setHideInput] = useState(false);
	const [inputText, setInputText] = useState("");
	const [reasonList, setReasonList] = useState(
		reasons?.map((reason, index) => ({
			id: index,
			reason: reason,
		})) || []
	);

	useEffect(() => {
		const res = reasonList?.map(({ reason }) => reason) || [];
		setTaskSettings({ ...taskSettings, skip_reasons: [...res] });
	}, [reasonList]);

	const handleNewReason = () => {
		if (inputText === "") {
			addError({ text: "Reason field cannot be empty" });
			return;
		}
		if (reasonList?.length > 9) {
			addError({ text: "Reasons limit reached, delete some reasons" });
			return;
		}
		setHideInput(!hideInput);
		const newReason = {
			id: reasonList !== [] ? reasonList?.length + 1 : 1,
			reason: inputText,
		};
		// if(!reasonList) setReasonList([]);
		setReasonList(prev => [...prev, newReason]);
		setInputText("");
	};

	const handleDeleteReason = id => {
		const newList = reasonList?.filter(item => item.id !== id);
		setReasonList(newList);
	};

	return (
		<div className={styles.addReasons}>
			<div className={styles.others}>
				<div className={`${styles.singleText}`}>
					<p className={`${styles.text}`}>
						{COMMON_TRANSLATION.OTHER[user?.language?.toUpperCase()]}
					</p>
					<div className={`${styles.icons}`}>
						<Minus size="15px" color="#E4E6EA" />
					</div>
				</div>
			</div>
			{reasonList &&
				reasonList?.map(
					listItem =>
						listItem.reason !== "Other" && (
							<div className={styles.others} key={listItem.id}>
								<InputField
									listItem={listItem}
									setReasonList={setReasonList}
									reasonList={reasonList}
									handleDeleteReason={handleDeleteReason}
								/>
							</div>
						)
				)}
			{hideInput && (
				<div className={styles.others}>
					{/* input box */}
					<Input
						value={inputText}
						setValue={value => setInputText(value)}
						placeholder="eg: lead unavailable"
						width="400px"
						height="40px"
					/>
					<div className={styles.icons}>
						<SuccessTick size="15px" color="#567191" onClick={handleNewReason} />
						<MinusOutline
							size="15px"
							color="#567191"
							onClick={() => {
								setHideInput(!hideInput);
								setInputText("");
							}}
						/>
					</div>
				</div>
			)}
			{!hideInput && (
				<ThemedButton
					className={styles.addWebhookButton}
					theme="GREY"
					onClick={() => {
						setHideInput(!hideInput);
					}}
					width="fit-content"
					disabled={reasonList.length === 10}
				>
					<Plus size="13.3px" />{" "}
					<div>{COMMON_TRANSLATION.ADD_REASON[user?.language?.toUpperCase()]}</div>
				</ThemedButton>
			)}
		</div>
	);
};

export default AddReasons;
