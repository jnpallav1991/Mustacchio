"use strict";
const axios = require("axios");
const apiUrl = "https://api.nytimes.com/svc/search/v2";
const apiKey = "XdlbvIeUSAB27UaWEfGV5GJVCrtu4AtL";

//https://api.nytimes.com/svc/search/v2/articlesearch.json/images/2020/12/17/business/17kidsprivacy1/17kidsprivacy1-smallSquare168.jpg
const nyTimesAuthAxios = axios.create({
	baseURL: apiUrl,
	params: {
		"api-key": apiKey
	}
});

module.exports = {

	articleSearch: async (req, res, next) => {
		try {
			let search = "election";
			let result = await nyTimesAuthAxios.get("/articlesearch.json?q=" + search)
			//console.log(result.data.response.docs);
			//let all=result.data.response.docs.multimedia;
			//console.log(all);
			//let imageUrl = "https://static01.nyt.com/" + result.data.response.docs.multimedia[0].url
			res.render("external-api", { articles: result.data.response.docs, search: search })
			//res.json(result.data.response.docs);
			//res.json(result.data);
		} catch (error) {
			console.log("Error: ", error);
		}

	},
	searchArticle: async (req, res, next) => {

		try {
			let search = req.body.search;
			let result = await nyTimesAuthAxios.get("/articlesearch.json?q=" + search)
			//let imageUrl = "https://static01.nyt.com/" + result.data.response.docs.multimedia[0].url;
			res.render("external-api", { articles: result.data.response.docs, search: search })
		} catch (error) {
			console.log("Error: ", error);
		}
	},

}