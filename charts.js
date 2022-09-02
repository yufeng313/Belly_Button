function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleEle => sampleEle.id == sample);
    // 5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samplesResult.otu_ids;
    var otuLabels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(id => 'OTU ' + id).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      annotations: [{
        x: 0.5,
        xref: 'paper',
        y: -0.25,
        yref: 'paper',
        text: 'The bar chart displays the top 10 bacterial species (OTUs)<br>with the number of samples found in the belly button',
        showarrow: false
      }]
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker:{
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      //margin: {l: 50, r: 50, t: 50, b: 50},
      hovermode: "closest",
      annotations: [{
        x: 0.5,
        xref: 'paper',
        y: -0.27,
        yref: 'paper',
        text: 'The bubble chart displays the bacterial type and values in the belly button of each volunteers',
        showarrow: false
      }]
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // Guage chart
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(sampleEle => sampleEle.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataArray[0];
    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(metadataResult.wfreq);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,1], y: [0,1]},
      value: washFreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "green"}
        ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      annotations: [{
        x: 0.5,
        xref: 'paper',
        y: 0,
        yref: 'paper',
        text: 'The gauge chart displays the belly button<br> weekly washing frequency',
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
