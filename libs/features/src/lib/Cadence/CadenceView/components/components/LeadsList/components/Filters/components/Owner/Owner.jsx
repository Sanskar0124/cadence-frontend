import { useEffect, useState } from "react";

import { SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { Div, ErrorBoundary, Image } from "@cadence-frontend/components";
import { Close, Tick } from "@cadence-frontend/icons";

import styles from "./Owner.module.scss";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import { Cadence as CADENCE_TRANSLATION } from "@cadence-frontend/languages";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";

const Owner = ({ open, setOpen, owner, setOwner, statsData, leadsLoading }) => {
	const { owners } = statsData ?? {};

	const [showOverlay, setShowOverlay] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const user = useRecoilValue(userInfo);

	const onClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (open) setShowOverlay(true);
	}, [open]);

	const onAnimationEnd = () => {
		if (!open) setShowOverlay(false);
	};

	return (
		showOverlay && (
			<div className={`${styles.wrapper} ${open ? styles.open : ""}`}>
				<div
					className={`${styles.container} ${open ? styles.open : styles.close}`}
					onAnimationEnd={onAnimationEnd}
				>
					<div className={styles.title}>
						<ThemedButton
							onClick={onClose}
							className={styles.closeBtn}
							theme={ThemedButtonThemes.ICON}
						>
							<Close color={"#000"} />
						</ThemedButton>
						<span>
							{CADENCE_TRANSLATION?.SELECT_OWNER[user?.language?.toUpperCase()]}
						</span>
					</div>
					<div className={styles.searchBar}>
						<SearchBar
							width="100%"
							height="40px"
							value={searchValue}
							setValue={setSearchValue}
							className={styles.search}
						/>
					</div>
					<ErrorBoundary>
						{
							<div className={styles.ownersList}>
								{leadsLoading ? (
									<Placeholder />
								) : (
									Object.keys(owners)
										?.filter(key => key.toLowerCase().includes(searchValue.toLowerCase()))
										?.sort((a, b) => a.localeCompare(b))
										?.map((user, i) => {
											const {
												is_profile_picture_present,
												profile_picture,
												user_id,
												Sub_Department,
											} = owners[user];

											return (
												<div
													key={i}
													onClick={() =>
														owner.find(o => o.user_id === user_id)
															? setOwner(prev => [
																	...prev.filter(o => o.user_id !== user_id),
															  ])
															: setOwner(prev => [
																	...prev,
																	{ user_id: user_id, name: user },
															  ])
													}
													className={`${
														owner.find(o => o.user_id === user_id) ? styles.selected : ""
													}`}
												>
													<div className={styles.info}>
														<Image
															src={
																is_profile_picture_present
																	? profile_picture
																	: "https://cdn.ringover.com/img/users/default.jpg"
															}
														/>
														<div>
															<span>{user}</span>
															<span>{Sub_Department?.name}</span>
														</div>
													</div>
													<div className={styles.tick}>
														<Tick size={14} />
													</div>
												</div>
											);
										})
								)}
							</div>
						}
					</ErrorBoundary>
				</div>
			</div>
		)
	);
};

export default Owner;

const Placeholder = () => {
	return (
		<div className={styles.placeholder}>
			{[...Array(6).keys()].map(() => (
				<Div loading />
			))}
		</div>
	);
};
