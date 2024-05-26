// writing tests for Leads component

import { fireEvent, render, screen } from "@cadence-frontend/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Leads from "./Leads";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ENV } from "@cadence-frontend/environments";
import { wait } from "@testing-library/user-event/dist/types/utils";

const data = [
	{
		lead_id: 31,
		first_name: "Nishant",
		last_name: "bounceFiout",
		Account: { name: "Ringover" },
	},
	{ lead_id: 32, first_name: "Jack", last_name: "Honks", Account: { name: "Zinger" } },
	{
		lead_id: 37,
		first_name: "Carla",
		last_name: "John",
		Account: { name: "Farmers Coop. of Florida" },
	},
	{ lead_id: 38, first_name: "Test", last_name: "Case", Account: { name: "Prof" } },
];
const data2 = {
	msg: "Leads fetched successfully for user.",
	data: [
		{
			Account: { account_id: 150056, name: "Robocon Team Rudra", size: "11-50" },
			Activities: [
				{
					created_at: "2023-02-24T04:51:57.000Z",
					incoming: null,
					name: "SMS ABTest Stats test resumed",
					read: false,
					status: "Cadence Resumed",
					type: "resume_cadence",
				},
			],
			LeadToCadences: [
				{
					Cadences: [
						{
							cadence_id: 120069,
							name: "SMS ABTest Stats test",
							status: "in_progress",
							Nodes: [
								{
									node_id: 120383,
								},
								{
									node_id: 120377,
								},
							],
						},
					],
					status: "in_progress",
					Tasks: [
						{
							Node: { type: "message", step_number: 1 },
							task_id: 130248,
						},
					],
				},
			],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Parth",
			last_name: "G.",
			lead_id: 120071,
			status: "converted",
		},
		{
			Account: { account_id: 150057, name: "Rohit Mittal2", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Rohit",
			last_name: "Mittal2",
			lead_id: 120079,
			status: "ongoing",
		},
		{
			Account: { account_id: 150058, name: "Rohit Mittal3", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Rohit",
			last_name: "Mittal3",
			lead_id: 120080,
			status: "ongoing",
		},
		{
			Account: { account_id: 150058, name: "Rohit Mittal4", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Rohit",
			last_name: "Mittal4",
			lead_id: 120081,
			status: "ongoing",
		},
		{
			Account: { account_id: 150059, name: "Rohit Mittal5", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Rohit",
			last_name: "Mittal5",
			lead_id: 120082,
			status: "ongoing",
		},
		{
			Account: { account_id: 150059, name: "Rohit Mittal6", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Rohit",
			last_name: "Mittal6",
			lead_id: 120083,
			status: "new_lead",
		},
		{
			Account: { account_id: 150060, name: "Rohit Mittal7", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Rohit",
			last_name: "Mittal7",
			lead_id: 120084,
			status: "ongoing",
		},
		{
			Account: { account_id: 150057, name: "Testing Extra1", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Testing",
			last_name: "Extra1",
			lead_id: 120186,
			status: "ongoing",
		},
		{
			Account: { account_id: 150058, name: "Testing Extra2", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Testing",
			last_name: "Extra1",
			lead_id: 120087,
			status: "ongoing",
		},
		{
			Account: { account_id: 150058, name: "Testing Extra3", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Testing",
			last_name: "Extra3",
			lead_id: 120089,
			status: "ongoing",
		},
		{
			Account: { account_id: 150059, name: "Testing Extra4", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Testing",
			last_name: "Extra4",
			lead_id: 120090,
			status: "ongoing",
		},
		{
			Account: { account_id: 150059, name: "Testing Extra5", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Testing",
			last_name: "Extra5",
			lead_id: 120190,
			status: "new_lead",
		},
		{
			Account: { account_id: 150060, name: "Testing Extra6", size: "11-50" },
			Activities: [],
			LeadToCadences: [],
			created_at: "2023-02-16T12:44:12.000Z",
			duplicate: null,
			first_name: "Testing",
			last_name: "Extra7",
			lead_id: 120191,
			status: "ongoing",
		},
	],
};
const server = setupServer(
	rest.get(`${ENV.BACKEND}/v2/sales/lead/dropdown`, (_, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				msg: "Fetched leads for dropdown successfully.",
				data: [
					{
						lead_id: 120071,
						first_name: "Parth",
						last_name: "Desai",
						Account: { name: "Ringover" },
					},
				],
			})
		);
	}),
	rest.get(`${ENV.BACKEND}/v1/user`, (_, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				msg: "Fetched user successfully",
				data: {
					user: {
						profile_picture:
							"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/profile-images/dd5bed50-df7f-4fce-8857-d61ba87b5ad8",
						user_id: "dd5bed50-df7f-4fce-8857-d61ba87b5ad8",
						first_name: "Sambhav",
						last_name: "Sheets",
						email: "sambhav.jain+googlesheets@bjtmail.com",
					},
				},
			})
		);
	}),
	rest.post(
		`${ENV.BACKEND}/v2/sales/lead/list?limit=20&offset=0`,
		async (req, res, ctx) => {
			return res(ctx.status(200), ctx.json(data2));
		}
	),
	rest.post(`${ENV.BACKEND}/v2/sales/employee/search`, async (req, res, ctx) => {
		const { search } = await req.json();
		let data = [];

		data2.data.forEach(lead => {
			if (
				lead.first_name.toLowerCase().includes(search.toLowerCase()) ||
				lead.last_name.toLowerCase().includes(search.toLowerCase())
			) {
				data.push(lead);
			}
		});

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

test("renders Leads component", async () => {
	jest.setTimeout(10000);
	const user = userEvent.setup();

	render(<Leads />);

	//expect(await screen.findByText("People")).toBeInTheDocument();
	const usersEles = await screen.findAllByTestId("lead-card");

	expect(usersEles).toHaveLength(data2.data.length);
});
test("do not render list on error", async () => {
	server.use(
		rest.post(`${ENV.BACKEND}/v2/sales/lead/list?limit=20&offset=0`, (req, res, ctx) => {
			return res(ctx.status(500));
		})
	);

	render(<Leads />);

	const usersEles = screen.queryAllByTestId("lead-card");

	expect(usersEles).toHaveLength(0);
});
test("Checking that url changes on clicking on lead", async () => {
	//jest.setTimeout(10000);
	const user = userEvent.setup();

	render(<Leads />);

	const usersEles = await screen.findAllByTestId("lead-card");
	await user.click(usersEles[0]);

	expect(window.location.pathname).toBe(`/leads/${data2.data[0].lead_id}`);
});

test("to see if lead is new lead", async () => {
	//jest.setTimeout(10000);
	render(<Leads />);

	//const user = userEvent.setup();
	const labelEle = await screen.findByText("new lead");
	if ("new_lead" === data2.data[0].status) expect(labelEle).toBeInTheDocument();
	else expect(labelEle).not.toBeInTheDocument();
});
test("search a invalid Lead in Search bar", async () => {
	jest.setTimeout(3000);
	render(<Leads />);

	const user = userEvent.setup();
	await user.type(screen.getByPlaceholderText(/search/i), "asdfawer");
	await screen.findByText(/no results found/i);
});
test("search a valid Lead in Search bar", async () => {
	jest.setTimeout(3000);
	render(<Leads />);

	const user = userEvent.setup();

	await user.type(screen.getByPlaceholderText(/search/i), "Rohit");

	const usersEles = await screen.findAllByText(/rohit mittal/i);

	expect(usersEles).toHaveLength(12);

	// expect(usersEles).toHaveLength(6);
});
test("to see if Lead is converted a Lead", async () => {
	render(<Leads />);

	const labelEle = await screen.findByText("converted");
	if ("converted" === data2.data[0].status) expect(labelEle).toBeInTheDocument();
	else expect(labelEle).not.toBeInTheDocument();
});
test("to see steps of Lead if Cadence is started", async () => {
	render(<Leads />);
	// const str = "Step 1/7";
	const usersEles = await screen.findByText("Step 1/7");
	if (1 === data2.data[0].LeadToCadences[0].Tasks[0].Node.step_number)
		expect(usersEles).toBeInTheDocument();
	else expect(usersEles).not.toBeInTheDocument();
	expect(usersEles).toHaveLength(1);
});
test("to see if Lead is ongoing lead", async () => {
	//jest.setTimeout(10000);
	render(<Leads />);
	//const user = userEvent.setup();
	const labelEles = await screen.findAllByText(/ongoing/i);
	// We are having 5 ongoing leads in data2 i.e it should be 5
	expect(labelEles).toHaveLength(5);
});
// test("to render more Leads on Scrolling down", async () => {
// 	//jest.setTimeout(10000);
// 	// render(<Leads />);
// 	// const user = userEvent.setup();
// 	// const usersEles = await screen.findAllByTestId("lead-card");
// 	// expect(usersEles).toHaveLength(data2.data.length);
// 	// await user.scroll(usersEles[0], { x: 0, y: 1000 });
// 	// const usersEles2 = await screen.findAllByTestId("lead-card");
// 	// expect(usersEles2).toHaveLength(data2.data.length + 1);
// 	jest.timeout(2500);
// 	render(<Leads />);
// 	const user = userEvent.setup();
// 	const initialNumLeads = await screen.findAllByTestId("lead-card").length;

// 	// Simulate scrolling down

// 	fireEvent.scroll(window, { target: { scrollY: 1000 } });
// 	// Wait for the new leads to be rendered

// 	const newNumLeads = await screen.findAllByTestId("lead-card").length;

// 	// Expect that more leads have been rendered
// 	expect(newNumLeads).toBeGreaterThan(initialNumLeads);
// });
