export const drawRect = (detections, ctx) => {
	detections.forEach((prediction) => {
		// Get prediction results
		const [x, y, width, height] = prediction["bbox"];
		const text = prediction["class"];

		// Set styling
		ctx.strokeStyle = "green";
		ctx.font = "18px Arial";

		// Draw rectangles and text
		ctx.beginPath();
		ctx.fillStyle = "green";
		ctx.fillText(text, x, y);
		ctx.rect(x, y, width, height);
		ctx.stroke();
	});
};
