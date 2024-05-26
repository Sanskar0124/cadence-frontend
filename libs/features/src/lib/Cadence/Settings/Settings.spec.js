import { render, screen } from "@cadence-frontend/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Settings from "./Settings";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ENV } from "@cadence-frontend/environments";

const server = setupServer(
	rest.get(`${ENV.BACKEND}/v2/sales/department/cadence/:id`, (req, res, ctx) => {
		const { id } = req.params;
		if (id === "123")
			return res(
				ctx.status(200),
				ctx.json({
					msg: "Fetched cadence successfully.",
					data: {
						cadence_id: 123,
						name: " Outbound prospecting Cadence",
						description: "Cadence for all outbound leads",
						status: "not_started",
						type: "company",
						priority: "standard",
						integration_type: "salesforce",
						inside_sales: "0",
						end_cadence: false,
						remove_if_reply: false,
						remove_if_bounce: false,
						resynching: false,
						salesforce_cadence_id: null,
						unix_resume_at: null,
						launch_date: null,
						user_id: "3530f60b-430d-424f-af62-ea67c347fc25",
						sd_id: null,
						company_id: "e20a1ad0-e108-4414-a510-e2b5088351dc",
						created_at: "2023-03-01T08:29:08.000Z",
						updated_at: "2023-03-01T08:29:08.000Z",
						Tags: [],
						Cadence_Schedule: null,
						User: {
							sd_id: "4a81b924-714d-47ea-a696-af0dce14389d",
							company_id: "e20a1ad0-e108-4414-a510-e2b5088351dc",
						},
						sequence: [
							{
								node_id: 215143,
								name: "Linkedin Connection Request",
								type: "linkedin_connection",
								is_urgent: false,
								is_first: true,
								step_number: 1,
								next_node_id: 215145,
								data: { message: "" },
								wait_time: 0,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215145,
								name: "Mail",
								type: "automated_mail",
								is_urgent: false,
								is_first: false,
								step_number: 2,
								next_node_id: 215147,
								data: {
									aBTestEnabled: false,
									attachments: [],
									bcc: "",
									body: "",
									cc: "",
									subject: "",
									templates: [],
								},
								wait_time: 1440,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215147,
								name: "Call",
								type: "call",
								is_urgent: true,
								is_first: false,
								step_number: 3,
								next_node_id: 215149,
								data: { script: "" },
								wait_time: 120,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215149,
								name: "Mail",
								type: "mail",
								is_urgent: false,
								is_first: false,
								step_number: 4,
								next_node_id: 215151,
								data: {
									aBTestEnabled: false,
									attachments: [],
									bcc: "",
									body: "",
									cc: "",
									subject: "",
									templates: [],
								},
								wait_time: 2880,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215151,
								name: "Call",
								type: "call",
								is_urgent: false,
								is_first: false,
								step_number: 5,
								next_node_id: 215153,
								data: { script: "" },
								wait_time: 120,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215153,
								name: "SMS",
								type: "message",
								is_urgent: false,
								is_first: false,
								step_number: 6,
								next_node_id: 215155,
								data: { message: "" },
								wait_time: 10,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215155,
								name: "Reply to",
								type: "reply_to",
								is_urgent: false,
								is_first: false,
								step_number: 7,
								next_node_id: 215157,
								data: {
									aBTestEnabled: false,
									attachments: [],
									body: "",
									replied_node_id: 215149,
									subject: "Re: ",
									templates: [],
								},
								wait_time: 1440,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215157,
								name: "Call",
								type: "call",
								is_urgent: false,
								is_first: false,
								step_number: 8,
								next_node_id: 215158,
								data: { script: "" },
								wait_time: 60,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215158,
								name: "Linkedin Message",
								type: "linkedin_message",
								is_urgent: false,
								is_first: false,
								step_number: 9,
								next_node_id: 215159,
								data: { message: "" },
								wait_time: 1440,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215159,
								name: "Call",
								type: "call",
								is_urgent: false,
								is_first: false,
								step_number: 10,
								next_node_id: 215160,
								data: { script: "" },
								wait_time: 1440,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
							{
								node_id: 215160,
								name: "End Cadence",
								type: "end",
								is_urgent: false,
								is_first: false,
								step_number: 11,
								next_node_id: null,
								data: {
									account_reason: "",
									account_status: "",
									cadence_id: "",
									lead_reason: "",
									lead_status: "",
									to_user_id: "",
								},
								wait_time: 0,
								cadence_id: 210919,
								created_at: "2023-03-01T08:29:08.000Z",
								updated_at: "2023-03-01T08:29:08.000Z",
							},
						],
					},
				})
			);
		return res(ctx.status(404));
	}),
	rest.get(`${ENV.BACKEND}/v1/sales/department/cadence/company-settings`, (_, res, ctx) =>
		res(
			ctx.status(200),
			ctx.json({
				msg: "Fetched company settings for user successfully.",
				data: {
					user_id: "1",
					Company: {
						company_id: "1",
						Company_Setting: {
							unsubscribe_link_madatory_for_semi_automated_mails: false,
							unsubscribe_link_madatory_for_automated_mails: false,
							default_unsubscribe_link_text: "Unsubscribe",
						},
					},
				},
			})
		)
	),
	rest.get(`${ENV.BACKEND}/v2/sales/department/cadence/test-mail-users`, (_, res, ctx) =>
		res(
			ctx.status(200),
			ctx.json({
				msg: "Users fetching successfully.",
				data: [
					{
						user_id: "3530f60b-430d-424f-af62-ea67c347fc25",
						first_name: "Jodio",
						last_name: "Joestar",
						User_Token: { is_google_token_expired: false },
					},
				],
			})
		)
	),
	rest.get(`${ENV.BACKEND}/v2/sales/department/templates`, (req, res, ctx) => {
		const level = req.url.searchParams.get("level");
		const type = req.url.searchParams.get("type");
		if (level === "personal" && type === "linkedin")
			return res(
				ctx.status(200),
				ctx.json({
					msg: "Templates fetched successfully",
					data: [
						{
							name: "LinkedIn Connection Request Message Test Template",
							level: "personal",
							user_id: "3530f60b-430d-424f-af62-ea67c347fc25",
							sd_id: null,
							company_id: null,
							created_at: "2023-03-09T09:20:49.000Z",
							message: "LinkedIn Connection Request Message Test Template 123",
							lt_id: 210025,
							User: {
								profile_picture:
									"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/profile-images/3530f60b-430d-424f-af62-ea67c347fc25",
								first_name: "Jodio",
								last_name: "Joestar",
								is_profile_picture_present: false,
								user_id: "3530f60b-430d-424f-af62-ea67c347fc25",
								Sub_Department: {
									profile_picture:
										"https://storage.googleapis.com/apt-cubist-307713.appspot.com/crm/sub-department-images/4a81b924-714d-47ea-a696-af0dce14389d",
									name: "Admin",
									sd_id: "4a81b924-714d-47ea-a696-af0dce14389d",
									is_profile_picture_present: false,
									Department: {
										department_id: "edde18b3-192b-4f7e-b3ad-96424fd61f83",
										name: "test12450 department",
										company_id: "e20a1ad0-e108-4414-a510-e2b5088351dc",
										created_at: "2023-02-20T09:06:16.000Z",
										updated_at: "2023-02-20T09:06:16.000Z",
										Company: {
											company_id: "e20a1ad0-e108-4414-a510-e2b5088351dc",
											name: "test12450",
											url: null,
											linkedin_url: null,
											location: null,
											number_of_licences: 10,
											is_subscription_active: true,
											is_trial_active: false,
											integration_type: "excel",
											integration_id: null,
											ringover_team_id: null,
											trial_valid_until: null,
											created_at: "2023-02-20T09:06:16.000Z",
											updated_at: "2023-02-20T09:06:16.000Z",
										},
									},
								},
							},
							Sub_Department: null,
						},
					],
				})
			);
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders", async () => {
	render(<Settings />, { path: "/cadence/edit/:id", route: "/cadence/edit/123" });

	await screen.findByText("Outbound prospecting Cadence");
	screen.getByText(/step 1 : linkedin connection request/i);
	screen.getByText(/step 2 : automated mail/i);
	screen.getByText(/step 3 : call/i);
	screen.getByText(/step 4 : semi-automated mail/i);
	screen.getByText(/step 5 : call/i);
	screen.getByText(/step 6 : semi-automated sms/i);
	screen.getByText(/step 7 : reply to \(semi-automated\)/i);
	screen.getByText(/step 8 : call/i);
	screen.getByText(/step 9 : linkedin message/i);
	screen.getByText(/step 10 : call/i);
	screen.getByText(/step 11 : end cadence/i);
});

test("end cadence", async () => {
	const user = userEvent.setup();
	render(<Settings />, { path: "/cadence/edit/:id", route: "/cadence/edit/123" });

	await screen.findByText("Outbound prospecting Cadence");

	await user.click(screen.getByText(/step 11 : end cadence/i));
	screen.getByText(/change status for lead\/account/i);
	screen.getByText(/move contacts\/leads to another cadence/i);
	screen.getAllByText(/change ownership/i);
});

test("template", async () => {
	jest.setTimeout(20000);
	const user = userEvent.setup();
	render(<Settings />, { path: "/cadence/edit/:id", route: "/cadence/edit/123" });

	await screen.findByText("Outbound prospecting Cadence");

	await user.click(screen.getByText(/step 1 : linkedin connection request/i));
	await user.click(screen.getByRole("button", { name: /import template/i }));
	await user.click(
		screen.getByText(/LinkedIn Connection Request Message Test Template/i)
	);
	await user.click(screen.getByRole("button", { name: /import$/i }));
	screen.getByDisplayValue(/linkedin connection request message test template 123/i);
});

test("test mail", async () => {
	jest.setTimeout(20000);
	const user = userEvent.setup();
	render(<Settings />, { path: "/cadence/edit/:id", route: "/cadence/edit/123" });

	await screen.findByText("Outbound prospecting Cadence");

	await user.click(screen.getByText(/step 2 : automated mail/i));
	await user.click(screen.getByRole("button", { name: /send test mail/i }));
	screen.getByRole("heading", {
		name: /test email/i,
	});
	screen.getByText(/from/i);
	await user.click(screen.getByText(/select/i));
	screen.getByText(/jodio joestar/i);
});

test("save as template", async () => {
	jest.setTimeout(20000);
	const user = userEvent.setup();
	render(<Settings />, { path: "/cadence/edit/:id", route: "/cadence/edit/123" });

	await screen.findByText("Outbound prospecting Cadence");

	await user.click(screen.getByText(/step 2 : automated mail/i));
	await user.click(screen.getByRole("button", { name: /save as template/i }));
	screen.getByRole("heading", {
		name: /save as template/i,
	});
	screen.getByText(/Template name/i);
	screen.getByText(/template level/i);
	await user.type(screen.getByPlaceholderText(/enter name/i), "New Test Template");
	await user.click(screen.getByText(/save/i));
});

test("wait for", async () => {
	jest.setTimeout(20000);
	const user = userEvent.setup();
	render(<Settings />, { path: "/cadence/edit/:id", route: "/cadence/edit/123" });

	await screen.findByText("Outbound prospecting Cadence");
	screen.getAllByText(/wait for/i);
	await user.click(screen.getByText(/mins/i));
	screen.getAllByText(/hour/i);
	screen.getAllByText(/days/i);
	screen.getAllByText(/mins/i);
});
