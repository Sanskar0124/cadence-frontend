import { render, screen } from "@cadence-frontend/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Cadence from "./Cadence";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ENV } from "@cadence-frontend/environments";

const cadences = [
	{
		cadence_id: 120012,
		description: null,
		name: "Personal cadence",
		status: "not_started",
		type: "personal",
		priority: "high",
		inside_sales: "0",
		unix_resume_at: null,
		integration_type: "salesforce",
		user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
		sd_id: null,
		company_id: null,
		created_at: "2023-02-16T09:30:34.000Z",
		Cadence_Schedule: null,
		User: {
			first_name: "Yuvraj",
			last_name: "Singh",
		},
		Tags: [],
		Nodes: [],
		LeadToCadences: [{ lead_id: "120037" }, { lead_id: "120036" }],
	},
	{
		cadence_id: 120004,
		description: null,
		name: "Sales cadence",
		status: "not_started",
		type: "personal",
		priority: "high",
		inside_sales: "0",
		unix_resume_at: null,
		integration_type: "salesforce",
		user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
		sd_id: null,
		company_id: null,
		created_at: "2023-02-15T11:12:53.000Z",
		Cadence_Schedule: null,
		User: {
			first_name: "Yuvraj",
			last_name: "Singh",
		},
		Tags: [],
		Nodes: [
			{ node_id: 120023 },
			{ node_id: 120022 },
			{ node_id: 120021 },
			{ node_id: 120020 },
		],
		LeadToCadences: [],
	},
	{
		cadence_id: 90012,
		description: null,
		name: "Overseas sales prospecting",
		status: "in_progress",
		type: "team",
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
			{ node_id: 90020 },
			{ node_id: 90019 },
			{ node_id: 90021 },
			{ node_id: 90018 },
		],
		LeadToCadences: [{ lead_id: "90229" }, { lead_id: "90223" }, { lead_id: "120011" }],
	},
	{
		cadence_id: 90011,
		description: null,
		name: "Inbound sales prospecting",
		status: "in_progress",
		type: "team",
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
		Nodes: [{ node_id: 90017 }],
		LeadToCadences: [{ lead_id: "90219" }],
	},
	{
		cadence_id: 90010,
		description: null,
		name: "Outbound prospecting cadence",
		status: "in_progress",
		type: "company",
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
		Nodes: [{ node_id: 90016 }],
		LeadToCadences: [{ lead_id: "90221" }, { lead_id: "90219" }],
	},
	{
		cadence_id: 90009,
		description: null,
		name: "Linkedin Bulk Import",
		status: "not_started",
		type: "company",
		priority: "high",
		inside_sales: "0",
		unix_resume_at: null,
		integration_type: "salesforce",
		user_id: "88087b76-1c25-4e2e-88c0-b99a9a880c79",
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
			{ lead_id: "90277" },
			{ lead_id: "90246" },
			{ lead_id: "90273" },
			{ lead_id: "90272" },
			{ lead_id: "90271" },
		],
	},
];

const server = setupServer(
	rest.get(`${ENV.BACKEND}/v2/sales/department/cadence`, (req, res, ctx) => {
		const cadenceType = req.url.searchParams.get("type");
		const cadenceStatus = req.url.searchParams.get("status");
		const cadenceUserId = req.url.searchParams.get("user_id");
		const cadenceSearch = req.url.searchParams.get("search");

		if (
			["personal", "team", "company"].includes(cadenceType) &&
			["in_progress", "not_started", "paused", "scheduled", null].includes(cadenceStatus)
		) {
			let data = cadences.filter(cadence => cadence.type === cadenceType);
			if (cadenceStatus) {
				data = data.filter(cadence => cadence.status === cadenceStatus);
			}
			if (cadenceUserId) {
				data = data.filter(cadence => cadence.user_id === cadenceUserId);
			}
			if (cadenceSearch) {
				data = data.filter(cadence =>
					cadence.name.toLowerCase().includes(cadenceSearch.toLowerCase())
				);
			}

			return res(
				ctx.status(200),
				ctx.json({
					msg: "Cadences fetched successfully.",
					data,
				})
			);
		}
		return res(ctx.status(422));
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders", async () => {
	jest.setTimeout(10000);
	const user = userEvent.setup();
	render(<Cadence />);
	await user.click(
		screen.getByRole("button", {
			name: /personal/i,
		})
	);
	await screen.findByText("Personal cadence");
	screen.getByText("Sales cadence");
	await user.click(
		screen.getByRole("button", {
			name: /group/i,
		})
	);
	screen.getByText("Overseas sales prospecting");
	screen.getByText("Inbound sales prospecting");
	await user.click(
		screen.getByRole("button", {
			name: /company/i,
		})
	);
	screen.getByText("Outbound prospecting cadence");
	screen.getByText("Linkedin Bulk Import");
});

test("filters", async () => {
	jest.setTimeout(20000);
	const user = userEvent.setup();
	render(<Cadence />);
	await user.click(
		screen.getByRole("button", {
			name: /personal/i,
		})
	);
	await user.click(
		screen.getByRole("button", {
			name: /filters/i,
		})
	);
	await user.click(
		screen.getByRole("button", {
			name: /paused/i,
		})
	);
	screen.getByText(/no cadence.*found/i);
	await user.click(
		screen.getByRole("button", {
			name: /not started/i,
		})
	);
	screen.getByText("Personal cadence");
	screen.getByText("Sales cadence");
});

test("search", async () => {
	jest.setTimeout(20000);
	const user = userEvent.setup();
	render(<Cadence />);
	await user.click(
		screen.getByRole("button", {
			name: /personal/i,
		})
	);
	await user.type(screen.getByPlaceholderText(/search/i), "les");
	await screen.findByText("Sales cadence");
});
