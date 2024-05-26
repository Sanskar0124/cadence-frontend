import { render, screen } from "@cadence-frontend/test-utils";
import "@testing-library/jest-dom";
import CadenceCard from "./CadenceCard";

const cadenceDataAccess = {
	filters: {
		status: null,
		priority: null,
		user_id: null,
		sd_id: null,
	},
	cadencesData: [
		{
			cadence_id: 90012,
			description: null,
			name: "Outbound Prospecting Cadence",
			status: "in_progress",
			type: "personal",
			priority: "high",
			inside_sales: "0",
			unix_resume_at: null,
			integration_type: "salesforce",
			user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
			sd_id: null,
			company_id: null,
			created_at: "2023-02-14T07:31:01.000Z",
			Cadence_Schedule: null,
			User: {
				first_name: "Yuvraj",
				last_name: "Singh",
			},
			Tags: [],
			Nodes: [
				{
					node_id: 90018,
				},
				{
					node_id: 90021,
				},
				{
					node_id: 90020,
				},
				{
					node_id: 90019,
				},
			],
			LeadToCadences: [
				{
					lead_id: "90223",
				},
				{
					lead_id: "90229",
				},
			],
		},
		{
			cadence_id: 90011,
			description: null,
			name: "Inbound Sales Prospecting",
			status: "paused",
			type: "personal",
			priority: "high",
			inside_sales: "0",
			unix_resume_at: null,
			integration_type: "salesforce",
			user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
			sd_id: null,
			company_id: null,
			created_at: "2023-02-14T05:46:51.000Z",
			Cadence_Schedule: null,
			User: {
				first_name: "Yuvraj",
				last_name: "Singh",
			},
			Tags: [],
			Nodes: [
				{
					node_id: 90017,
				},
			],
			LeadToCadences: [
				{
					lead_id: "90219",
				},
			],
		},
		{
			cadence_id: 90010,
			description: null,
			name: "Extension Leads",
			status: "not_started",
			type: "personal",
			priority: "high",
			inside_sales: "0",
			unix_resume_at: null,
			integration_type: "salesforce",
			user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
			sd_id: null,
			company_id: null,
			created_at: "2023-02-13T13:26:01.000Z",
			Cadence_Schedule: null,
			User: {
				first_name: "Yuvraj",
				last_name: "Singh",
			},
			Tags: [],
			Nodes: [
				{
					node_id: 90016,
				},
			],
			LeadToCadences: [
				{
					lead_id: "90221",
				},
				{
					lead_id: "90219",
				},
			],
		},
		{
			cadence_id: 90009,
			description: null,
			name: "Linkedin Bulk Import",
			status: "stopped",
			type: "personal",
			priority: "high",
			inside_sales: "0",
			unix_resume_at: null,
			integration_type: "salesforce",
			user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
			sd_id: null,
			company_id: null,
			created_at: "2023-02-13T13:14:46.000Z",
			Cadence_Schedule: null,
			User: {
				first_name: "Yuvraj",
				last_name: "Singh",
			},
			Tags: [],
			Nodes: [],
			LeadToCadences: [
				{
					lead_id: "90250",
				},
				{
					lead_id: "90253",
				},
				{
					lead_id: "90247",
				},
			],
		},
		{
			cadence_id: 90008,
			description: null,
			name: "Reply Received Check",
			status: "scheduled",
			type: "personal",
			priority: "high",
			inside_sales: "0",
			unix_resume_at: null,
			integration_type: "salesforce",
			user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
			sd_id: null,
			company_id: null,
			created_at: "2023-02-13T12:53:56.000Z",
			Cadence_Schedule: null,
			User: {
				first_name: "Yuvraj",
				last_name: "Singh",
			},
			Tags: [],
			Nodes: [
				{
					node_id: 90013,
				},
				{
					node_id: 90014,
				},
				{
					node_id: 90012,
				},
				{
					node_id: 90015,
				},
			],
			LeadToCadences: [],
		},
	],
	fetchCadencesError: null,
	hasNextPage: true,
	isFetching: false,
	isFetchingNextPage: false,
	duplicateCadenceLoading: false,
	updateLoading: false,
	cadenceLoading: false,
	createCadenceLoading: false,
	cadenceRefetching: false,
	deleteCadenceLoading: false,
	actionLoading: false,
	stopCadenceforLeadLoading: false,
	shareCadenceLoading: false,
};

test("renders", async () => {
	render(
		<CadenceCard
			cadence={cadenceDataAccess.cadencesData[0]}
			cadenceDataAccess={cadenceDataAccess}
			cadenceNo={1}
			totalCadences={cadenceDataAccess.cadencesData.length}
			type="personal"
			viewMode={null}
		/>
	);
	screen.getByText(/yuvraj singh/i);
	screen.getByText("Outbound Prospecting Cadence");
	screen.getByText(/in progress/i);
});

test("renders", async () => {
	render(
		<CadenceCard
			cadence={cadenceDataAccess.cadencesData[1]}
			cadenceDataAccess={cadenceDataAccess}
			cadenceNo={1}
			totalCadences={cadenceDataAccess.cadencesData.length}
			type="personal"
			viewMode={null}
		/>
	);
	screen.getByText(/yuvraj singh/i);
	screen.getByText("Inbound Sales Prospecting");
	screen.getByText(/paused/i);
});

test("renders", async () => {
	render(
		<CadenceCard
			cadence={cadenceDataAccess.cadencesData[2]}
			cadenceDataAccess={cadenceDataAccess}
			cadenceNo={1}
			totalCadences={cadenceDataAccess.cadencesData.length}
			type="personal"
			viewMode={null}
		/>
	);
	screen.getByText(/yuvraj singh/i);
	screen.getByText("Extension Leads");
	screen.getByText(/not started/i);
});

test("renders", async () => {
	render(
		<CadenceCard
			cadence={cadenceDataAccess.cadencesData[3]}
			cadenceDataAccess={cadenceDataAccess}
			cadenceNo={1}
			totalCadences={cadenceDataAccess.cadencesData.length}
			type="personal"
			viewMode={null}
		/>
	);
	screen.getByText(/yuvraj singh/i);
	screen.getByText("Linkedin Bulk Import");
	screen.getByText(/stopped/i);
});

test("renders", async () => {
	render(
		<CadenceCard
			cadence={cadenceDataAccess.cadencesData[4]}
			cadenceDataAccess={cadenceDataAccess}
			cadenceNo={1}
			totalCadences={cadenceDataAccess.cadencesData.length}
			type="personal"
			viewMode={null}
		/>
	);
	screen.getByText(/yuvraj singh/i);
	screen.getByText("Reply Received Check");
	screen.getByText(/scheduled/i);
});
