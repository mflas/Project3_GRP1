$(document).ready(function() {

    // Use ajax function from jQuery library to retrieve data as JSON from server endpoint /api/bionet 
    $.ajax({
        url: '/api/bionet',
        dataType: 'json',
        success: function(data) {

            // Use d3 to select the dropdown element with the id 'selDataset'
            var dropdown = d3.select("#selDataset");

            // Extract unique vernacular names from the data and sort the vernacular names alphabetically
            var vernacularNames = [...new Set(data.map(record => record.vernacularName))];
            vernacularNames.sort();

            // Iterate over each vernacular name and append an option element to the dropdown
            vernacularNames.forEach(function(name) {
                dropdown.append("option").text(name).property("value", name);
            });

            // Function to display the total number of sightings of the selected animal
            function displayTotalSightings(animalName, data) {
                // Filter the data to get records only for the selected animal
                var selectedAnimalData = data.filter(function(record) {
                    return record.vernacularName === animalName;
                });
                // Get the count of the filtered records
                var totalSightings = selectedAnimalData.length;
                // Display the count in the element with id 'totalSightings'
                if (animalName) {
                    d3.select("#totalSightings").html("Total number of sightings: <b>" + totalSightings + "</b>");
                }
            }

             // Function to display bar-chart of the total number of sightings of the selected animal per county
            function buildPlot(animalName, data) {
                // Filter the data to get records only for the selected animal
                var selectedAnimalData = data.filter(function(record) {
                return record.vernacularName === animalName;
                });
            
                // Group the filtered data by county and count the number of records for each county
                var countyCounts = {};
                selectedAnimalData.forEach(function(record) {
                var county = record.county;
                if (countyCounts[county]) {
                    countyCounts[county]++;
                    } else {
                    countyCounts[county] = 1;
                    }
                });
            
            // Convert the county counts object to an array of objects with keys 'county' and 'count'
            var countyCountsArray = [];
            for (var county in countyCounts) {
                countyCountsArray.push({
                    county: county,
                    count: countyCounts[county]
                });
            }
            
            // Sort the county counts array by count in descending order
            countyCountsArray.sort(function(a, b) {
                return b.count - a.count;
            });
            
            // Extract the county names and counts from the sorted county counts array
            var countyNames = countyCountsArray.map(function(obj) {
                return obj.county;
            });
            var countyCountsData = countyCountsArray.map(function(obj) {
                return obj.count;
            });
            
            // Create the plotly bar chart
            var plotData = [{
                y: countyCountsData,
                x: countyNames,
                type: 'bar',
                marker: {
                    color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
                        '#bcbd22', '#17becf', '#393b79', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', 
                        '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b',
                        '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6', '#3182bd', '#6baed6', '#9ecae1',
                        '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b',
                        '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd',
                        '#d9d9d9', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c',
                        '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b', '#e7969c', 
                        '#7b4173', '#a55194', '#ce6dbd', '#de9ed6', '#3182bd', '#6baed6', '#9ecae1', '#c6dbef',
                        '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2']
                },
                orientation: 'v'
            }];

            var plotLayout = {
                title: '<b>Total number of sightings per county</b>',
                yaxis: {
                    title: 'Number of sightings'
                },
                xaxis: {
                    title: 'County'
                },
                margin: {
                    t: 30, 
                    b: 250
                }
            };
            Plotly.newPlot('myChart', plotData, plotLayout);
            }

            // Function to display gauge-chart of the stateConservation level of the selected animal.            
            function buildGauge(animalName, data) {
                var selectedAnimalData = data.filter(function(record) {
                return record.vernacularName === animalName;
                });
                var stateConservation = selectedAnimalData[0].stateConservation;
                var stateConservationLevels = ["Endangered Population", "Endangered", "Vulnerable", "Critically Endangered", "Extinct",""];
                var stateConservationColors = ["rgba(100, 170, 100, 1)", "rgba(255, 217, 0, 1)", "rgba(255, 140, 0, 1)", "rgba(255, 0, 0, 1)", "rgba(128, 0, 0, 1)"];
                var stateConservationIndex = stateConservationLevels.indexOf(stateConservation);
                var selectedAnimalConservation = selectedAnimalData[0].stateConservation;
                if (stateConservationIndex !== -1) {
                var gaugeData = [{
                    type: "indicator",
                    mode: "gauge",
                    gauge: {
                    axis: {
                        range: [0, stateConservationLevels.length - 1],
                        tickvals: [0, 1, 2, 3, 4, 5, 6],
                        ticktext: ["<b>High Risk</b>", "<b>Endangered</b>", "<b>Vulnerable</b>", "<b>Critically Endangered</b>", "<b>Extinct</b>",""],
                        tickwidth: 3,
                        tickcolor: "red"
                    },
                    steps: stateConservationLevels.map((level, index) => ({
                        range: [index, index + 1],
                        color: (level === selectedAnimalConservation) ? `rgba(${stateConservationColors[index].slice(5, -1)}, 1)` : stateConservationColors[index],
                        opacity: (level === selectedAnimalConservation) ? 1 : 0.5
                    })),                    
                    threshold: {
                        line: {
                        color: "black",
                        width: 12
                        },
                        thickness: 0.75,
                        value: stateConservationIndex
                    }
                    }
                }];
                var gaugeLayout = {
                    width: 700,
                    height: 400,
                    margin: {
                    l: 60,
                    r: 0
                    },
                    title: {
                    text: "<b>State Conservation</b>"
                    }
            };
                Plotly.newPlot('myGauge', gaugeData, gaugeLayout);
                } else {
                document.getElementById('myGauge').innerHTML = '';
                }
            }

            function heapmap(animalName, data){
                try{
                    heatmapLayer.remove();
                    console.log('layer removed')
                }catch{
                    console.log('No map');
                }
                // if (typeof heat !== 'undefined') {
                //     // myMap.removeLayer(heat);
                //     console.log("HEAT IS HERE")
                //   }

                var selectedAnimalData = data.filter(function(record) {
                    return record.vernacularName === animalName;
                });
        
                let heatArray = [];
        
                selectedAnimalData.forEach(function(record) {                   
                    var latitude = record.decimalLatitude;
                    var longitude = record.decimalLongitude;
                    // console.log(latitude);
                    // console.log(longitude);
                    if (latitude) {
                        heatArray.push([latitude, longitude]);
                    }
                });

                heatmapLayer = L.heatLayer(heatArray, {
                    radius: 30,
                    blur: 10
                }).addTo(myMap);
            }
            // Event listener for when a new animal is selected from the dropdown
            dropdown.on("change", function() {
                // Get the value of the selected dropdown option
                var selectedAnimal = d3.select(this).property("value");
                // Call the optionChanged function with the selected animal's vernacular name
                optionChanged(selectedAnimal);
            });
            
            function optionChanged(animalName) {
                // Use ajax function from jQuery library to retrieve data as JSON from server endpoint /api/bionet 
                $.ajax({
                    url: '/api/bionet',
                    dataType: 'json',
                    success: function(data) {
                        // Call the displayTotalSightings function to display the total number of sightings of the selected animal
                        displayTotalSightings(animalName, data);
                        // Call the buildPlot function to build the plot for the selected animal
                        buildPlot(animalName, data);
                        // Call to the heatmap function
                        heapmap(animalName, data);
                        // Call the buildPlot function to build the plot for the selected animal
                        buildGauge(animalName, data);
                    },
                });
            }
        },
        // Specify a callback function to handle any errors during the data retrieval process
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error retrieving data from server: ' + textStatus);
        }
    });
});

let myMap = L.map("map-plot", {
    center: [-32.32, 147],
    zoom: 6
  });
  
  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
  
  const url = '/api/bionet'
  let heatmapLayer;