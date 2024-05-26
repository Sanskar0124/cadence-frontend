import { render } from "@testing-library/react";
import Widgets from "./Widgets";
describe("Widgets", () => {
	it("should render successfully", () => {
		const { baseElement } = render(<Widgets />);
		expect(baseElement).toBeTruthy();
	});
});
