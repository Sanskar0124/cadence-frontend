import { useLeadsForSelect } from "@cadence-frontend/data-access";
import styles from "./SelectLead.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../../../Input/Input";
import { InputThemes } from "@cadence-frontend/themes";
import { SmallArrowDown } from "@cadence-frontend/icons";
import { useOutsideClickHandler } from "@cadence-frontend/utils";
import { Skeleton } from "@cadence-frontend/components";

const SelectLead = ({ lead, setLead, isEnabled }) => {
	const observer = useRef();
	const selectLeadRef = useRef(null);

	const [leadsDropdown, setLeadsDropdown] = useState(false);
	const [leadsSearch, setLeadsSearch] = useState("");
	const [searchValue, setSearchValue] = useState("");

	const { fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage, leads } =
		useLeadsForSelect({ enabled: { leads: isEnabled }, search: searchValue });

	useOutsideClickHandler(selectLeadRef, () => setLeadsDropdown(false));

	useEffect(() => {
		const timer = setTimeout(() => {
			if (leadsSearch?.length > 0) setSearchValue(leadsSearch);
		}, 300);
		if (leadsSearch?.length === 0) setSearchValue("");
		return () => clearTimeout(timer);
	}, [leadsSearch]);

	const lastLeadRef = useCallback(
		leadNode => {
			if (isFetchingNextPage || isFetching) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting) {
					fetchNextPage();
				}
			});
			if (leadNode) observer.current.observe(leadNode);
		},
		[isFetchingNextPage, isFetching, hasNextPage]
	);

	return (
		<div
			className={`${styles.selectLead} ${leadsDropdown ? styles.isActive : ""}`}
			onClick={() => setLeadsDropdown(prev => !prev)}
			ref={selectLeadRef}
		>
			<Input
				value={leadsSearch}
				setValue={setLeadsSearch}
				theme={InputThemes.TRANSPARENT}
				placeholder={
					isLoading
						? "Loading..."
						: lead
						? `${lead.first_name} ${lead.last_name}`
						: "Select here"
				}
				className={lead ? styles.selected : ""}
			/>

			<div className={styles.dropdownIcon}>
				<SmallArrowDown />
			</div>
			<div className={`${styles.usersList} ${leadsDropdown ? styles.isVisible : ""}`}>
				{leads?.map((l, index) => {
					const isLastLead = index === leads.length - 1;
					return isLastLead ? (
						<>
							<div
								key={l.lead_id}
								onClick={() => {
									setLead(l);
									setLeadsSearch("");
								}}
								className={`${lead?.lead_id === l.lead_id ? styles.selected : ""}`}
								ref={leads?.length > 19 ? lastLeadRef : null}
							>
								{l.first_name} {l.last_name}
							</div>
							{isFetchingNextPage && <Placeholder />}
						</>
					) : (
						<div
							key={l.lead_id}
							onClick={() => {
								setLead(l);
								setLeadsSearch("");
							}}
							className={`${lead?.lead_id === l.lead_id ? styles.selected : ""}`}
						>
							<span>
								{l.first_name} {l.last_name}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default SelectLead;

const Placeholder = () => {
	return <Skeleton className={styles.placeholder} />;
};
