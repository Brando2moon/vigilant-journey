const url = require("url");
const fs = require("fs");
const path = require("path");
const cats = require("../data/cats.json");

module.exports = (req, res) => {
	const pathname = url.parse(req.url).pathname;
	if (pathname === "/" && req.method == "get") {
		let filepath = path.normalize(
			path.join(__dirname, "./views/home/index.html")
		);
		fs.readFile(filepath);
	} else {
		true;
	}
};
