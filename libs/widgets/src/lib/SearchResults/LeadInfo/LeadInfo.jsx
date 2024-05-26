// import { Calendar, Mail, Message, Phone, Video } from "@crm-frontend/assets";
// import { Colors } from "@crm-frontend/utils";
import { Link } from "react-router-dom";

import "./LeadInfo.scss";

const LeadInfo = ({ lead, count }) => {
	return (
		<Link to={`/leads/${lead.lead_id}`}>
			<div className="search-lead">
				<div className="dp">
					{lead.first_name?.slice(0, 1)}
					{lead.last_name?.slice(0, 1)}
				</div>
				<div className="info">
					<span className="name" title={`${lead.first_name} ${lead.last_name}`}>
						{lead.first_name} {lead.last_name}
					</span>
					<span className="source" title={lead.Account?.name}>
						{lead.Account?.name}
					</span>
					<span className="size" title={lead.Account?.size}>
						{lead.Account?.size}
					</span>
				</div>
				{/* {count && (
					<div className="count">
						<div>
							<div className="blue-shadow">
								<Phone color={Colors.secondary} />
							</div>
							12
						</div>
						<div>
							<div className="orange-shadow">
								<Message color={Colors.red} />
							</div>
							26
						</div>
						<div>
							<div className="yellow-shadow">
								<Mail color={Colors.yellow} />
							</div>
							10
						</div>
						<div>
							<div className="red-shadow">
								<Video color={Colors.red} />
							</div>
							7
						</div>
						<div>
							<div className="green-shadow">
								<Calendar color={Colors.green} />
							</div>
							3
						</div>
					</div>
				)} */}
			</div>
		</Link>
	);
};

export default LeadInfo;
