import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const ReportDownload = () => {
	const pdfElement = document.getElementById("container");
	//usecors and allowTaint used for handling the cross-origin resource sharing and scrolly insures that canvas is rendered from top of the page
	html2canvas(pdfElement, {
		useCORS: true,
		cacheBust: true,
		allowTaint: false,
		logging: true,
		scrollY: 0,
		windowWidth: document.documentElement.offsetWidth,
		windowHeight: pdfElement.scrollHeight,
		letterRendering: 1,
	}).then(canvas => {
		const image = { type: "jpeg", quality: 0.98 };
		//add margin into pdf
		const margin = [0.5, 0.5];

		//pdf page is 8.5"* 11 inches
		var imgWidth = 8.5;
		var pageHeight = 10;

		var innerPageWidth = imgWidth - margin[0] * 2;
		var innerPageHeight = pageHeight - margin[1] * 2;

		// Calculate the number of pages.
		var pxFullHeight = canvas.height;
		var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
		var nPages = Math.ceil(pxFullHeight / pxPageHeight);

		// Define pageHeight separately so it can be trimmed on the final page.
		var pageHeight = innerPageHeight;

		// Create a one-page canvas to split up the full image.
		var pageCanvas = document.createElement("canvas");
		var pageCtx = pageCanvas.getContext("2d");
		pageCanvas.width = canvas.width;
		pageCanvas.height = pxPageHeight;

		// Initialize the PDF.
		var pdf = new jsPDF("p", "in", [8.5, 10]);

		// console.log(nPages, "pages", pxFullHeight, pxPageHeight);

		for (var page = 0; page < nPages; page++) {
			// Trim the final page to reduce file size.
			if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
				pageCanvas.height = pxFullHeight % pxPageHeight;
				pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
			}

			// Display the page.
			var w = pageCanvas.width;
			var h = pageCanvas.height;
			pageCtx.fillStyle = "white";
			pageCtx.fillRect(0, 0, w, h);
			pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

			// Add the page to the PDF.
			if (page > 0) pdf.addPage();
			// debugger;
			var imgData = pageCanvas.toDataURL("image/" + image.type, image.quality);
			// console.log(imgData);
			pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
		}

		pdf.save("cadences.pdf");
	});
};
