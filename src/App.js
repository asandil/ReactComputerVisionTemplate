// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
//import { drawRect } from "./utilities"; // Assuming you have a drawRect utility

function App() {
	const drawRect = (detections, ctx) => {
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

	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	// Main function
	const runCoco = async () => {
		// Load the COCO-SSD model
		const net = await cocossd.load();

		// Loop and detect objects
		setInterval(() => {
			detect(net);
		}, 10);
	};

	const detect = async (net) => {
		// Check data is available
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

			// Set canvas height and width
			canvasRef.current.width = videoWidth;
			canvasRef.current.height = videoHeight;

			// Make Detections
			const obj = await net.detect(video);

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
