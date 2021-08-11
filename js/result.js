window.onload = async function getHats(event) {
	event.preventDefault();

	const resp = await fetch('/~/MaskUp/account/covid-results?all=true', {
		method: 'GET',
		headers: { 'content-Type': 'application/json' }
	})
	const ans = await resp.json();

	/* This is used to show the answer in the code block. 
	   Delete it when copied over to your code */

	populateData(ans); // table

	createPieChart(ans);
}

function populateData(data) {
	console.log(data)

	let tbody = document.getElementById("tbody");

	data.forEach((e, i) => {
		console.log(e + i)
		let tr = document.createElement("tr");

		let th = document.createElement("th");
		th.innerHTML = i + 1 // row number
		th.setAttribute('scope', 'row');

		let name = document.createElement("td");
		name.innerHTML = e.name;

		let date = document.createElement("td");
		date.innerHTML = e.date;

		let result = document.createElement("td");
		result.innerHTML = `${e.result}%`

		tr.appendChild(th);
		tr.appendChild(name);
		tr.appendChild(date);
		tr.appendChild(result);

		tbody.appendChild(tr);
	})
}

function createPieChart(data) {

	let summary = {};
	data.forEach((e, i) => {
		let keys = Object.keys(e);

		keys.forEach(key => {
			// check if key is true

			if (key === "name" || key === "date" || key === "_id" || key === "result") { return }
			if (e[key]) {
				if (key in summary) {

					summary[key] += 1;
				} else {
					summary[key] = 1
				}
			}

		});

	})

	console.log(summary);
	let pieChartList = createList(summary);

	var chart = anychart.pie();

	// set the chart title
	chart.title("Your most common symptoms :(");

	// add the data
	chart.data(pieChartList); // https://www.anychart.com/blog/2017/12/06/pie-chart-create-javascript/

	// display the chart in the container
	chart.container('container');
	chart.draw();

	// console.log(summary);
}

function createList(summary) {
	// {muscle: 2, congest: 2, diarrhea: 2}
	let data = [];

	let keys = Object.keys(summary);

	keys.forEach(key => {
		let obj = {
			x: key,
			value: summary[key]
		}
		data.push(obj);
	})

	return data;

}

function download_csv(csv, filename) {
	var csvFile;
	var downloadLink;

	// CSV FILE
	csvFile = new Blob([csv], { type: "text/csv" });

	// Download link
	downloadLink = document.createElement("a");

	// File name
	downloadLink.download = filename;

	// We have to create a link to the file
	downloadLink.href = window.URL.createObjectURL(csvFile);

	// Make sure that the link is not displayed
	downloadLink.style.display = "none";

	// Add the link to your DOM
	document.body.appendChild(downloadLink);

	// Lanzamos
	downloadLink.click();
}

function export_table_to_csv(html, filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");

	for (var i = 0; i < rows.length; i++) {
		var row = [],
			cols = rows[i].querySelectorAll("td, th");

		for (var j = 0; j < cols.length; j++)
			row.push(cols[j].innerText);

		csv.push(row.join(","));
	}

	// Download CSV
	download_csv(csv.join("\n"), filename);
}

document.querySelector("#download-results")
	.addEventListener("click", function () {
		var html = document.querySelector("table")
			.outerHTML;
		export_table_to_csv(html, "covid-results.csv");
	});