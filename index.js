const http = require("http");
const url = require("url");
const path = require("path");
const port = 3000;

http.createServer((req, res) => {
	res.writeHead(200, {
		"content-type": "text/plain",
	});
	res.write("hello js world");
	res.end();
}).listen(port);
