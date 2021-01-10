// get the data
url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

d3.json(url, (error, json) => {
    // save the base temperature
    const baseTemp = json.baseTemperature

    // define dimensions and position
    const h = 600
    const w = 800
    const pX = 50
    const pY = 50

    // create svg
    const svg = d3.select('#chart')
        .append('svg')
        .attr('height', h)
        .attr('width', w)

    // create title
    svg.append('text')
        .attr('id', 'title')
        .attr('x', w / 2)
        .attr('y', pY)
        .text('Average Land Surface Temperature')
        .attr('text-anchor', 'middle')

    // create description
    svg.append('text')
        .attr('id', 'description')
        .attr('x', w / 2)
        .attr('y', pY + 30)
        .text('description bla bla bla')
        .attr('text-anchor', 'middle')

    // get the year data
    const yearData = json['monthlyVariance'].map(x => x.year)
    const minYear = d3.min(yearData)
    const maxYear = d3.max(yearData)

    // create the x scale
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, w])

    // create the y scale
    const yScale = d3.scaleLinear()
        .domain([0, 12])
        .range([h, 0])

    // create the heat map boxes


    // add the x axis
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('.4r'))

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${h - pX})`)
        .call(xAxis)

    // add the y axis
    const yAxis = d3.axisLeft().scale(yScale)

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(0, ${pY})`)
        .call(yAxis)
})

