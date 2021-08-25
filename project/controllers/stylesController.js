"use strict";

const Style = require("../models/stache-style.js");
const User = require("../models/user");
var path = require('path'),
	getStyleParams = req => {
		return {
			title: req.body.title,
			imageUrl: req.files.sampleFile.name,
			description: req.body.description
		};
	};

module.exports = {

	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},
	showAllStyles: (req, res, next) => {
		Style.find({}).then((styles) => {
			res.render("styles/gallery", { styles: styles });
		}).catch((err) => {
			next(err);
		})

	},

	showStyle: (req, res, next) => {
		let id = req.params.id;
		Style.findById(id).then(style => {
			let isFavorite = false
			if (req.user) {
				req.user.favoriteStyles.forEach(styleId => {
					if(styleId.equals(style._id)){
						isFavorite = true
					}
				});
			}
			res.render("styles/gallery-single-post", { style: style, isFavorite :isFavorite });
		}).catch((err) => {
			next(err);
		})

	},

	createNewStyle: (req, res, next) => {
		res.render("styles/new-style");
	},

	createStyle: (req, res, next) => {
		let newStyle = new Style(getStyleParams(req));
		newStyle
			.save()
			.then(() => {
				console.log("Style Cretaed");
				res.locals.redirect = "/style";
				next();
			})
			.catch(err => {
				console.log(`Error creating style: ${err.message}`);
				next(err);
			});
	},

	uploadStyle: (req, res, next) => {
		let sampleFile;
		let uploadPath;
		if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).send('No files were uploaded.');
		}
		sampleFile = req.files.sampleFile;
		let imagePath = path.resolve("./public/images");
		uploadPath = imagePath + "/" + sampleFile.name;

		if (sampleFile.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {

			sampleFile.mv(uploadPath, function (err) {
				if (err)
					next(err);

				next();
			})
		}
		else {
			//req.flash("error","Only image files are allowed!")
			//res.render("styles/new-style")
			next(new Error("Only image files are allowed!"));
		}

	},
	saveAsFavorite: (req, res, next) => {
		let styleId = req.params.id,
			currentUser = req.user;
		if (currentUser) {
			User.findByIdAndUpdate(currentUser, {
				$addToSet: {
					favoriteStyles: styleId
				}
			})
				.then(user => {
					//res.locals.success = true;
					res.locals.redirect = `/style/${styleId}`
					next();
				})
				.catch(error => {
					next(error);
				});
		} else {
			next(new Error("User must log in."));
		}
	},

	getFavoriteStyle: (req, res, next) => {
		console.log("click favorite style");
		let currentUser = req.user;
		User.findById(currentUser._id).populate("favoriteStyles")
			.then(user => {
				console.log("Favorite style: ",user.favoriteStyles);
				res.locals.styles = user.favoriteStyles;
				res.render("styles/favorite-styles");
			})
			.catch(error => {
				console.log(`Error fetching user by ID: ${error.message}`);
				next(error);
			});
	},
}