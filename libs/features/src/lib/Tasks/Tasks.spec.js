import { render, screen } from "@cadence-frontend/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Tasks from "./Tasks";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ENV } from "@cadence-frontend/environments";

const tasks = [
	{
		Node: {
			node_id: 1,
			type: "call",
			step_number: 0,
			data: { message: "" },
			next_node_id: null,
		},
		Task: {
			task_id: 181884,
			user_id: "99999999-9999-9999-9999-999999999999",
			name: "1",
			created_at: "2022-08-19T20:23:02.000Z",
			completed: false,
			complete_time: null,
			is_skipped: false,
			start_time: 1660941000000,
			Lead: {
				first_name: "Bruno",
				last_name: "Bucciarati",
				lead_id: 93115,
				job_position: "Capo",
				duplicate: null,
				Account: { account_id: 2422, size: "500-1000", name: "Passione" },
				Lead_phone_numbers: [
					{ time: "10:10:54 AM", is_primary: true, timezone: "Europe/Oslo" },
					{ time: "2:40:54 PM", is_primary: false, timezone: "Asia/Calcutta" },
					{ time: "", is_primary: false, timezone: null },
				],
			},
			Cadence: {
				name: "Call Task",
				cadence_id: 120077,
				Nodes: [
					{ node_id: 120280 },
					{ node_id: 120279 },
					{ node_id: 120278 },
					{ node_id: 120277 },
					{ node_id: 120276 },
				],
			},
		},
	},
	{
		Node: {
			node_id: 212657,
			type: "message",
			step_number: 6,
			data: { message: "" },
			next_node_id: 150065,
			is_urgent: false,
			isLate: 1,
		},
		Task: {
			task_id: 321298,
			user_id: "99999999-9999-9999-9999-999999999999",
			name: "2",
			completed: false,
			complete_time: null,
			is_skipped: false,
			start_time: 1674209487211,
			shown_time: 1674209488210,
			late_time: 1674295888210,
			created_at: "2023-01-20T10:11:27.000Z",
			Lead: {
				first_name: "Dio",
				last_name: "Brando",
				lead_id: 244998,
				job_position: null,
				duplicate: true,
				Account: null,
				Lead_phone_numbers: [
					{ time: "", is_primary: true, timezone: null },
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: false, timezone: null },
				],
			},
			Cadence: {
				name: "Inbound Sales Cadence",
				cadence_id: 150019,
				Nodes: [
					{ node_id: 212705 },
					{ node_id: 150061 },
					{ node_id: 150062 },
					{ node_id: 150063 },
					{ node_id: 150064 },
					{ node_id: 150065 },
					{ node_id: 150067 },
					{ node_id: 212656 },
					{ node_id: 212657 },
					{ node_id: 212658 },
					{ node_id: 212706 },
				],
			},
		},
	},
	{
		Node: {
			node_id: 150065,
			type: "linkedin_profile",
			step_number: 7,
			data: { message: "<p>he</p>" },
			next_node_id: 212656,
			is_urgent: false,
			isLate: 1,
		},
		Task: {
			task_id: 321306,
			user_id: "99999999-9999-9999-9999-999999999999",
			name: "6",
			completed: false,
			complete_time: null,
			is_skipped: false,
			start_time: 1674209568249,
			shown_time: 1674209569194,
			late_time: 1674295969194,
			created_at: "2023-01-20T10:12:48.000Z",
			Lead: {
				first_name: "Narciso",
				last_name: "Anasui",
				lead_id: 245003,
				job_position: null,
				duplicate: true,
				Account: null,
				Lead_phone_numbers: [
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: true, timezone: null },
				],
			},
			Cadence: {
				name: "Inbound Sales Cadence",
				cadence_id: 150019,
				Nodes: [
					{ node_id: 150062 },
					{ node_id: 150063 },
					{ node_id: 150064 },
					{ node_id: 150065 },
					{ node_id: 150067 },
					{ node_id: 212656 },
					{ node_id: 212657 },
					{ node_id: 212658 },
					{ node_id: 212705 },
					{ node_id: 212706 },
					{ node_id: 150061 },
				],
			},
		},
	},
	{
		Node: {
			node_id: 212656,
			type: "whatsapp",
			step_number: 8,
			data: { message: "" },
			next_node_id: 150067,
			is_urgent: false,
			isLate: 1,
		},
		Task: {
			task_id: 321312,
			user_id: "99999999-9999-9999-9999-999999999999",
			name: "16",
			completed: false,
			complete_time: null,
			is_skipped: false,
			start_time: 1674209755553,
			shown_time: 1674209756805,
			late_time: 1674296156805,
			created_at: "2023-01-20T10:15:55.000Z",
			Lead: {
				first_name: "Josefumi",
				last_name: "Kujo",
				lead_id: 245004,
				job_position: null,
				duplicate: true,
				Account: null,
				Lead_phone_numbers: [
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: true, timezone: null },
				],
			},
			Cadence: {
				name: "Inbound Sales Cadence",
				cadence_id: 150019,
				Nodes: [
					{ node_id: 150063 },
					{ node_id: 150064 },
					{ node_id: 150065 },
					{ node_id: 150067 },
					{ node_id: 212656 },
					{ node_id: 212657 },
					{ node_id: 212658 },
					{ node_id: 212705 },
					{ node_id: 212706 },
					{ node_id: 150061 },
					{ node_id: 150062 },
				],
			},
		},
	},
	{
		Node: {
			node_id: 212705,
			type: "data_check",
			step_number: 10,
			data: { message: "" },
			next_node_id: 212706,
			is_urgent: false,
			isLate: 1,
		},
		Task: {
			task_id: 321917,
			user_id: "99999999-9999-9999-9999-999999999999",
			name: "8",
			completed: false,
			complete_time: null,
			is_skipped: false,
			start_time: 1674464466780,
			shown_time: 1674475890662,
			late_time: 1674562290662,
			created_at: "2023-01-23T09:01:06.000Z",
			Lead: {
				first_name: "Jean",
				last_name: "Pierre Polnareff",
				lead_id: 245006,
				job_position: null,
				duplicate: true,
				Account: null,
				Lead_phone_numbers: [
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: false, timezone: null },
				],
			},
			Cadence: {
				name: "Inbound Sales Cadence",
				cadence_id: 150019,
				Nodes: [
					{ node_id: 150061 },
					{ node_id: 212705 },
					{ node_id: 150063 },
					{ node_id: 150064 },
					{ node_id: 150065 },
					{ node_id: 150067 },
					{ node_id: 212656 },
					{ node_id: 212658 },
					{ node_id: 212657 },
					{ node_id: 212706 },
					{ node_id: 150062 },
				],
			},
		},
	},
	{
		Node: {
			node_id: 150063,
			type: "mail",
			step_number: 3,
			data: {
				attachments: [],
				body: "<p>Test</p><p>&nbsp;</p><p>{{unsubscribe(Unsubscribe)}}</p>",
				et_id: 120003,
				subject: "Test",
			},
			next_node_id: 150064,
			is_urgent: false,
			isLate: 1,
		},
		Task: {
			task_id: 317064,
			user_id: "99999999-9999-9999-9999-999999999999",
			name: "3",
			completed: false,
			complete_time: null,
			is_skipped: false,
			start_time: 1673347699072,
			shown_time: 1673347683447,
			late_time: 1673434083447,
			created_at: "2023-01-10T10:47:19.000Z",
			Lead: {
				first_name: "Johnny",
				last_name: "Joestar",
				lead_id: 245013,
				job_position: null,
				duplicate: true,
				Account: null,
				Lead_phone_numbers: [
					{ time: "", is_primary: true, timezone: null },
					{ time: "", is_primary: false, timezone: null },
					{ time: "", is_primary: false, timezone: null },
				],
			},
			Cadence: {
				name: "Inbound Sales Cadence",
				cadence_id: 150019,
				Nodes: [
					{ node_id: 150062 },
					{ node_id: 212656 },
					{ node_id: 212658 },
					{ node_id: 212657 },
					{ node_id: 150067 },
					{ node_id: 150065 },
					{ node_id: 212705 },
					{ node_id: 150064 },
					{ node_id: 150063 },
					{ node_id: 150061 },
					{ node_id: 212706 },
				],
			},
		},
	},
];

