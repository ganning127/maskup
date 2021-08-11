function init() {
    const endpoint = "https://api.covid19api.com/summary";
    fetch(endpoint)
        .then(resp => resp.json())
        .then(data => {
            animateValue("cases", data.Global.TotalConfirmed - 1000, data.Global.TotalConfirmed, 3000, "cases");
            animateValue("deaths", data.Global.TotalDeaths - 1000, data.Global.TotalDeaths, 3000, "deaths");
        
        })
}

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function animateValue(id, start, end, duration, unit) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = `${addCommas(current)} ${unit}`;

        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}


init();