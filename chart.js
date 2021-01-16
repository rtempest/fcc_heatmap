// get the data
url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

d3.json(url, (error, json) => {
    // save the base temperature
    const baseTemp = json.baseTemperature
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    console.log(months)
    // define dimensions and position
    const h = 400
    const w = 1300
    const pbtm = 80
    const ptop = 100
    const plr = 60

    // create svg
    const svg = d3.select('#chart')
        .append('svg')
        .attr('height', h)
        .attr('width', w)

    // create title
    svg.append('text')
        .attr('id', 'title')
        .style('font-size', '20px')
        .attr('x', w / 2)
        .attr('y', ptop / 1.6)
        .text('Land Surface Temperature')
        .attr('text-anchor', 'middle')

    // create description
    svg.append('text')
        .attr('id', 'description')
        .attr('x', w / 2)
        .attr('y', ptop / 1.2)
        .text('Global Monthly Average from 1753 to 2015')
        .attr('text-anchor', 'middle')

    // get the year data
    const yearData = json['monthlyVariance'].map(x => x.year)
    const minYear = d3.min(yearData)
    const maxYear = d3.max(yearData)

    // get the temperature variance data
    const varianceData = json['monthlyVariance'].map(x => x.variance)
    const minVar = d3.min(varianceData)
    const maxVar = d3.max(varianceData)

    // max and min temperature for the legend
    const minTemp = baseTemp + minVar
    const maxTemp = baseTemp + maxVar
    console.log((maxTemp - minTemp) / 2)

    // threshold scale for the temperature
    var threshold = d3.scaleThreshold()
        .domain([2, 4, 6, 8, 10, 12, 14])
        .range(["#D85A86", "#E48BAA", "#ECACC3", "#C5D7E8", "#8AAFD0", '#467EAF', "#345E83"].reverse())

    // create the x scale
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([plr, w - plr])

    // create the y scale
    monthNums = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    const yScale = d3.scaleBand()
        .domain(monthNums)
        .rangeRound([h - pbtm, ptop])
        .padding(0.1);

    // create the tooltip
    const tooltip = d3.select('#chart')
        .append('div')
        .attr('id', 'tooltip')

    // create the heat map boxes
    svg.selectAll('rect')
        .data(json.monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('data-year', (d) => d.year)
        .attr('data-month', (d) => d.month - 1)
        .attr('data-temp', (d) => d.variance + baseTemp)
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.month - 1))
        .attr('height', (h - ptop - pbtm) / 11)
        .attr('width', (w - plr * 2) / (yearData.length / 12))
        .attr('fill', (d) => threshold(d.variance + baseTemp))
        .on('mouseover', (d) => {
            tooltip
                .style('visibility', 'visible')
                .style('left', d3.event.pageX + 28 + "px")
                .style('top', `${d3.event.pageY}px`)
                .attr('data-year', d.year)
                .html(`<h2>${months[d.month - 1]} ${d.year}</h2><p>${(d.variance + baseTemp).toPrecision(3)}<span>&#x00B0<span>C`)
        })
        .on('mouseout', () => tooltip.style('visibility', 'hidden'));

    // add the x axis
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('.4r'))
        .ticks(20)

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${h - pbtm})`)
        .call(xAxis)

    // add the y axis
    const monthsReversed = [...months].reverse()

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickFormat((d, i) => monthsReversed[i])
        .tickSize(0);

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${plr}, 0)`)
        .call(yAxis)

    // create the legend axis
    const lw = 400
    const lh = 500

    const legendScale = d3.scaleLinear()
        .domain([minTemp, maxTemp])
        .range([0, lw])
        .nice()

    const legendAxis = d3.axisBottom()
        .scale(legendScale)
        .tickValues([2].concat(threshold.domain()))
        .ticks(10)
        .tickSize(0)
    // .style('z-index', 10)

    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', `translate(${plr}, ${h - pbtm / 4})`)
        .style('stroke-width', 0)
        .call(legendAxis)

    legend.selectAll('rect')
        .data(threshold.range().map(c => {
            const d = threshold.invertExtent(c);
            if (d[0] == null) d[0] = legendScale.domain()[0]
            if (d[1] == null) d[1] = legendScale.domain()[1]
            return d
        }))
        .enter()
        .append('rect')
        .attr('class', 'legend-rect')
        .attr('x', (d) => legendScale(d[0]))
        .attr('y', -20)
        .attr('height', 20)
        .attr('width', (d) => legendScale(d[1]) - legendScale(d[0]))
        .attr('fill', (d) => threshold(d[0]))


    // add degrees legend axis label
    svg.append('text')
        .attr('x', 465)
        .attr('y', h - pbtm / 3 + 3)
        .text('Temperature (°C)')
        .style('font-size', 12)
})

