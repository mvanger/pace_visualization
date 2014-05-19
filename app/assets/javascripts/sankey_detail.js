var margin = {top: 1, right: 1, bottom: 6, left: 1};
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

$('.sankey-container').hide();
$('#hide-sankey-btn').hide();

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " Passengers"; },
    color = d3.scale.category20();

function plotSankey(inputContainer, routeNumber) {

  var svg = d3.select(inputContainer).append("svg")
      .attr("width", width)// + margin.left + margin.right)
      .attr("height", height - 50)// + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height - 100]);

  var sankey_path = sankey.link();

  // This is my code

  // This looks for a json file
  // Presumably the parameter energy is the json from that file
  // I guess the first parameter is error, the second is the data
  // d3.json("energy.json", function(energy) {

  var input_route = routeNumber;
  d3.json("newest_sankey.json", function(error, json) {

    // Looks for the json nodes and links
    sankey
        // .nodes(energy.nodes)
        // .links(energy.links)
        .nodes(json[input_route].nodes)
        .links(json[input_route].links)
        .layout(32);

    // Adds links
    var link = svg.append("g").selectAll(".link")
        // .data(energy.links)
        .data(json[input_route].links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", sankey_path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
        .text(function(d) { return d.source.name + " -> " + d.target.name + "\n" + format(d.value); });

    // And nodes
    var node = svg.append("g").selectAll(".node")
        // .data(energy.nodes)
        .data(json[input_route].nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      // .call(d3.behavior.mouseover()
        // .on("mouseover", function() {link.attr("fill", "black");}))
        // .on("mouseover", function() {link.attr("fill","black")})
      .call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", function() { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

    // Appends the nodes as rectangles
    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
      .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    // Appends the nodes' text
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
      .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // A drag function to drag the nodes
    function dragmove(d) {
      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      link.attr("d", sankey_path);
    }
  });
}

plotSankey("#sankey-208", "Pace 208");
plotSankey("#sankey-215", "Pace 215");
plotSankey("#sankey-223", "Pace 223");
plotSankey("#sankey-250", "Pace 250");
plotSankey("#sankey-270", "Pace 270");
plotSankey("#sankey-290", "Pace 290");
plotSankey("#sankey-301", "Pace 301");
plotSankey("#sankey-307", "Pace 307");
plotSankey("#sankey-311", "Pace 311");
plotSankey("#sankey-318", "Pace 318");
plotSankey("#sankey-322", "Pace 322");
plotSankey("#sankey-349", "Pace 349");
plotSankey("#sankey-352", "Pace 352");
plotSankey("#sankey-353", "Pace 353");
plotSankey("#sankey-359", "Pace 359");
plotSankey("#sankey-364", "Pace 364");
plotSankey("#sankey-379", "Pace 379");
plotSankey("#sankey-381", "Pace 381");
plotSankey("#sankey-606", "Pace 606");

// $('.group').click(function(){
//   alert('test');
// });



$('#some-crap').click(function(){
  plotSankey("#sankey-rosemont", "Pace 208");
  $('.svg-container').hide();
  $('#sankey-rosemont').show();
  $('#hide-sankey-btn').show();
  $('#some-crap').hide();
  $('#sankey-btn').hide();
});


$('#sankey-btn').click(function(){
  $('.sankey-container').show();
  $('.svg-container').hide();
  $('#hide-sankey-btn').show();
  $('#sankey-btn').hide();
});

$('#hide-sankey-btn').click(function(){
  $('.sankey-container').hide();
  $('.svg-container').show();
  $('#hide-sankey-btn').hide();
  $('#sankey-btn').show();
  $('#some-crap').show();
});

$('.group').css("cursor", function(){
        if (this.id > 7) {
          return "pointer";
        }
      });

