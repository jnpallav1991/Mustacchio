"use strict";

const mongoose = require("mongoose"),
	{ Schema } = mongoose,
	Style = require("./stache-style"),
	passportLocalMongoose = require("passport-local-mongoose"),
	userSchema = new Schema(
		{
			name: {
				first: {
					type: String,
					trim: true,
					required:true
				},
				last: {
					type: String,
					trim: true,
					required:true
				}
			},
			email: {
				type: String,
				required: true,
				lowercase: true,
				unique: true
			},
		
			//specify weather user has admin privilege
			isAdmin: {
				type: Boolean,
				default: false
			},
			favoriteStyles: [{ type: Schema.Types.ObjectId, ref: "stacheStyle" }],
		},
		{
			timestamps: true
		}
	);

userSchema.virtual("fullName").get(function () {
	return `${this.name.first} ${this.name.last}`;
});

// userSchema.pre("save", function (next) {
// 	let user = this;
// 	if (user.favoriteStyles === undefined) {
// 		Style.findOne({
// 			email: user.email
// 		})
// 			.then(subscriber => {
// 				user.subscribedAccount = subscriber;
// 				next();
// 			})
// 			.catch(error => {
// 				console.log(`Error in connecting subscriber:${error.message}`);
// 				next(error);
// 			});
// 	} else {
// 		next();
// 	}
// });

userSchema.plugin(passportLocalMongoose, {
	usernameField: "email"
});

module.exports = mongoose.model("User", userSchema,"users");
