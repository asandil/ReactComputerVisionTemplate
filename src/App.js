// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
//import { drawRect } from "./utilities"; // Assuming you have a drawRect utility

function App() {
	const drawRect = (detections, ctx) => {
		// Clear previous drawings
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// Loop through each prediction
		detections.forEach((prediction) => {
			// Get the bounding box and class
			const [x, y, width, height] = prediction["bbox"];
			const text = prediction["class"];

			// Set styling
			ctx.strokeStyle = "green";
			ctx.lineWidth = 2;
			ctx.font = "18px Arial";
			ctx.fillStyle = "green";

			// Draw rectangles and text
			ctx.beginPath();
			ctx.fillText(text, x, y > 10 ? y - 5 : y + 15);
			ctx.rect(x, y, width, height);
			ctx.stroke();
		});
	};
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	// Main function
	const runCoco = async () => {
		// Load the COCO-SSD model
		const net = await cocossd.load();

		// Loop and detect objects
		setInterval(() => {
			console.log("running");
			detect(net);
		}, 10);
	};

	const detect = async (net) => {
		if (
			typeof webcamRef.current !== "undefined" &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get Video Properties
			const video = webcamRef.current.video;
			const videoWidth = video.videoWidth;
			const videoHeight = video.videoHeight;

			// Set video width and height
			webcamRef.current.video.width = videoWidth;
			webcamRef.current.video.height = videoHeight;

			// Set canvas width and height
			canvasRef.current.width = videoWidth;
			canvasRef.current.height = videoHeight;

			// Make Detections
			const obj = await net.detect(video);
			console.log(obj); // Log detections to console
			// Draw mesh
			const ctx = canvasRef.current.getContext("2d");
			drawRect(obj, ctx);
		}
	};

	useEffect(() => {
		runCoco();
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<Webcam
					ref={webcamRef}
					muted={true}
					style={{
						position: "absolute",
						marginLeft: "auto",
						marginRight: "auto",
						left: 0,
						right: 0,
						textAlign: "center",
						zIndex: 9,
						width: 640,
						height: 480,
					}}
				/>

				<canvas
					ref={canvasRef}
					style={{
						position: "absolute",
						marginLeft: "auto",
						marginRight: "auto",
						left: 0,
						right: 0,
						textAlign: "center",
						zIndex: 8,
						width: 640,
						height: 480,
					}}
				/>
			</header>
		</div>
	);
}

export default App;
