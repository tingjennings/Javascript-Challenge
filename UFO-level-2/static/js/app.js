// Assign the data from `data.js` to a descriptive variable
var tableData = data;

// Set the reference to the table body, button and form
var tbody = d3.select("tbody");
var button = d3.select("button");
var form = d3.select("form");

// Create event handlers 
button.on("click", runEnter);
form.on("submit",runEnter);

// Use d3 to automatically populate tableData
function defaultPopulate(tableData) {
    tableData.forEach((ufoSighting) => {
        var row = tbody.append("tr");
        Object.entries(ufoSighting).forEach(([key, value]) => {
            var cell = row.append("td");
            cell.text(value);
        });
    });

    // Populate Drop Down
    d3.select("#state").selectAll("option")
        .data(d3.map(data.sort(function (a,b) {return d3.ascending(a.state, b.state);}), function(d){return d.state;}).keys())
        .enter()
        .append("option")
        .text(function(d){return d.toUpperCase();})
        .attr("value",function(d){return d;});
    d3.select("#city").selectAll("option")
        .data(d3.map(data.sort(function (a,b) {return d3.ascending(a.city, b.city);}), function(d){return d.city;}).keys())
        .enter()
        .append("option")
        .text(function(d){return toTitleCase(d);})
        .attr("value",function(d){return d;});
    d3.select("#shape").selectAll("option")
        .data(d3.map(data.sort(function (a,b) {return d3.ascending(a.shape, b.shape);}), function(d){return d.shape;}).keys())
        .enter()
        .append("option")
        .text(function(d){return toTitleCase(d);})
        .attr("value",function(d){return d;});
    d3.select("#datetime").selectAll("option")
        .data(d3.map(data.sort(function (a,b) {return d3.ascending(a.datetime, b.datetime);}), function(d){return d.datetime;}).keys())
        .enter()
        .append("option")
        .text(function(d){return d;})
        .attr("value",function(d){return d;});
};

defaultPopulate(tableData);

// Complete the event handler function for the form
function runEnter() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputDate = d3.select("#datetime").property("value");
    var inputCity = d3.select("#city").property("value").toLowerCase();
    var inputState = d3.select("#state").property("value").toLowerCase();
    var inputCountry = d3.select("#country").property("value").toLowerCase();
    var inputShape = d3.select("#shape").property("value").toLowerCase();

    // Store the input conditions that have values into an array and set up conditional statement
    var inputArray = [["datetime",inputDate], ["city", inputCity], ["state", inputState], ["country", inputCountry], ["shape", inputShape]];
    var searchArray = inputArray.filter(inputItem => inputItem[1] !== "");
    var filterCondition = searchArray.map(searchItem => "ufoSighting." + searchItem[0] + "===" + "'" + searchItem[1] + "'").join("&&")
  
    // Filter the data by input conditions
    var filteredData = tableData.filter(ufoSighting => eval(filterCondition));
    console.log(filteredData);
    
    // Reset the previous filtered data
    tbody.html("");
    
    // Display filtered data
    filteredData.forEach((ufoSighting) => {
        var row = tbody.append("tr");
        Object.entries(ufoSighting).forEach(([key, value]) => {
            var cell = row.append("td");
            cell.text(value);
        });
    });
    // If no value entered in any area, autopopulate the entire data table
    if (searchArray.length === 0) {
        defaultPopulate(tableData);
    } else if (filteredData.length === 0) {
        // If no data found, display "No UFO Sighting found. Try again!"
        tbody.append("tr").text("No UFO Sighting found. Try again!");
    };
};

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  };