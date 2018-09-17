import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, height])

const colorScale = d3
  .scaleOrdinal()
  .range(['#762a83','#af8dc3','#e7d4e8','#d9f0d3','#7fbf7b','#1b7837'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  // Adding my events here.
  d3.select('#asia').on('click', function() {
    svg.selectAll('rect').attr('fill', 'lightgrey')
    svg.selectAll('.asia').attr('fill','red')
  })

  d3.select('#africa').on('click', function() {
    svg.selectAll('rect').attr('fill', 'lightgray')
    svg.selectAll('.africa').attr('fill','red')
  })
  //Had to do the stupid method because of the string for the American continents.
  d3.select('#north-america').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return 'red'
      } else {
        return 'lightgray'
      }
    })
  })

  d3.select('#low-gdp').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 1000) {
        return 'red'
      } else {
        return 'lightgray'
      }
    })
  })

  d3.select('#color-by-continent').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', 'blue')
  })

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('y', 0)
    .attr("width", 10)
    .attr("height", d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', 'blue')
    .attr('class', d => {
      return d.continent.toLowerCase()
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
