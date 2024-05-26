import { MinusOutline, Edit, SuccessTick } from "@cadence-frontend/icons";
import { Input } from "@cadence-frontend/widgets";
import React, { useState } from "react";
import styles from "../AddReasons.module.scss";

const InputField = ({ listItem, handleDeleteReason, reasonList, setReasonList }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [text, setText] = useState(listItem.reason);

	const handleUpdate = event => {
		event.preventDefault();
		if (text === "") return;
		const newList = reasonList.map(item => {
			if (item.id === listItem.id) item.reason = text;
			return item;
		});
		setReasonList(newList);
		setIsEdit(!isEdit);
	};

	return (
		<div className={`${styles.singleText}`}>
			{isEdit ? (
				<Input
					value={text}
					setValue={value => setText(value)}
					placeholder="Update text"
					width="295px"
					height="40px"
					onKeyDown={e => e.key === "Enter" && handleUpdate(e)}
				/>
			) : (
				<p className={`${styles.text}`}>{text}</p>
			)}
			{/* {listItem.id !== 0 ? ( */}
			<div className={`${styles.icons}`}>
				{isEdit ? (
					<SuccessTick size="15px" color="#567191" onClick={handleUpdate} />
				) : (
					<Edit size="15px" color="#567191" onClick={() => setIsEdit(!isEdit)} />
				)}
				<MinusOutline size="15px" onClick={() => handleDeleteReason(listItem.id)} />
			</div>
			{/* ) : (
				""
			)} */}
		</div>
	);
};

export default InputField;
