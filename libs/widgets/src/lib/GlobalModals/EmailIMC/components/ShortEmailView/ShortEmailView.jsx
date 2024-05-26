import { useEffect, useState } from "react";
import styles from "./ShortEmailView.module.scss";
import { Div, ProfilePicture } from "@cadence-frontend/components";
import Editor from "../../../../Editor/Editor";
import moment from "moment-timezone";

const ShortEmailView = ({
	replyToMailData: mailData,
	incoming,
	second,
	loading,
	...rest
}) => {
	const [mailBody, setMailBody] = useState();
	useEffect(() => {
		setMailBody(mailData?.body);
	}, [mailData]);
	return (
		<div className={`${styles.shortEmailView} ${second ? styles.second : ""}`}>
			<Div loading={loading} className={styles.header}>
				<div className={styles.profilePicture}>
					{!incoming ? (
						<ProfilePicture width="40px" height="40px" />
					) : (
						<ProfilePicture showDefault={true} width="40px" height="40px" />
					)}
				</div>
				<div className={styles.userInfo}>
					<div className={styles.name}>{mailData?.from_full_name}</div>
					<div className={styles.email}>{mailData?.from}</div>
				</div>
				<div className={styles.timeStamp}>
					{moment(mailData.timeStamp).fromNow() ?? ""}
				</div>
			</Div>
			<div className={styles.body}>
				<Editor
					height="20vh"
					value={mailBody}
					setValue={val => null}
					className={styles.editorContainer}
					disabled={true}
					loading={loading}
				/>
				{/* <span
					className={styles.viewQuantity}
					onClick={() => {
						setViewMore(prev => !prev);
					}}>
					{ReactHtmlParser(mailBody).length > 60 &&
						(viewMore ? "View Less" : "View More")}
				</span> */}
			</div>
		</div>
	);
};

export default ShortEmailView;
