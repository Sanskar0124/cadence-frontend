import LeadInfo from "./LeadInfo/LeadInfo";
import SearchPlaceholder from "./Placeholder/Placeholder";
import "./SearchResults.scss";

const SearchResults = ({ active, input, results, loading, error }) => {
	return (
		<div className={`search ${active && "active"}`}>
			{loading ? (
				<SearchPlaceholder />
			) : input ? (
				results?.length ? (
					results?.map(lead => <LeadInfo key={lead.lead_id} lead={lead} />)
				) : (
					<>
						<div className="no-results">No Results found</div>
						<span className="error">{error}</span>
					</>
				)
			) : null}
		</div>
	);
};

export default SearchResults;
