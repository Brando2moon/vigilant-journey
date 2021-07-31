const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const formidable = require("formidable");
const breeds = require("../data/breeds");
const cats = require("../data/cats");

module.exports = (req, res) => {
	const pathname = url.parse(req.url).pathname;

	if (pathname === "/cats/add-cat" && req.method === "GET") {
		let filePath = path.normalize(
			path.join(__dirname, "../views/addCat.html")
		);
		const index = fs.createReadStream(filePath);

		index.on("data", (data) => {
			let catBreedPLaceholder = breeds.map(
				(breed) => `<option value="${breed}">${breed}</option>`
			);
			let modifiedData = data
				.toString()
				.replace("{{catBreeds}}", catBreedPLaceholder);

			res.write(modifiedData);
		});
		index.on("end", () => {
			res.end();
		});
		index.on("error", (err) => {
			res.write(err);
		});
	} else if (pathname === "/cats/add-breed" && req.method === "GET") {
		let filePath = path.normalize(
			path.join(__dirname, "../views/addBreed.html")
		);
		const index = fs.createReadStream(filePath);
		index.on("data", (data) => {
			res.write(data);
		});
		index.on("end", () => {
			res.end();
		});
		index.on("error", (err) => {
			res.write(err);
		});
	} else if (pathname === "/cats/add-breed" && req.method === "POST") {
		let formData = "";

		req.on("data", (data) => {
			formData += data;
		});

		req.on("end", () => {
			let body = qs.parse(formData);

			fs.readFile("./data/breeds.json", (err, data) => {
				if (err) {
					throw err;
				}

				let breeds = JSON.parse(data);

				breeds.push(body.breed);

				let json = JSON.stringify(breeds);

				fs.writeFile("./data/breeds.json", json, "utf-8", () =>
					console.log("The breed was uploaded successfully")
				);
			});

			res.writeHead(302, { location: "/" });
			res.end();
		});
	} else if (pathname === "/cats/add-cat" && req.method === "POST") {
		let form = new formidable.IncomingForm();
		form.parse(req, (err, fields, files) => {
			let oldPath = files.upload.path;
			//dirname is a global path//
			let newPath = path.normalize(
				path.join(__dirname, "../content/images/" + files.upload.name)
			);

			fs.rename(oldPath, newPath, (err) => {
				if (err) throw err;
				console.log("files was uploaded successfully");
			});
			fs.readFile("./data/cats.json", "utf-8", (err, data) => {
				let allCats = JSON.parse(data);
				allCats.push({
					id: Date.now(),
					...fields,
					image: files.upload.name,
				});
				let json = JSON.stringify(allCats);
				fs.writeFile("./data/cats.json", json, () => {
					res.writeHead(302, { location: "/" });
					res.end();
				});
			});
		});
	} else if (pathname.includes("/cats-edit") && req.method === "GET") {
		let filePath = path.normalize(
			path.join(__dirname, "../views/editCat.html")
		);
		const urlObject = url.parse(req.url);
		let shelterCatPAth = urlObject.pathname;
		let idFromURL = shelterCatPAth.split("/")[2];
		const index = fs.createReadStream(filePath);
		index.on("data", (data) => {
			cats.forEach((cat) => {
				if (cat.id == idFromURL) {
					let modifiedData = data
						.toString()
						.replace("{{id}}", cat.id);
					modifiedData = modifiedData
						.toString()
						.replace("{{name}}", cat.name);
					modifiedData = modifiedData
						.toString()
						.replace("{{description}}", cat.description);
					modifiedData = modifiedData
						.toString()
						.replace("{{image}}", cat.image);
					const breedsAsOptions = breeds.map((b) => {
						if (b != cat.breed) {
							return `<option value="${b}">${b}</option>`;
						} else {
							return `<option value="${b}" selected>${b}</option>`;
						}
					});
					modifiedData = modifiedData.replace(
						"{{catBreeds}}",
						breedsAsOptions.join("\n")
					);
					res.write(modifiedData);
				}
			});
		});
		index.on("end", () => {
			res.end();
		});
		index.on("error", (err) => {
			console.log(err);
		});
	} else if (
		pathname.includes("/cats-find-new-home") &&
		req.method === "GET"
	) {
	} else if (pathname.includes("/cats-edit") && req.method === "POST") {
		fs.readFile(
			"data/cats.json",
			"utf-8",
			function readFileCallback(err, data) {
				if (err) {
					console.log(err);
				} else {
					let currentCats = JSON.parse(data); // now the cat is an object
					let catId = req.url.split("/")[1];
					currentCats = currentCats.filter((cat) => cat.id !== catId); // add some data
					let json = JSON.stringify(currentCats); // convert it back to json
					fs.writeFile("data/cats.json", json, "utf-8", () => {
						res.writeHead(302, { location: "/" });
						res.end();
					});
				}
			}
		);
	} else if (
		pathname.includes("/cats-find-new-home") &&
		req.method === "POST"
	) {
	} else {
		return true;
	}
};
