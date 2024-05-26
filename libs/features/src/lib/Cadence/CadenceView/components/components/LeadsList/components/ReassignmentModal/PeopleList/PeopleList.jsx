import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userInfo } from "@cadence-frontend/atoms";
import styles from "./PeopleList.module.scss";
import { Label, SearchBar, ThemedButton } from "@cadence-frontend/widgets";
import { ThemedButtonThemes } from "@cadence-frontend/themes";
import LeadCard from "./components/LeadCard/LeadCard";
import { Common as COMMON_TRANSLATION } from "@cadence-frontend/languages";
import { ChevronLeft } from "@cadence-frontend/icons";

const PeopleList = ({ active, leads, setLeads, setViewPeopleList }) => {
	const user = useRecoilValue(userInfo);
	const [searchValue, setSearchValue] = useState("");
	const [peopleList, setPeopleList] = useState(leads);

	useEffect(() => {
		const filter = leads?.filter(lead => {
			const searchElement = `${lead?.full_name ?? ""} ${lead?.User?.first_name ?? ""} ${
				lead?.User?.last_name ?? ""
			} ${lead?.last_name ?? ""} ${lead?.first_name ?? ""}`;

			return searchElement.toLowerCase().includes(searchValue.toLowerCase());
		});

		setPeopleList(filter);
	}, [searchValue, leads]);

	const onRemove = leadId => {
		setLeads(prevState => prevState.filter(item => item.lead_id !== leadId));
	};

	return (
		active && (
			<>
				<div className={styles.heading}>
					<ThemedButton
						theme={ThemedButtonThemes.TRANSPARENT}
						onClick={() => setViewPeopleList(prevState => !prevState)}
						width="fit-content"
					>
						<ChevronLeft size={10} />
						<span>{COMMON_TRANSLATION?.BACK[user?.language?.toUpperCase()]}</span>
					</ThemedButton>
				</div>
				<div className={styles.body}>
					<Label>Selected leads ({peopleList.length})</Label>
					<SearchBar
						width="100%"
						height="50px"
						value={searchValue}
						setValue={setSearchValue}
						placeholder="Search for a lead"
						className={styles.searchBar}
					/>
					<div className={styles.leadsList}>
						{peopleList.map(lead => {
							return (
								<LeadCard
									key={lead.lead_id}
									lead={lead}
									onRemove={() => onRemove(lead.lead_id)}
								/>
							);
						})}
					</div>
				</div>
			</>
		)
	);
};

export default PeopleList;
