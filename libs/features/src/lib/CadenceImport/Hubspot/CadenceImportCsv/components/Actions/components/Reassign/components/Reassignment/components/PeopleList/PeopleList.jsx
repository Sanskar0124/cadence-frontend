import { Div } from "@cadence-frontend/components";
import { SearchBar } from "@cadence-frontend/widgets";
import { useState, useEffect, useCallback } from "react";
import styles from "./PeopleList.module.scss";
import PeopleBox from "./components/PeopleBox";
const PeopleList = ({ filteredList, setFilteredList, dispatch, removedLeads, type }) => {
	const [searchValue, setSearchValue] = useState("");
	const [peopleList, setPeopleList] = useState(filteredList);

	useEffect(() => {
		const filter = filteredList?.filter(lead => {
			const searchElement =
				(lead?.first_name ?? "") +
				" " +
				(lead?.last_name ?? "") +
				" " +
				(lead?.Owner?.Name ?? "");
			return searchElement.toLowerCase().includes(searchValue.toLowerCase());
		});

		setPeopleList(filter);
	}, [searchValue]);

	const update = useCallback(lead_id => {
		if (removedLeads.has(lead_id)) removedLeads.delete(lead_id);
		else removedLeads.add(lead_id);

		dispatch(prev => !prev);
		// console.log(lead_id)
	}, []);
	return (
		<Div className={styles.main}>
			<SearchBar
				value={searchValue}
				setValue={setSearchValue}
				placeholderText="Search Peoples"
			/>

			<Div className={styles.peopleWrapper}>
				{peopleList.map(lead => (
					<PeopleBox
						key={lead.lead_id}
						lead={lead}
						type={type}
						update={update}
						removed={removedLeads.has(lead.lead_id)}
					/>
				))}
			</Div>
		</Div>
	);
};
//dm
export default PeopleList;
