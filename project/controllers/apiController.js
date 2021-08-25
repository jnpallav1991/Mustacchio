"use strict";

const Style = require("../models/stache-style.js");
const httpStatus = require("http-status-codes");
const jsonWebToken = require("jsonwebtoken");

module.exports = {

	getStyles: (req, res, next) => {

		Style.find({}).then(styles => {
			styles.forEach(style => {
				style.imageUrl = "http://localhost:3000/images/" + style.imageUrl;
			});
			res.json({
				status: httpStatus.OK,
				data: styles
			});
		}).catch((err) => {
			next(err);
		})
	},
	errorJSON: (error, req, res, next) => {
		let errorObject;
		if (error) {
			errorObject = {
				status: httpStatus.INTERNAL_SERVER_ERROR,
				message: error.message
			};
		} else {
			errorObject = {
				status: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Unknown Error."
			};
		}
		res.json(errorObject);
	},
	getToken: (req, res, next) => {
		let signedToken = jsonWebToken.sign(
			{
				exp: new Date().setDate(new Date().getDate() + 1)
			},
			"secret_encoding_passphrase"
		);
		res.json({
			success: true,
			token: signedToken
		});

	},

	verifyToken: (req, res, next) => {
		let token = req.query.token;
		if (token) {
			jsonWebToken.verify(token, "secret_encoding_passphrase", (errors, payload) => {
				if (payload) {
					next();
				} else {
					res.status(httpStatus.UNAUTHORIZED).json({
						error: true,
						message: "Cannot verify API token."
					});
					next();
				}
			});
		}
		else {
			res.status(httpStatus.UNAUTHORIZED).json({
				error: true,
				message: "Provide Token"
			});
		}
	},
}
