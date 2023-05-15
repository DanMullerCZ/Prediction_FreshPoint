const http = require("http");
const calculatePredictions = require("./calculatePredictions");
const PORT = 3000;

// creating server
const server = http.createServer((req, res) => {
	const { url, method } = req;

	switch (url) {
		// my own sanity check
		case "/":
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("Welcome to the home page!");
		break;

		// main post endpoint
		case "/predict":
			if (method === "POST") {
				let rawData = "";

				// collects data from request
				req.on("data", (chunk) => {
					rawData += chunk;	
				});

				// after getting all request data
				req.on("end", () => {
					const { params, data } = JSON.parse(rawData);
					const numPredictions = 5;
					const predicate = calculatePredictions(data, params, numPredictions);
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ data: predicate }));
				});
			} else {
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Invalid method: " + method);
			}
		break;

		// 404 page
		default:
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("404 Not Found\n");
		break;
	}
});

// make server listen for requests
server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
