const URL = "https://teachablemachine.withgoogle.com/models/fmQZ_wZ8E/";
let highestPoss;
let resultToMessage = {
	"nomask": "No mask detected ⚠️",
	"mask": "Mask Detected ✅"
}

let placeholder = document.getElementById("placeholder-img");
let spinner = document.querySelector(".spinner-grow");
let detectButton = document.getElementById("detect");

let model, webcam, labelContainer, maxPredictions;
let started = false;
var ctx = document.getElementById('barChart');
var lineChart = document.getElementById('lineChart');
var lineChartMask = document.getElementById("lineChartMask");

var myChart;
var myChart2;
var myChart3;
async function init() {
	const modelURL = URL + "model.json";
	const metadataURL = URL + "metadata.json";

	model = await tmImage.load(modelURL, metadataURL);
	maxPredictions = model.getTotalClasses();

	const flip = true;
	webcam = new tmImage.Webcam(350, 350, flip);
	await webcam.setup();
	await webcam.play();
	window.requestAnimationFrame(loop);

	try {
		document.getElementById("placeholder-img")
			.remove()
		spinner.classList.add("hidden");
	} catch {
		console.log("already started once")
	}

	document.getElementById("webcam-container")
		.appendChild(webcam.canvas);

	labelContainer = document.getElementById("label-container");
	for (let i = 0; i < maxPredictions; i++) {
		labelContainer.appendChild(document.createElement("div"));
	}
}

async function loop() {
	webcam.update();
	await predict();
	window.requestAnimationFrame(loop);

}

// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	const prediction = await model.predict(webcam.canvas);
	highestPoss = determineDom(prediction)

	document.getElementById("result")
		.innerHTML = resultToMessage[highestPoss];
}

function determineDom(arr) {
	let maxValue = 0;
	let maxPrediction;

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].probability > maxValue) {
			maxValue = arr[i].probability;
			maxPrediction = arr[i].className;
		}
	}
	return maxPrediction
}

function showToast(text, icon) {
	document.querySelector(".toast-body").innerHTML = text;
	document.querySelector(".icon").innerHTML = `${icon} MaskUp`
	$('.toast')
		.toast({
			delay: 1000
		})
		.toast('show')
		
	
}
async function detect(event) {
	event.preventDefault();

	if (!started) {
		console.log("starting...")
		spinner.classList.remove("hidden");
		started = true;
		placeholder.classList.add('hidden');
		init();
		return;
	}

	let options;
	console.log("starting...")

	let webhookUrl = document.getElementById("url")
		.value;

	populateStats()
	
	let icon = highestPoss === "mask" ? "✅" : "⚠️";
	
	showToast(`Recorded ${highestPoss} detection.`, icon);
	
	console.log(highestPoss)
	if (highestPoss) {
		options = {
			method: "POST",
			headers: {
				status: highestPoss,
				timestamp: Date.now()
			}
		}
		let res = await create(options);
		console.log(res);
	}

	// send fetch to url the user chose;
	console.log(webhookUrl)
	if (webhookUrl) {
		try {
			fetch(webhookUrl, options)
				.then(resp => resp.json())
				.then(data => {
					console.log(data)
				})
		} catch (e) {
			console.log("webhook url is not valid.")
			console.log(e)
		}
	}
}

async function create(data) {
	const resp = await fetch('/~/MaskUp/open/LiveDetectionStats', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
	const ans = await resp.json();

	return ans
}

let webhookInput = document.getElementById('url');

webhookInput.addEventListener('input', () => {
	showToast("Webhook URL has been changed!", "🌎");
})

// creating visualizations
async function getall() {
	const resp = await fetch('/~/MaskUp/open/LiveDetectionStats?all=true', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	})
	const ans = await resp.json();
	console.log(ans)
	return ans
}

async function populateStats() {
	console.log('populating')
	let data = await getall();

	// console.log(data);
	console.log(data)

	let dataClean1 = cleanData(data)

	createBarChart(dataClean1);

	createLineChart(dataClean1);

	createLineChartMask(dataClean1);

}

function cleanData(data) {
	let cleaned = [];
	data.forEach(e => {
		let obj = {
			time: e.dateCreated,
			status: e.data.headers.status
		}

		cleaned.push(obj);
	})

	return cleaned;
}

function createLineChartMask(data) {
	console.log(data);
	console.log(data)
	const groupedDict = groupData(data, "mask");

	const useData = {
		labels: Object.keys(groupedDict),
		datasets: [{
			label: 'Mask Detections',
			data: Object.values(groupedDict),
			fill: false,
			borderColor: 'rgba(75, 192, 192, 0.2)',
			tension: 0.1
  }]
	};

	const config = {
		type: 'line',
		data: useData
	}

	if (myChart3) {
		console.log("destroying...")
		myChart3.destroy();
	}

	myChart3 = new Chart(lineChartMask, config)
	console.log(myChart3)
}

function createLineChart(data) {
	console.log(data);
	console.log(data)
	const groupedDict = groupData(data, "nomask");

	const useData = {
		labels: Object.keys(groupedDict),
		datasets: [{
			label: 'No Mask Detections',
			data: Object.values(groupedDict),
			fill: false,
			borderColor: 'rgba(255, 99, 132, 0.2)',
			tension: 0.1
  }]
	};

	const config = {
		type: 'line',
		data: useData
	}

	if (myChart2) {
		console.log("destroying...")
		myChart2.destroy();
	}

	myChart2 = new Chart(lineChart, config)
	console.log(myChart2)
}

function groupData(data, status) {
	let grouped = {};
	let timeCleanData = cleanTime(data);

	timeCleanData.forEach(e => {
		if (e.time in grouped) {
			if (e.status === status) {
				grouped[e.time] += 1;
			}
		} else {
			if (e.status === status) {
				grouped[e.time] = 1
			}
		}
	})

	console.log(grouped)
	return grouped
}

function cleanTime(data) {
	let cleaned = []
	data.forEach(e => {
		let time = e.time.substring(0, 10)
		let obj = {
			time: time,
			status: e.status
		}
		cleaned.push(obj)

	})
	console.log(cleaned);
	return cleaned;
}

function createBarChart(data) {

	let useData = createBarChartData(data)
	const options = {
		type: 'bar',
		data: {
			labels: ['No Mask', 'Mask'],
			datasets: [{
				label: 'Continous Mask Statistics',
				data: useData,
				backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
        }]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
	}
	if (myChart) {
		console.log("destroying...")
		myChart.destroy();
	}
	myChart = new Chart(ctx, options);

}

function createBarChartData(data) {
	console.log(data)
	let mask = 0;
	let nomask = 0;
	data.forEach(e => {
		if (e.status === "nomask") {
			nomask += 1;
		} else {
			mask += 1;
		}
	})
	console.log([nomask, mask])

	return [nomask, mask]
}

populateStats();