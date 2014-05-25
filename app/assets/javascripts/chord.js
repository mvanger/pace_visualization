var width = 620,
    height = 620,
    outerRadius = Math.min(width, height) / 2 - 10,
    innerRadius = outerRadius - 24;

var formatPercent = d3.format(".1%");

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var layout = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);

var path = d3.svg.chord()
    .radius(innerRadius);

var svg_one = d3.select(".svg-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chord-one-container")
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg_one.append("circle")
    .attr("r", outerRadius);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    return d.value;
  })
  .direction('n')
  .offset([-10, 0]);

// var mouseCoords = d3.mouse(
//         SVGtooltip[0][0].parentElement);

// var chord_tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .html(function(d) {
//     return d.value;
//   })
//   .direction('n')
  // .offset(function(d) {
  //   return [0,0];
  // });

// $('.d3-chord-tip').style("top", d3.event.pageY + "px");

function drawChord(inputJSON, chord_number) {
  // d3.csv("routes.csv", function(routes) {
    // d3.json(inputJSON, function(matrix) {

      chord_number.call(tip);
      // chord_number.call(chord_tip);

      var thousands = d3.format(',');

      tip.html(function(d, i) {
        return routes[i].name + ": " + thousands(Math.round(d.value)) + " passengers";
      });

      // chord_tip.html(function(d, i) {
      //   return routes[d.source.index].name
      //       + " → " + routes[d.target.index].name
      //       + ": " + thousands(d.source.value)
      //       + "</br>" + routes[d.target.index].name
      //       + " → " + routes[d.source.index].name
      //       + ": " + thousands(d.target.value);
      // })
      // .style('top', '1000px')
      // .offset(function(d) {
      //   return [0, 0];
      // });

      // Compute the chord layout.
      layout.matrix(inputJSON);

      // Add a group per neighborhood.
      var group = chord_number.selectAll(".group")
          .data(layout.groups)
        .enter().append("g")
          .attr("class", "group")
          .attr("id", function(d,i) {
            if (routes[i].name == 7) {
              return "rt7";
            } else {
              return routes[i].name.substring(0,3);
            }
          })
          .on("mouseover", mouseover)
          .on("mouseenter", tip.show)
          .on("mouseout", tip.hide);

      // Add a mouseover title.
      // group.append("title").text(function(d, i) {
      //   return routes[i].name + ": " + Math.round(d.value) + " passengers";
      // });

      // Add the group arc.
      var groupPath = group.append("path")
          .attr("id", function(d, i) { return "group" + i; })
          .attr("d", arc)
          .style("fill", function(d, i) { return routes[i].color; });

      // Add a text label.
      var groupText = group.append("text")
          .attr("x", 6)
          .attr("dy", 15);

      groupText.append("textPath")
          .attr("xlink:href", function(d, i) { return "#group" + i; })
          .text(function(d, i) { return routes[i].name; });

      // Remove the labels that don't fit. :(
      groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
          .remove();

      // Add the chords.
      var chord = chord_number.selectAll(".chord")
          .data(layout.chords)
        .enter().append("path")
          .attr("class", "chord")
          .style("fill", function(d) { return routes[d.source.index].color; })
          // .style("stroke", "#D8D8D8")
          // .style("stroke-width", "1px")
          .attr("d", path)
          // .on("mouseover", chord_tip.show)

      // Add an elaborate mouseover title for each chord.
      chord.append("title").text(function(d) {
        return routes[d.source.index].name
            + " → " + routes[d.target.index].name
            + ": " + thousands(d.source.value)
            + "\n" + routes[d.target.index].name
            + " → " + routes[d.source.index].name
            + ": " + thousands(d.target.value);
      });

      function mouseover(d, i) {
        chord.classed("fade", function(p) {
          return p.source.index != i
              && p.target.index != i;
        });
      }

      $('.group').click(function(){
        // alert(this.id);
        if (this.id > 7) {
          $('.svg-container').hide();
          // $('.sankey-container').show();
          $('#sankey-' + this.id).show();
          $('.cta-buttons').hide();
          $('#hide-sankey-btn').show();
          $('#sankey-btn').hide();
          $('#some-crap').hide();
          $('.chord-description').hide();
          $('#route-' + this.id).show();
        }


      });

    // });
  // });
}

$( '#button3' ).css('display', 'none');
$( '.chord-two-container').css('display', 'none');
drawChord(chord_three, svg_one);

$( '#button4' ).click(function(){
  var svg_two = d3.select(".svg-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chord-two-container")
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg_two.append("circle")
    .attr("r", outerRadius);

  $('#button3').css('display', 'true');
  $('#button4').css('display', 'none');
  $('.chord-one-container').fadeOut(
    200,
    function(){
      this.remove();
    }
  );

  setTimeout(function(){
    drawChord(chord_four, svg_two);
    $('.chord-two-container').css('display', 'none');
    $('.chord-two-container').fadeIn(200);
  },
  200);
});

$('#button3').click(function(){
  var svg_one = d3.select(".svg-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chord-one-container")
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg_one.append("circle")
    .attr("r", outerRadius);

  $('#button4').css('display', 'true');
  $('#button3').css('display', 'none');
  $('.chord-two-container').fadeOut(
    200,
    function(){
      this.remove();
    }
  );

  setTimeout(function(){
    drawChord(chord_three, svg_one);
    $('.chord-one-container').css('display', 'none');
    $('.chord-one-container').fadeIn(200);
  },
  200);
});

$( "#button" ).click(function() {
  $('#circle').fadeOut(700);
});

$( "#button2" ).click(function() {
  $('#circle').fadeIn(700);
});

$('#7').first().css("color", "red");

// #CTA Bus {
//   cursor: default;
// }

