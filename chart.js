function updateCharts() {
    var selectBox = document.getElementById("dataOptions");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var filename;

    switch (selectedValue) {
        case 'raw':
            filename = "HEAT.csv";
            break;
        case 'cleaned':
            filename = "HEAT_REGRESSED.csv";
            break;
        case 'combined':
            filename = "COMBINED_DATA.csv";
            break;
        default:
            filename = "HEAT.csv";
            break;
    }

    var startYear = document.getElementById("startYear").value;
    var endYear = document.getElementById("endYear").value;

    var selectedCountries = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach(function(checkbox) {
        selectedCountries.push(checkbox.value);
    });

    var margin = {
            top: 20,
            right: 100,
            bottom: 30,
            left: 40
        },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    d3.csv(filename, function(data) {

        data = data.filter(function(d) {
            return d.Year >= startYear && d.Year <= endYear && selectedCountries.includes(d.Country);
        });

        var svg = d3.select("#chart svg g");
        if (svg.empty()) {
            svg = d3.select("#chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .attr("class", "x-axis");

            svg.append("g")
                .attr("class", "y-axis");
        }

        var x = d3.scaleLinear()
            .domain([startYear, endYear])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {
                return +d.Value;
            })])
            .nice()
            .range([height, 0]);

        svg.select(".x-axis").call(d3.axisBottom(x).tickFormat(d3.format("d")));
        svg.select(".y-axis").call(d3.axisLeft(y));

        selectedCountries.forEach(function(country) {
            var countryData = data.filter(function(d) {
                return d.Country === country;
            });

            var line = d3.line()
                .x(function(d) {
                    return x(+d.Year);
                })
                .y(function(d) {
                    return y(+d.Value);
                });
            var expectancy = d3.line()
                .x(function(d) {
                    return x(+d.Year);
                })
                .y(function(d) {
                    return y(+d.Expectancy);
                })

            svg.append("path")
                .datum(countryData)
                .attr("class", "line")
                .attr("d", line);
            svg.append("path")
                .datum(countryData)
                .attr("class", "expectancy")
                .attr("d", expectancy);

            var lastDataPoint = countryData[countryData.length - 1];
            svg.append("text")
                .attr("x", x(+lastDataPoint.Year))
                .attr("y", y(+lastDataPoint.Value))
                .attr("dx", 2)
                .attr("dy", 0)
                .text(country)
                .style("font-size", "12px")
                .style("fill", "black");
            svg.append("text")
                .attr("x", x(+lastDataPoint.Year))
                .attr("y", y(+lastDataPoint.Expectancy))
                .attr("dx", 2)
                .attr("dy", 0)
                .text(country)
                .style("font-size", "12px")
                .style("fill", "black");
        });
    });
}

function removeChart() {

    var chartSvg = document.getElementById("chart").querySelector("svg");

    if (chartSvg) {

        chartSvg.remove();
    }
}

