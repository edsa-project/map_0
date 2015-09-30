(function () {
    "use strict";
 
    var width = 960,
        height = 480;
 
    var projection = d3.geo.mercator();
 
    var path = d3.geo.path().projection(projection);
 
    var eu = [
            40, // Austria
            56, // Belgium
            100, // Bulgaria
            191, // Croatia
            196, // Cyprus
            203, // Czech Republic
            208, // Denmark
            233, // Estonia
            246, // Finland
            250, // France
            276, // Germany
            300, // Greece
            348, // Hungary
            372, // Ireland
            380, // Italy
            428, // Latvia
            440, // Lithuania
            442, // Luxembourg
            470, // Malta
            528, // Netherlands
            616, // Poland
            620, // Portugal
            642, // Romania
            703, // Slovakia
            705, // Slovenia
            724, // Spain
            752, // Sweden
            826 // United Kingdom
            ];
 
    function isEuCountry(datum) {
        var code = parseInt(datum.properties.iso_n3, 10);
        return eu.indexOf(code) > -1;
    }
     
    queue()
        .defer(d3.json, "eu.json")
        .defer(d3.json, "data.json")
        .await(ready);
 
    function ready(error, europe, data) {
        if (error) return console.error(error);
    
        var quantize = d3.scale.quantile()
                 .domain(d3.extent(d3.values(data), function (d) { return d.value; }))
                 .range(d3.range(6)),
            cb = "Reds";
         
        function fill(datum, index) {
              var iso = datum.properties.iso_n3,
                   val = data[iso] && data[iso].value;
              if (val) {
                  var c = colorbrewer[cb][6][quantize(val)];
                  return c;
              } else {
                  return "lightgray";
              }
        }
         
         
        var svg = d3.select("#container").append("svg")
            .attr("width", width)
            .attr("height", height);
 
        var eu = topojson.feature(europe, europe.objects.europe),
            countries = eu.features;
         
        projection.scale(1).translate([0, 0])
 
        var b = path.bounds(eu),
            s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
 
        projection.scale(s).translate(t);
 
        svg.selectAll("path")
            .data(countries)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "country")
            .classed("eu-country", isEuCountry);
         
        svg.selectAll(".eu-country")
            .style("fill", fill);
    }
 
})();
