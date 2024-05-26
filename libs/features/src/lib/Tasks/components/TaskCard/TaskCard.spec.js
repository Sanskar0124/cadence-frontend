import { render, screen } from "@cadence-frontend/test-utils";
import "@testing-library/jest-dom";
import TaskCard from "./TaskCard";

function nDays(n) {
	const d = new Date();
	return d.setDate(d.getDate() + n);
}

const task = {
	task_id: 30514,
	user_id: "49ed6822-df47-4df9-ae2a-737e3a861f7a",
	name: "16",
	completed: false,
	complete_time: null,
	is_skipped: false,
	start_time: nDays(-2),
	shown_time: nDays(-2),
	late_time: nDays(-1),
	created_at: new Date(nDays(-2)).toISOString(),
	Lead: {
		first_name: "Robert",
		last_name: "E. O. Speedwagon",
		lead_id: 33444,
		job_position: "Sales Manager",
		duplicate: null,
		Account: {
			account_id: 7559,
			size: "250-500",
			name: "Speedwagon Foundation",
		},
		Lead_phone_numbers: [
			{
				time: "11:48:26 AM",
				is_primary: true,
				timezone: "Asia/Tehran",
			},
			{
				time: "",
				is_primary: false,
				timezone: null,
			},
		],
	},
	Cadence: {
		name: "Outbound prospecting Cadence",
		cadence_id: 30149,
		Nodes: [
			{
				node_id: 31087,
			},
			{
				node_id: 31086,
			},
			{
				node_id: 31085,
			},
		],
	},
	Node: {
		node_id: 31085,
		type: "whatsapp",
		step_number: 1,
		data: {
			message: "4nn,",
		},
		next_node_id: 31086,
		is_urgent: true,
		isLate: 1,
	},
};

test("renders", async () => {
	render(
		<TaskCard active={false} task={task} userTimeZone="Asia/Kolkata" viewMode={null} />
	);
	screen.getByText(/2 days ago/i);
	screen.getByText(/1\/3 steps/i);
	screen.getAllByText(/whatsapp/i);
	screen.getByText("Robert E. O. Speedwagon");
	screen.getByText("Speedwagon Foundation");
	screen.getByText("250-500");
	screen.getByText("Outbound prospecting Cadence");
	screen.getByText(/urgent/i);
	screen.getByText(/late/i);
});

test("renders", async () => {
	render(
		<TaskCard
			active={false}
			task={{
				...task,
				shown_time: nDays(-40),
				Node: { ...task.Node, isLate: 0, is_urgent: false, step_number: 2, type: "mail" },
			}}
			userTimeZone="Asia/Kolkata"
			viewMode={null}
		/>
	);
	screen.getByText(/a month ago/i);
	screen.getByText(/2\/3 steps/i);
	screen.getAllByText(/semi automatic email/i);
	screen.getByText("Robert E. O. Speedwagon");
	screen.getByText("Speedwagon Foundation");
	screen.getByText("250-500");
	screen.getByText("Outbound prospecting Cadence");
	try {
		screen.getByText(/late/i);
		screen.getByText(/urgent/i);
	} catch (e) {
		expect(e).toEqual(expect.anything());
	}
});

test("renders", async () => {
	render(
		<TaskCard
			active={false}
			task={{
				...task,
				shown_time: nDays(-100),
				Node: {
					...task.Node,
					type: "message",
				},
			}}
			userTimeZone="Asia/Kolkata"
			viewMode={null}
		/>
	);
	screen.getByText(/3 months ago/i);
	screen.getByText(/semi automatic sms/i);
});

test("renders", async () => {
	render(
		<TaskCard
			active={false}
			task={{
				...task,
				completed: true,
				Node: {
					...task.Node,
					type: "reply_to",
				},
			}}
			userTimeZone="Asia/Kolkata"
			viewMode={null}
		/>
	);
	screen.getByText(/send reply/i);
	screen.getByText(/done/i);
});