function changeData() {
    removeChart();
    updateCharts();
    var selectBox = document.getElementById("dataOptions");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var filename;

    switch (selectedValue) {
        case 'raw':
            filename = "HEAT.csv";
            break;
        case 'cleaned':
            filename = "HEAT_REGRESSED.csv";
            break;
        case 'combined':
            filename = "COMBINED_DATA.csv";
            break;
        default:

            filename = "HEAT.csv";
            break;
    }
    d3.select("#my_dataviz").selectAll("*").remove();

    var margin = {
            top: 10,
            right: 25,
            bottom: 30,
            left: 120
        },
        width = 700 - margin.left - margin.right,
        height = 1200 - margin.top - margin.bottom;

    var svg = d3.select("#my_dataviz").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(filename, function(data) {

        var myGroups = d3.map(data, function(d) {
            return d.Year;
        }).keys()
        var myVars = d3.map(data, function(d) {
            return d.Country;
        }).keys()

        var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
        svg.append("g").style("font-size", 15).attr("transform", "translate(0," + height + ")").attr('class', 'x-axis-label').call(d3.axisBottom(x).tickSize(0)).style("font-family", "Quicksand").style("font-weight", "1000").select(".domain").remove()

        var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.3);
        svg.append("g").style("font-size", 15).style("font-family", "Quicksand").style("font-weight", "1000").attr('class', 'y-axis-label').call(d3.axisLeft(y).tickSize(0)).select(".domain").remove()

        var myColor = d3.scaleSequential().domain([70, 76, 82, 88, 94, 100]).interpolator(function(value) {
            console.log(value)
            if (value == 5) return "#dd000f";
            else if (value < 5 && value >= 4) return "#ff4a4a";
            else if (value < 4 && value >= 3) return "#ff8800";
            else if (value < 3 && value >= 2) return "#ebff38";
            else if (value < 2 && value >= 1) return "#e591ce";
            else if (value < 1 && value >= 0) return "#8706b2";
            else return "#73d7ff";
        });

        var tooltip = d3.select("#my_dataviz").append("div").style("opacity", 0).attr("class", "tooltip").style("background-color", "white").style("color", "black").style("border", "solid").style("position", "absolute").style('top', '0').style("border-width", "2px").style("border-radius", "15px").style("padding", "20px")

        var mouseover = function(d) {
            tooltip.style("opacity", 1)
            d3.select(this).style("stroke", "black").style("opacity", 1)
        }
        var mousemove = function(d) {
            tooltip.html("<h3>" + d.Country + " (" + d.Year + ")</h3>" + "<p>HEALTH POPULATION : " + d.Value + "%<br/> TOTAL EXPECTANCY  : " + d.Expectancy + "% </p>")
                .style("left", (d3.mouse(this)[0] + 10) + "px")
                .style("top", (d3.mouse(this)[1] + 150) + "px");
        }
        var mouseleave = function(d) {
            tooltip.style("opacity", 0)
            d3.select(this).style("stroke", "none").style("opacity", 0.8)
        }

        svg.selectAll().data(data, function(d) {
            return d.Year + ':' + d.Country;
        }).enter().append("rect").attr("x", function(d) {
            return x(d.Year)
        }).attr("y", function(d) {
            return y(d.Country)
        }).attr("rx", 4).attr("ry", 4).attr("width", x.bandwidth()).attr("height", y.bandwidth()).style("fill", function(d) {
            return myColor(d.Value)
        }).style("stroke-width", 4).style("stroke", "none").style("opacity", 0.8).on("mouseover", mouseover).on("mousemove", mousemove).on("mouseleave", mouseleave)
    });

    svg.append("text").attr("x", 0).attr("y", -30).attr("text-anchor", "left").style("font-size", "22px").text("Health care coverage and life expectancy over the years");

    svg.append("text").attr("x", 0).attr("y", -10).attr("text-anchor", "left").style("font-size", "14px").style("fill", "grey").style("max-width", 400).text("The colors represent the intensity of coverage");
}

changeData()

function handleContinentCheckboxClick(continent) {

    var countryCheckboxes = document.querySelectorAll('input[type="checkbox"][data-continent="' + continent + '"]');

    var continentCheckbox = document.getElementById('continent' + continent);
    countryCheckboxes.forEach(function(checkbox) {
        checkbox.checked = continentCheckbox.checked;
    });
}

document.getElementById('continentEurope').addEventListener('click', function() {
    handleContinentCheckboxClick('Europe');
});
document.getElementById('continentAustralia').addEventListener('click', function() {
    handleContinentCheckboxClick('Australia');
});
document.getElementById('continentNorthAmerica').addEventListener('click', function() {
    handleContinentCheckboxClick('NorthAmerica');
});
document.getElementById('continentSouthAmerica').addEventListener('click', function() {
    handleContinentCheckboxClick('SouthAmerica');
});
document.getElementById('continentAsia').addEventListener('click', function() {
    handleContinentCheckboxClick('Asia');
});

