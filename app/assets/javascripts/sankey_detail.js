var margin = {top: 1, right: 1, bottom: 6, left: 1}
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

$('.sankey-container').hide();
$('#hide-sankey-btn').hide();

var formatNumber = d3.format(",.0f"),
    format = function(d) { return formatNumber(d) + " Passengers"; },
    color = d3.scale.category20();

var svg = d3.select(".sankey-container").append("svg")
    .attr("width", width)// + margin.left + margin.right)
    .attr("height", height)// + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

var sankey_path = sankey.link();

// This is my code

// This looks for a json file
// Presumably the parameter energy is the json from that file
// I guess the first parameter is error, the second is the data
// d3.json("energy.json", function(energy) {
d3.json("new_rosemont.json", function(error, json) {

  console.log(error);
  console.log(json);
  // Looks for the json nodes and links
  sankey
      // .nodes(energy.nodes)
      // .links(energy.links)
      .nodes(json.nodes)
      .links(json.links)
      .layout(32);

  // Adds links
  var link = svg.append("g").selectAll(".link")
      // .data(energy.links)
      .data(json.links)
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
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
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
});