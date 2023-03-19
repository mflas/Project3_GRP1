$(document).ready(function() {
    // Use ajax function from jQuery library to retrieve data as JSON from server endpoint /api/bionet 
    $.ajax({
        url: '/api/bionet',
        dataType: 'json',
        // Specify a callback function for the successful retrieval of the data and
        // Use d3 to select the dropdown element with the id 'selDataset'
        success: function(data) {
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

            // Event listener for when a new animal is selected from the dropdown
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
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log('Error retrieving data from server: ' + textStatus);
                    }
                });
            }

            // Build the plot after the document has loaded and the necessary elements have been created
            buildPlot();

            // Event listener for when a new animal is selected from the dropdown
            dropdown.on("change", function() {
                // Get the value of the selected dropdown option
                var selectedAnimal = d3.select(this).property("value");
                // Call the optionChanged function with the selected animal's vernacular name
                optionChanged(selectedAnimal);
            });
        },
        // Specify a callback function to handle any errors during the data retrieval process
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error retrieving data from server: ' + textStatus);
        }
    });
});
