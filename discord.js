const Discord = require('discord.js');
const fetch = require("node-fetch");
const fs = require('fs');
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const ACCOUNT_SID = process.env.ACCOUNT_SID;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

function start(token) {
	setInterval(async function () {
		console.log("twilio function starting to run")
		async function getall() {
			const resp = await fetch('/~/MaskUp/open/phones?all=true', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			})
			const ans = await resp.json();
			return ans
		}

		let values = await getall()
		for (let i = 0; i < values.length; i++) {
			client.messages
			.create({ body: 'Wash Hands!', from: '+18507834852', to: values[i].data.tel })
			.then(message => console.log(message.sid));
			
		}
	}, 7200000);
}

module.exports = { start };