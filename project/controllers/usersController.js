"use strict";

const { check, validationResult } = require("express-validator");
const User = require("../models/user"),
	passport = require("passport"),
	jsonWebToken = require("jsonwebtoken"),
	getUserParams = body => {
		return {
			name: {
				first: body.first,
				last: body.last
			},
			email: body.email,
			password: body.password
		};
	},
	isUsersUpdate= size => {
		if (size === 0 ) {
			return true;
		}
		else{
			return false;
		}
	}

module.exports = {
	getUserParams,
	index: (req, res, next) => {
		User.find()
			.then(users => {
				res.locals.users = users;
				next();
			})
			.catch(error => {
				console.log(`Error fetching users: ${error.message}`);
				next(error);
			});
	},
	indexView: (req, res) => {
		res.render("users/index");
	},
	register: (req, res) => {
		res.render("users/register");
	},

	create: (req, res, next) => {
		if (req.skip) next();
		let newUser = new User(getUserParams(req.body));
		User.register(newUser, req.body.password, (error, user) => {
			if (user) {
				req.flash("success", `${user.fullName}'s account created successfully!`);
				res.locals.redirect = "/index";
				next();
			} else {
				req.flash("error", `Failed to create user account because: ${error.message}.`);
				res.locals.redirect = "/users/new";
				next();
			}
		});
	},
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},
	show: (req, res, next) => {
		let userId = req.params.id;
		User.findById(userId)
			.then(user => {
				res.locals.user = user;
				next();
			})
			.catch(error => {
				console.log(`Error fetching user by ID: ${error.message}`);
				next(error);
			});
	},
	showView: (req, res) => {
		res.render("users/show");
	},
	edit: (req, res, next) => {
		let userId = req.params.id;
		User.findById(userId)
			.then(user => {
				res.render("users/edit", {
					user: user
				});
			})
			.catch(error => {
				console.log(`Error fetching user by ID: ${error.message}`);
				next(error);
			});
	},
	update: (req, res, next) => {
		let userId = req.params.id,
			userParams = {
				name: {
					first: req.body.first,
					last: req.body.last
				},
				email: req.body.email,
				password: req.body.password,
				zipCode: req.body.zipCode
			};
		User.findByIdAndUpdate(userId, {
			$set: userParams
		})
			.then(user => {
				res.locals.redirect = `/users/${userId}`;
				res.locals.user = user;
				next();
			})
			.catch(error => {
				console.log(`Error updating user by ID: ${error.message}`);
				next(error);
			});
	},
	delete: (req, res, next) => {
		let userId = req.params.id;
		User.findByIdAndRemove(userId)
			.then(() => {
				res.locals.redirect = "/users";
				next();
			})
			.catch(error => {
				console.log(`Error deleting user by ID: ${error.message}`);
				next();
			});
	},
	login: (req, res) => {
		res.render("users/login");
	},
	authenticate: passport.authenticate("local", {
		failureRedirect: "/users/login",
		failureFlash: "Failed to login.",
		successRedirect: "/index",
		successFlash: "Logged in!"
	}),

	validate: async (req, res, next) => {
		await check("email").normalizeEmail({
			all_lowercase: true
		}).trim().run(req);
		await check("email", "Email is invalid").isEmail().run(req);
		await check("password", "Password cannot be empty").notEmpty().run(req);

		const error = validationResult(req);
		if (!error.isEmpty()) {
			let messages = error.array().map(e => e.msg);
			req.skip = true;
			req.flash("error", messages.join(" and "));
			res.locals.redirect = "/users/new";
			next();
		} else {
			next();
		}

	},

	logout: (req, res, next) => {
		req.logout();
		req.flash("success", "You have been logged out!");
		res.locals.redirect = "/index";
		next();
	},
	// verifyToken: (req, res, next) => {
	//   let token = req.query.apiToken;
	//   if (token) {
	//     User.findOne({ apiToken: token })
	//       .then(user => {
	//         if (user) next();
	//         else next(new Error("Invalid API token."));
	//       })
	//       .catch(error => {
	//         next(new Error(error.message));
	//       });
	//   } else {
	//     next(new Error("Invalid API token."));
	//   }
	// },
	apiAuthenticate: (req, res, next) => {
		passport.authenticate("local", (errors, user) => {
			if (user) {
				let signedToken = jsonWebToken.sign(
					{
						data: user._id,
						exp: new Date().setDate(new Date().getDate() + 1)
					},
					"secret_encoding_passphrase"
				);
				res.json({
					success: true,
					token: signedToken
				});
			} else
				res.json({
					success: false,
					message: "Could not authenticate user."
				});
		})(req, res, next);
	},
	verifyJWT: (req, res, next) => {
		let token = req.headers.token;
		if (token) {
			jsonWebToken.verify(token, "secret_encoding_passphrase", (errors, payload) => {
				if (payload) {
					User.findById(payload.data).then(user => {
						if (user) {
							next();
						} else {
							res.status(httpStatus.FORBIDDEN).json({
								error: true,
								message: "No User account found."
							});
						}
					});
				} else {
					res.status(httpStatus.UNAUTHORIZED).json({
						error: true,
						message: "Cannot verify API token."
					});
					next();
				}
			});
		} else {
			res.status(httpStatus.UNAUTHORIZED).json({
				error: true,
				message: "Provide Token"
			});
		}
	},
	updateAdminPrivilege: (req, res, next) => {

		let users = req.body.user
		let size = users.length;
		users.forEach(user => {
			let id = user._id;
			let isAdminValue = false;
			if(user.isAdmin === undefined){
				isAdminValue = false
			}
			else{
				isAdminValue = true
			}
			User.findByIdAndUpdate(id, { $set: { isAdmin: isAdminValue } })
				.then((result) => {
					//console.log(result);
					//res.redirect("/users/index");
					size = size-1;
					if(isUsersUpdate(size)){
						console.log("Users updated");
						res.locals.redirect = "/users";
						next();
					}
				}).catch((err) => {
					next(err);
				});
		});
	},

	//verify whether user is admin
	verifyAdmin: (req, res, next) => {
		if (req.user && req.user.isAdmin) {
			next();
		} else {
			res.send("Not authorized");
		}
	},

	//verify whether user is loggedIn
	verifyLoginUser: (req, res, next) => {
		if (req.user) {
			next();
		} else {
			res.send("Not authorized");
		}
	},
};
