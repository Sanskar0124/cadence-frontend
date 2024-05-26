import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { SearchBar } from "@cadence-frontend/widgets";
import { useEffect, useRef, useState } from "react";
import { getSearchCategoryLabel, getSearchOptions } from "./constants";
import styles from "./Search.module.scss";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import { useNavigate } from "react-router-dom";
import { useIntegrationTranslations } from "@cadence-frontend/languages";

const Search = ({ isAdmin }) => {
	const searchRef = useRef();
	const language = useRecoilValue(userInfo).language;
	const integration_type = useRecoilValue(userInfo).integration_type;
	const phone_system = useRecoilValue(userInfo).phone_system;
	const navigate = useNavigate();
	const [value, setValue] = useState("");
	const [optionsVisible, setOptionsVisible] = useState(false);
	const [searchOptions, setSearchOptions] = useState([]);
	const onFocus = () => setOptionsVisible(true);
	const onBlur = () => setOptionsVisible(false);

	useOutsideClickHandler(searchRef, onBlur);
	const INTEGRATION_TRANSLATION = useIntegrationTranslations(integration_type);

	useEffect(() => {
		if (value.length) {
			const filteredOptions = getSearchOptions(
				language?.toUpperCase(),
				INTEGRATION_TRANSLATION
			)
				//filter options available for the integration
				.filter(option => !option.integration_not_available?.includes(integration_type))
				.filter(option =>
					option.keywords.some(keyword =>
						keyword?.toLowerCase().includes(value.toLowerCase())
					)
				);
			let categorizedOptions = {};
			filteredOptions.forEach(op => {
				categorizedOptions[op.category] = [
					...(categorizedOptions[op.category] || []),
					op,
				];
			});
			setSearchOptions(categorizedOptions);
		} else {
			setSearchOptions([]);
		}
	}, [value]);

	return (
		<div className={styles.searchBar} ref={searchRef}>
			<SearchBar width="300px" value={value} setValue={setValue} onFocus={onFocus} />
			<div className={`${styles.results} ${optionsVisible ? styles.visible : ""}`}>
				{Object.keys(searchOptions).map(key => (
					<div>
						<span>{getSearchCategoryLabel(key, language?.toUpperCase())}</span>
						{searchOptions[key].map(option => (
							<div>
								<span
									onClick={() => {
										navigate(option.link);
										setOptionsVisible(false);
									}}
								>
									{option.label}
								</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Search;
