const url = require("url");
const fs = require("fs");
const path = require("path");
const cats = require("../data/cats");

module.exports = (req, res) => {
	const pathname = url.parse(req.url).pathname;
	if (pathname === "/" && req.method === "GET") {
		let filepath = path.normalize(
			path.join(__dirname, "../views/home/index.html")
		);

		fs.readFile(filepath, (err, data) => {
			let modifiedCats = cats.map(
				(cat) => `<li>
                <img src="${path.join(
					"../content/images/" + cat.image
				)}" alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p><span>Breed: </span>${cat.breed}</p>
                <p><span>Description: </span>${cat.description}</p>
                <ul class="buttons">
                    <li class="btn edit"><a href="/cats-edit/${
						cat.id
					}">Change Info</a></li>
                    <li class="btn delete"><a href="/cats-find-new-home/${
						cat.id
					}">NewHome</a></li>
                </ul>
            </li>`
			);
			let modifiedData = data
				.toString()
				.replace("{{cats}}", modifiedCats);

			console.log(err);
			if (err) {
				red.writeHead(404, {
					"content-type": "text/plain",
				});

				res.write(404);
				res.end();
				return;
			}
			res.writeHead(200, {
				"content-type": "text/html",
			});
			res.write(modifiedData);
			res.end();
		});
	} else {
		return true;
	}
};
