const http = require("http");

const server = http.createServer( (request, response) => {

	console.log("I HAVE BEEN POKED");

	if (request.method == "POST") {
		// if POST method used
		request.on("data", data => {
			const commands = JSON.parse(data.toString());

			console.log(commands);
		});
	}
});

var port = 3000;
var host = "127.0.0.1";
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