const server = setupServer(
	rest.get(`${ENV.BACKEND}/v2/sales/department/task/count/summary`, (_, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				msg: "Fetched count summary for task view successfully.",
				data: {
					tasks: 8,
					activities: [
						{ count: 3, type: "call" },
						{ count: 1, type: "message" },
						{ count: 4, type: "mail" },
					],
				},
			})
		);
	}),

	rest.post(`${ENV.BACKEND}/v2/sales/department/task`, async (req, res, ctx) => {
		const { filters } = await req.json();

		const data =
			filters.task_action.length > 0
				? tasks.filter(({ Node }) => filters.task_action.some(a => a.includes(Node.type)))
				: tasks;
		return res(
			ctx.status(200),
			ctx.json({
				msg: "Fetched Tasks Successfully for user.",
				data,
			})
		);
	}),

	rest.post(`${ENV.BACKEND}/v2/sales/employee/search`, async (req, res, ctx) => {
		const { search } = await req.json();

		const data = tasks
			.filter(
				({ Task }) =>
					Task.Lead.first_name.toLowerCase().includes(search.toLowerCase()) ||
					Task.Lead.last_name.toLowerCase().includes(search.toLowerCase())
			)
			.map(({ Task }) => Task.Lead);

		return res(
			ctx.status(200),
			ctx.json({
				msg: "Leads found",
				data,
			})
		);
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders", async () => {
	jest.setTimeout(10000);
	const user = userEvent.setup();
	render(<Tasks />);
	await screen.findByText(/total tasks.*6/i);

	await screen.findByText(/today you finished/i);
	await screen.findByText(/8 tasks/i);

	await screen.findByText(/today you had/i);
	await screen.findByText(/3 calls/i);
	await screen.findByText(/1 sms/i);
	await screen.findByText(/4 mails/i);

	await screen.findByText(/bruno bucciarati/i);
	await screen.findByText(/call task/i);

	await screen.findByText(/semi automatic sms/i);
	await screen.findByText(/6\/11 steps/i);
	await screen.findByText(/dio brando/i);

	await screen.findByText(/linkedin view profile/i);
	await screen.findByText(/7\/11 steps/i);
	await screen.findByText(/narciso anasui/i);

	await screen.findAllByText(/late/i);
	await screen.findAllByText(/duplicate/i);

	await screen.findByText(/data check/i);
	await screen.findByText(/jean pierre polnareff/i);
	await screen.findByText(/10\/11 steps/i);

	await user.click(
		screen.getByRole("button", {
			name: /filters/i,
		})
	);

	await user.click(screen.getByTestId(/filter-taskaction-call/i));
	screen.getByText(/filters \(1\)/i);
	await screen.findByText(/bruno bucciarati/i);
	await screen.findByText(/call task/i);

	try {
		await screen.findByText(/semi automatic sms/i);
		await screen.findByText(/dio brando/i);
		await screen.findByText(/linkedin view profile/i);
		await screen.findByText(/narciso anasui/i);
		await screen.findByText(/data check/i);
		await screen.findByText(/jean pierre polnareff/i);
	} catch (e) {
		expect(e).toEqual(expect.anything());
	}

	await user.click(screen.getByTestId(/filter-taskaction-email/i));
	await screen.findByText(/johnny joestar/i);

	await user.click(
		screen.getByRole("button", {
			name: /reset all/i,
		})
	);

	await user.type(screen.getByPlaceholderText(/search/i), "Anas");
	await screen.findByText(/narciso anasui/i);

	await user.type(screen.getByPlaceholderText(/search/i), "asdfawer");
	await screen.findByText(/no results found/i);
});
