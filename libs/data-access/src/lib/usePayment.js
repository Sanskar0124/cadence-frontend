import { useQuery } from "react-query";
import { AuthorizedApi } from "./api";

const usePayment = enabled => {
	const getPaymentDetails = () =>
		AuthorizedApi.get("/v2/admin/payment-data").then(res => res.data.data);

	const { data: paymentDetails, isLoading: paymentDetailsLoading } = useQuery(
		"payment-details",
		getPaymentDetails,
		{ enabled }
	);

	return {
		paymentDetails,
		paymentDetailsLoading,
	};
};

export default usePayment;
