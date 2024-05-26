import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.scss";

import Input from "../Input/Input";
import { CloseGradient, Search } from "@cadence-frontend/icons";
import { InputThemes } from "@cadence-frontend/themes";
import { capitalize, Colors } from "@cadence-frontend/utils";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { userInfo } from "@cadence-frontend/atoms";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from "@cadence-frontend/components";

const SearchBar = ({
	value,
	setValue,
	width = "100%",
	height,
	onSearch,
	onFocus = () => null,
	className,
	placeholderText,
	handleClick = () => null,
	...rest
}) => {
	const [focus, setFocus] = useState(false);

	const user = useRecoilValue(userInfo);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (value?.length > 0 && typeof onSearch === "function") {
				onSearch(value);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [value]);
	return (
		<ErrorBoundary>
			<div
				className={`${styles.searchBarContainer} ${className ?? ""} ${
					focus ? styles.focus : ""
				}`}
				style={{ width: width, height: height }}
				onClick={handleClick}
			>
				<div className={styles.searchIcon}>
					<Search />
				</div>
				<div className={styles.searchInput}>
					<Input
						type="text"
						value={value}
						setValue={setValue}
						className={styles.inputField}
						onFocus={e => {
							onFocus(e);
							setFocus(true);
						}}
						onBlur={() => {
							setFocus(false);
						}}
						placeholder={capitalize(
							placeholderText
								? placeholderText
								: COMMON_TRANSLATION.SEARCH[user?.language?.toUpperCase()]
						)}
						theme={InputThemes.TRANSPARENT}
						maxLength={50}
						autoComplete="off"
						{...rest}
					/>

					<div
						className={`${styles.close} ${value?.length > 0 ? styles.activeClose : ""}`}
						onClick={() => {
							setValue("");
						}}
					>
						<CloseGradient size="1.2rem" color={Colors.white} />
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default SearchBar;
