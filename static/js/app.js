// Functtion to display the graph and bubble chart
function graph_charts(data_val){
    // Uses the d3.json file to pull in the data
    d3.json("data/samples.json").then(function(data){
        // create a loop to go through the entire sample list
        for (var i = 0; i < data.samples.length; i++){
            // This line tries to store each index of the array
            if (data.samples[i].id == data_val){
                // store it as sample_data
                var sample_data = data.samples[i]
            }
        }

        // pulls data from sample 
        // sample_vals pull in the sample_values within the samples array
        var sample_vals = sample_data.sample_values;
        // otu_ids pull in the otu_ids within the samples array
        var otu_ids = sample_data.otu_ids;
        // otu_labels pull in tthe otu_labels within the samples array
        var otu_labels = sample_data.otu_labels;

        // slicing the data
        // gets the top 10 values and goes in descending order
        var xvals = sample_vals.slice(0,10).reverse()
        // gets the top 10 ids and goes in descending order and needs to be object to pull in the actual otu_ids
        var yvals = otu_ids.slice(0,10).reverse().map(object => `OTU ${object}`);
        // gets the labels for the top 10 otus in descending order
        var labels = otu_labels.slice(0, 10).reverse();
        
        // creates a bar chart
        var trace1 = [{
            x: xvals,
            y: yvals,
            text: labels,
            type: 'bar',
            orientation: 'h'
        }]

        var layout1 = {
            title: `Sample ${data_val}: Top 10 OTUs`
        }

        Plotly.newPlot('bar', trace1, layout1);

        // creates a bubble chart
        var trace2 = [{
            x: otu_ids,
            y: sample_vals,
            text: labels,
            mode: 'markers',
            marker: {
                size: sample_vals,
                color: otu_ids
            }
        }]

        var layout2 = {
            title: 'Bacteria & Corresponding Frequency',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Frequency'}
        }
        Plotly.newPlot('bubble', trace2, layout2);
    }

)}

// Build metadata panel to fill in the information
function graph_metadata(data_val){
    d3.json("data/samples.json").then(function(data){
        for (var i = 0; i < data.metadata.length; i++){
            if (data.metadata[i].id == data_val){
                var sample_data = data.metadata[i]
            }
        };
        
        // uses the d3 function to fill out the information
        var metadata = d3.select('#sample-metadata');
        // this erases the data after each refresh
        var tb = document.querySelector('#sample-metadata');
        while (tb.childNodes.length){
            tb.removeChild(tb.childNodes[0]);
        }

        // This is where the information is retrieved
        Object.entries(sample_data).forEach(([key, value]) =>{
            // starts adding the information and appends within tthe demographic info
            var rows = metadata.append('h5');
            // the exact information that is copied and pasted
            rows.text(`${key}: ${value}`)

            // gauge data on frequency
            if (key == 'wfreq'){
                wash_freq = value;
            }
        });



        // Make a gauge table
        var gauge_table = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wash_freq,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [0, 10],
                        dtick: 2 },
                bar: { color: "gray"},
                steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "orange" },
                  { range: [4, 6], color: "yellow" },
                  { range: [6, 8], color: "violet" },
                  { range: [8, 10], color: "green" }
                ],
              }
            }
        ];

        Plotly.newPlot('gauge', gauge_table, {responsive: true});
    });
}

// when clicking on a subject no. the dropdown populates with the ID info
function init() {

    var dropdown = d3.select('#selDataset');
    d3.json ("data/samples.json").then (function(data){
        data.names.forEach(function(name) {
            dropdown.append('option').text(name).property('value');
        });
    });
    // pulls the main data
    graph_charts('940');
    graph_metadata('940');
}

// updates the graph when changing the subject no.
function graphchange(x) {
    graph_charts (x);
    graph_metadata (x);
 
}


init()