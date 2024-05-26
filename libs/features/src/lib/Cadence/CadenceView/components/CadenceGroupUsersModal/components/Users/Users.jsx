import { userInfo } from "@cadence-frontend/atoms";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import styles from "./Users.module.scss";
import Skeleton from "../Skeleton/Skeleton";
import { Image as UserImage } from "@cadence-frontend/components";
import { ROLES_MAP } from "libs/features/src/lib/Settings/components/MyAccount/components/MyDetails/constants";

const Users = ({ userInfos }) => {
	const user = useRecoilValue(userInfo);
	const [loading, setLoading] = useState("loading");

	useEffect(() => {
		setLoading("loading");
		const isImageUrlValid = url => {
			const img = new Image();
			img.src = url;
			return new Promise(resolve => {
				img.onerror = () => resolve(false);
				img.onload = () => resolve(true);
			});
		};

		isImageUrlValid(userInfos.profile_picture).then(f => {
			setLoading(f);
		});
	}, [userInfos.profile_picture]);

	return (
		<div className={styles.user}>
			<div className={styles.avatar}>
				{loading === "loading" && <Skeleton className={`${styles.placeholder}`} />}

				{loading !== "loading" && (
					<UserImage
						src={
							loading
								? userInfos.profile_picture
								: "https://cdn.ringover.com/img/users/default.jpg"
						}
						className={styles.userImg}
					/>
				)}
			</div>
			<div className={styles.userInfo}>
				<p className={styles.userName}>
					{userInfos?.first_name} {userInfos?.last_name}
				</p>
				<p className={styles.userRole}>
					{ROLES_MAP[userInfos?.role][user?.language?.toUpperCase()]}
				</p>
			</div>
		</div>
	);
};

export default Users;
