// get the data
url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

d3.json(url, (error, json) => {
    // save the base temperature
    const baseTemp = json.baseTemperature
    console.log(json)
    const months = ['January', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov']

    // map the json year data
    const yearData = json['monthlyVariance'].map(x => x.year)

    // define dimensions and position
    const h = 400
    const w = 1200
    const pbtm = 50
    const ptop = 100
    const plr = 50

    // create svg
    const svg = d3.select('#chart')
        .append('svg')
        .attr('height', h)
        .attr('width', w)

    // create title
    svg.append('text')
        .attr('id', 'title')
        .attr('x', w / 2)
        .attr('y', ptop / 3)
        .text('Average Land Surface Temperature')
        .attr('text-anchor', 'middle')

    // create description
    svg.append('text')
        .attr('id', 'description')
        .attr('x', w / 2)
        .attr('y', ptop / 2)
        .text('description bla bla bla')
        .attr('text-anchor', 'middle')

    // get the year data
    const minYear = d3.min(yearData)
    const maxYear = d3.max(yearData)

    // create the x scale
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([plr, w - plr])

    // create the y scale
    const yScale = d3.scaleLinear()
        .domain([0, 12])
        .range([h - pbtm, ptop])
    console.log(yScale(1))


    // create the heat map boxes
    svg.selectAll('rect')
        .attr('id', 'box')
        .data(json.monthlyVariance)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.year))
        .attr('y', (d) => yScale(d.month))
        .attr('height', (h - ptop - pbtm) / 12)
        .attr('width', (w - plr * 2) / (yearData.length / 12))

    // add the x axis
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('.4r'))

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${h - pbtm})`)
        .call(xAxis)

    // add the y axis
    const yAxis = d3.axisLeft().scale(yScale)

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${plr}, 0)`)
        .call(yAxis)
})

