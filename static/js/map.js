function buildPlot() {
    Plotly.d3.json('/api/bionet', function(response) {
        console.log(response);
        
        var layout = {
            title: 'Map Title',
            autosize: true,
            width: 1000,
            height: 600,
            hovermode: 'closest',
            showlegend: false,
            geo: {
                scope: 'usa',
                projection: {type: 'albers usa'},
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                subunitwidth: 1,
                countrywidth: 1,
                subunitcolor: 'rgb(255,255,255)',
                countrycolor: 'rgb(255,255,255)'
            },
            responsive: true
        };
        
        var data = [{
            type: 'scattergeo',
            mode: 'markers',
            locations: [],
            hoverinfo: 'text',
            marker: {
                size: 8,
                line: {
                    color: 'rgb(8,8,8)',
                    width: 0.5
                },
                opacity: 0.8
            }
        }];

        Plotly.plot('plot', data, layout);
    });
}

buildPlot();
