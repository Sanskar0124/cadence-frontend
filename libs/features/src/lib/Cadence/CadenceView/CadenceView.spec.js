import { render, screen } from "@cadence-frontend/test-utils";
import "@testing-library/jest-dom";
import CadenceView from "./CadenceView";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ENV } from "@cadence-frontend/environments";

const server = setupServer(
	rest.get(`${ENV.BACKEND}/v2/sales/department/cadence/:id`, (req, res, ctx) =>
		req.params.id === "123"
			? res(
					ctx.status(200),
					ctx.json({
						msg: "Fetched cadence successfully.",
						data: {
							cadence_id: 120004,
							name: "Outbound prospecting Cadence",
							description: null,
							status: "not_started",
							type: "personal",
							priority: "high",
							integration_type: "salesforce",
							inside_sales: "0",
							end_cadence: false,
							remove_if_reply: false,
							remove_if_bounce: false,
							resynching: false,
							salesforce_cadence_id: "a012w000016sK9uAAE",
							unix_resume_at: null,
							launch_date: null,
							user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
							sd_id: null,
							company_id: null,
							created_at: "2023-02-15T11:12:53.000Z",
							updated_at: "2023-02-15T11:12:56.000Z",
							Tags: [],
							Cadence_Schedule: null,
							User: {
								sd_id: "40d9cbc2-0203-41e0-b086-414b5509d7cc",
								company_id: "f9411bdf-1d98-46bb-900e-e2ee78289f76",
							},
							sequence: [
								{
									node_id: 120020,
									name: "SMS",
									type: "message",
									is_urgent: false,
									is_first: true,
									step_number: 1,
									next_node_id: 120021,
									data: {
										aBTestEnabled: true,
										message: "",
										templates: [
											{
												ab_template_id: "e0f79da8-c1fb-4cee-a1ac-d75e4ad2f39a",
												message: "Hello Ab1",
												percentage: 25,
											},
											{
												ab_template_id: "cc09b855-802e-46f4-88e8-91138b0fb3d0",
												message: "Hello Ab2",
												percentage: 25,
											},
											{
												ab_template_id: "7c63b680-3645-43c7-9f7c-449b05ef4d77",
												message: "Hello Ab3",
												percentage: 25,
											},
											{
												ab_template_id: "c1956db6-88ec-4999-81d2-9b7ca9d7135e",
												message: "Hello Ab4",
												percentage: 25,
											},
										],
									},
									wait_time: 0,
									cadence_id: 120004,
									created_at: "2023-02-15T11:12:59.000Z",
									updated_at: "2023-02-15T11:14:54.000Z",
								},
								{
									node_id: 120021,
									name: "SMS",
									type: "message",
									is_urgent: false,
									is_first: false,
									step_number: 2,
									next_node_id: 120022,
									data: {
										aBTestEnabled: false,
										message: "Hello Normal Mesassge",
										templates: [],
									},
									wait_time: 1440,
									cadence_id: 120004,
									created_at: "2023-02-15T11:14:39.000Z",
									updated_at: "2023-02-15T11:15:03.000Z",
								},
								{
									node_id: 120022,
									name: "SMS",
									type: "automated_message",
									is_urgent: false,
									is_first: false,
									step_number: 3,
									next_node_id: 120023,
									data: {
										aBTestEnabled: false,
										message: "Hello Automatic message",
										templates: [],
									},
									wait_time: 1440,
									cadence_id: 120004,
									created_at: "2023-02-15T11:15:02.000Z",
									updated_at: "2023-02-15T11:15:16.000Z",
								},
								{
									node_id: 120023,
									name: "SMS",
									type: "automated_message",
									is_urgent: false,
									is_first: false,
									step_number: 4,
									next_node_id: null,
									data: {
										aBTestEnabled: true,
										message: "",
										templates: [
											{
												ab_template_id: "d6238fee-a291-43b1-b17f-d89d549886a3",
												message: "Hello Ab1 temp",
												percentage: 0,
											},
											{
												ab_template_id: "46e1c11d-2edd-4154-a334-32886929e59e",
												message: "Hello Ab2 Temp",
												percentage: 100,
											},
										],
									},
									wait_time: 1440,
									cadence_id: 120004,
									created_at: "2023-02-15T11:15:16.000Z",
									updated_at: "2023-02-15T11:17:07.000Z",
								},
							],
						},
					})
			  )
			: res(ctx.status(404))
	)
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders", async () => {
	jest.setTimeout(10000);
	render(<CadenceView />, { path: "/cadence/:id", route: "/cadence/123" });
	await screen.findByText("Outbound prospecting Cadence");
	screen.getByText(/february 15, 2023 • 3 days/i);
	screen.getByRole("button", {
		name: /launch cadence/i,
	});
	screen.getByRole("button", {
		name: /steps \(4\)/i,
	});
	screen.getByRole("button", {
		name: /people \(0\)/i,
	});
	screen.getByRole("heading", {
		name: /step 1:.*semi-automated sms/i,
	});
	screen.getByRole("heading", {
		name: /step 2:.*semi-automated sms/i,
	});
	screen.getByText("Hello Normal Mesassge");
	screen.getByRole("heading", {
		name: /step 3:.*automated sms/i,
	});
	screen.getByRole("heading", {
		name: /step 4:.*automated sms/i,
	});
	await screen.findByRole("button", {
		name: /mail a/i,
	});
	screen.getByRole("button", {
		name: /mail b/i,
	});
	screen.getByRole("button", {
		name: /mail c/i,
	});
	screen.getByRole("button", {
		name: /mail d/i,
	});
});