function handleRangeChange() {
    var startYear = document.getElementById("startYear").value;
    var endYear = document.getElementById("endYear").value;
    document.getElementById("startYearOutput").textContent = startYear;
    document.getElementById("endYearOutput").textContent = endYear;
    drawHeatmap();
    
}
document.getElementById("startYear").addEventListener("input", handleRangeChange);
document.getElementById("endYear").addEventListener("input", handleRangeChange);
const checkboxs = document.querySelectorAll('input[type="checkbox"]');
checkboxs.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
        if (checkedCount == 2) {
            document.getElementById("chart").style.display = "block";
            updateCharts();
        } else {
            document.getElementById("chart").style.display = "none";
            removeChart();
        }
    });
});
checkboxs.forEach(checkbox => {
    checkbox.addEventListener('click', handleRangeChange);
});

function drawHeatmap() {
    removeChart();
    updateCharts();
    var selectBox = document.getElementById("dataOptions");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var filename;

    switch (selectedValue) {
        case 'raw':
            filename = "HEAT.csv";
            break;
        case 'cleaned':
            filename = "HEAT_REGRESSED.csv";
            break;
        case 'combined':
            filename = "COMBINED_DATA.csv";
            break;
        default:

            filename = "HEAT.csv";
            break;
    }
    console.log("Filename:", filename);

    var startYear = document.getElementById("startYear").value;
    var endYear = document.getElementById("endYear").value;
    console.log("Start Year:", startYear);
    console.log("End Year:", endYear);

    var selectedCountries = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach(function(checkbox) {
        selectedCountries.push(checkbox.value);
    });
    console.log("Selected Countries:", selectedCountries);

    var margin = {
            top: 80,
            right: 25,
            bottom: 30,
            left: 120
        },
        width = 700 - margin.left - margin.right,
        height = (selectedCountries.length * 20);

    var svg = d3.select("#my_dataviz svg g");

    console.log("SVG Selection:", svg);

    d3.csv(filename, function(data) {
        console.log("Data:", data);
        var data = data.filter(function(d) {
            return d.Year >= startYear && d.Year <= endYear && selectedCountries.includes(d.Country);
        });
        console.log("Filtered Data:", data);

        var myGroups = d3.map(data, function(d) {
            return d.Year;
        }).keys()
        var myVars = d3.map(data, function(d) {
            return d.Country;
        }).keys()
        console.log("X Axis Groups:", myGroups);
        console.log("Y Axis Variables:", myVars);
        var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
        var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.3);
        svg.select(".x-axis-label").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).tickSize(0)).select(".domain").remove();
        svg.select(".y-axis-label").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

        var myColor = d3.scaleSequential().domain([70, 76, 82, 88, 94, 100]).interpolator(function(value) {
            if (value == 5) return "#dd000f";
            else if (value < 5 && value >= 4) return "#ff4a4a";
            else if (value < 4 && value >= 3) return "#ff8800";
            else if (value < 3 && value >= 2) return "#ebff38";
            else if (value < 2 && value >= 1) return "#e591ce";
            else if (value < 1 && value >= 0) return "#8706b2";
            else return "#73d7ff";
        });
        console.log("Color Scale:", myColor);

        var tooltip = d3.select("#my_dataviz .tooltip");
        console.log("Tooltip:", tooltip);

        svg.selectAll("rect").data(data, function(d) {
            return d.Year + ':' + d.Country;
        }).transition().duration(500).attr("x", function(d) {
            return x(d.Year)
        }).attr("y", function(d) {
            return y(d.Country)
        }).attr("rx", 4).attr("ry", 4).attr("width", x.bandwidth()).attr("height", y.bandwidth()).style("fill", function(d) {
            return myColor(d.Value)
        });

        svg.selectAll("rect").data(data, function(d) {
            return d.Year + ':' + d.Country;
        }).exit().remove();

        svg.selectAll("rect").data(data, function(d) {
            return d.Year + ':' + d.Country;
        }).enter().append("rect").attr("x", function(d) {
            return x(d.Year)
        }).attr("y", function(d) {
            return y(d.Country)
        }).attr("rx", 4).attr("ry", 4).attr("width", x.bandwidth()).attr("height", y.bandwidth()).style("fill", function(d) {
            return myColor(d.Value)
        });
    });
}