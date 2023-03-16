// Set the URL for the JSON data source
var url = "static/bionet2.json";

// Use D3 to fetch the JSON data and log it to the console
d3.json(url).then(function(data) {
    console.log(data);
});

// Define function to initialize the dropdown menu
function init() {
  // Select the dropdown menu element
  var selector = d3.select("#selDataset");

  // Use D3 to get the list of sample names
  d3.json(url).then((data) => {
    var sampleNames = Array.from(new Set(data.value.map(d => d.vernacularName))); // Only unique values in vernacularName
    // Loop through the sample names and append an options
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

// Define function to update charts and metadata
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Define function to build metadata panel 
function buildMetadata(sample) {
  // Use D3 to get the metadata for all samples
  d3.json(url).then((data) => {
    var metadata = data.value;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.vernacularName == sample);
    var result = resultArray[0];
  
    // Select the metadata panel element
    var PANEL = d3.select("#sample-metadata");

    // Clear the previous contents of the metadata panel
    PANEL.html("");

    // Loop through each key-value pair in the result object and append the metadata panel
    Object.entries(result).forEach(([key, value]) => {
      if (key !== "class" && key !== "basisOfRecord" && key !== "sex" && key !== "vernacularName") {
        PANEL.append("h6").text(`${key}: ${value}`);
      }
    });
  });
}


