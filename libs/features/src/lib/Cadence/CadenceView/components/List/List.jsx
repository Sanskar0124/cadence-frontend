import LeadsList from "../components/LeadsList/LeadsList";
import AccountsList from "../components/AccountsList/AccountsList";

import { LIST_DROPDOWN_VALUES } from "../../constants";

const List = ({
	viewMode,
	setViewMode,
	activeOption,
	searchValue,
	filtersCount,
	setFiltersCount,
	showReassignment,
	setShowReassignment,
	cadenceSettingsDataAccess,
	user,
	cadenceLeadsStats,
	setLeadsData,
}) => {
	const renderComponent = () => {
		switch (activeOption) {
			case LIST_DROPDOWN_VALUES.LEADS:
				return (
					<LeadsList
						viewMode={viewMode}
						setViewMode={setViewMode}
						searchValue={searchValue}
						filtersCount={filtersCount}
						setFiltersCount={setFiltersCount}
						showReassignment={showReassignment}
						setShowReassignment={setShowReassignment}
						cadenceSettingsDataAccess={cadenceSettingsDataAccess}
						user={user}
						cadenceLeadsStats={cadenceLeadsStats}
						setLeadsData={setLeadsData}
					/>
				);

			case LIST_DROPDOWN_VALUES.ACCOUNTS:
				return <AccountsList />;

			default:
				return (
					<LeadsList
						viewMode={viewMode}
						setViewMode={setViewMode}
						searchValue={searchValue}
						filtersCount={filtersCount}
						setFiltersCount={setFiltersCount}
						showReassignment={showReassignment}
						setShowReassignment={setShowReassignment}
						cadenceSettingsDataAccess={cadenceSettingsDataAccess}
						user={user}
						cadenceLeadsStats={cadenceLeadsStats}
						setLeadsData={setLeadsData}
					/>
				);
		}
	};

	return <div>{renderComponent()}</div>;
};

export default List;
