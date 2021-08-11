let spinner = document.querySelector('.spinner');
let resultsDiv = document.getElementById("results");

async function trackerSubmit(event) {
	event.preventDefault(); // prevent page from refreshing
	
	spinner.classList.remove("hidden");
	let name = document.getElementById("name").value;
	let date = document.getElementById("date").value;
	let fever = document.getElementById("fever").checked;
	let cough = document.getElementById("cough").checked;
	let breath = document.getElementById("breath").checked;
	let fatigue = document.getElementById("fatigue").checked;
	let muscle = document.getElementById("muscle").checked;
	let headache = document.getElementById("headache").checked;
	let loss = document.getElementById("loss").checked;
	let sore = document.getElementById("sore").checked;
	let congest = document.getElementById("congest").checked;
	let nausea = document.getElementById("nausea").checked;
	let diarrhea = document.getElementById("diarrhea").checked;
	
	let data = {
		name, date, fever, cough, breath, fatigue, muscle, headache, loss, sore, congest, nausea, diarrhea
	}
	
	console.log(data)
	
	
	let results = analyzeResults(data);
	let percentPositive = Math.floor(results * 100)
	
	console.log(percentPositive)
	
	data["result"] = percentPositive;
	
	document.getElementById("percent").innerHTML = `${percentPositive}%`
	
	await postData(data);
	
	spinner.classList.add("hidden");
	resultsDiv.classList.remove("hidden");
}

function analyzeResults(data) {
	let keys = Object.keys(data);
	let count = 0; // # positive
	let overall = 0; // # total q
	
	keys.forEach(e =>{
		if (e === "name" || e === "date") { return } // equiv of `continue`
		if (data[e]) {
			count += 1;
		}
		overall += 1;
	})
	
	let stats = count / overall
	
	return stats;
}

async function postData(data) {
	const resp = await fetch('/~/MaskUp/account/covid-results', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
	const ans = await resp.json();
	console.log(ans);
}