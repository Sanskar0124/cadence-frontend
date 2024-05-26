import { render, screen } from "@cadence-frontend/test-utils";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Calendar from "./Calendar";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { ENV } from "@cadence-frontend/environments";

function nHoursFromNowISOString(n) {
	const d = new Date();
	d.setHours(d.getHours() + n);
	return d.toISOString();
}

const eventsData = [
	{
		calendarId: "zoho.cadence.stage@gmail.com",
		calendarName: "zoho.cadence.stage@gmail.com",
		events: [
			{
				kind: "calendar#event",
				etag: '"3354308074920000"',
				id: "js0a9gh9640eb8f57f9o3u7013j1ubn2",
				status: "confirmed",
				htmlLink: "https://www.google.com/calendar/event",
				created: "2023-02-23T12:07:17.000Z",
				updated: "2023-02-23T12:07:17.460Z",
				summary: "Ringover meeting 1",
				location: "https://meet.ringover.io/mrsfe3",
				creator: { email: "zoho.cadence.stage@gmail.com", self: true },
				organizer: { email: "zoho.cadence.stage@gmail.com", self: true },
				start: { dateTime: nHoursFromNowISOString(0), timeZone: "UTC" },
				end: { dateTime: nHoursFromNowISOString(1), timeZone: "UTC" },
				iCalUID: "js0a9gh9640eb8f57f9o3u7013j1ubn2@google.com",
				sequence: 0,
				attendees: [{ email: "hmo@gmial.com", responseStatus: "needsAction" }],
				extendedProperties: {
					private: {
						ringover_crm_lead_id: "64441",
						ringover_crm_last_update: "new",
						ringover_crm_agenda_id: "30009",
						ringover_crm_user_id: "0563f7d5-7dab-4906-b89d-9cb8770d4c84",
					},
				},
				reminders: { useDefault: true },
				eventType: "default",
			},
		],
	},
];

const server = setupServer(
	rest.post(`${ENV.BACKEND}/calendar/v2/events`, async (_, res, ctx) =>
		res(
			ctx.status(200),
			ctx.json({
				msg: "Successfully fetched Google Calendar Events",
				data: eventsData,
			})
		)
	),
	rest.delete(`${ENV.BACKEND}/calendar/v2/event/:id`, (_, res, ctx) => {
		return res(ctx.status(200));
	}),
	rest.post(`${ENV.BACKEND}/v2/sales/lead/dropdown`, (_, res, ctx) =>
		res(
			ctx.status(200),
			ctx.json({
				msg: "Fetched leads for dropdown successfully.",
				data: [
					{
						lead_id: 64438,
						first_name: "Chau",
						last_name: "Kitzman",
						Account: { name: "Creative Business Systems" },
					},
					{
						lead_id: 64439,
						first_name: "Theola",
						last_name: "Frey",
						Account: { name: "Dal Tile Corporation 2" },
					},
					{
						lead_id: 64440,
						first_name: "Michael",
						last_name: "Ruta",
						Account: { name: "Buckley Miller & Wright" },
					},
				],
			})
		)
	)
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders", async () => {
	jest.setTimeout(10000);
	const user = userEvent.setup();
	render(<Calendar />);
	await screen.findByText("Ringover meeting 1");
	await user.click(screen.getByText("Ringover meeting 1"));
	screen.getByText(/60 min/i);
	screen.getByText("https://meet.ringover.io/mrsfe3");
	await user.click(
		screen.getByRole("button", {
			name: /edit event/i,
		})
	);
	screen.getByText(/duration/i);
	screen.getByText(/15 min/i);
	screen.getByText(/30 min/i);
	screen.getByText(/45 min/i);
	screen.getByText(/60 min/i);
	screen.getByRole("button", {
		name: /save changes/i,
	});
	await user.click(
		screen.getByRole("button", {
			name: /delete event/i,
		})
	);
});
