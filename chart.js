// get the data
url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

d3.json(url, (error, json) => {
    // save the base temperature
    const baseTemp = json.baseTemperature
    console.log(json)
    const months = ['January', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov']

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
    const yearData = json['monthlyVariance'].map(x => x.year)
    const minYear = d3.min(yearData)
    const maxYear = d3.max(yearData)

    // get the temperature variance data
    const varianceData = json['monthlyVariance'].map(x => x.variance)
    const minVar = d3.min(varianceData)
    const maxVar = d3.max(varianceData)
    console.log(varianceData)
    // create function to colour the rectangles based on variance
    const getColour = function (variance) {
        const binSize = (maxVar - minVar) / 6
        if (variance > (minVar + binSize * 5))
            return '#D85A86';
        else if (variance > (minVar + binSize * 4.5))
            return '#E48BAA';
        else if (variance > (minVar + binSize * 4))
            return '#ECACC3';
        else if (variance > (minVar + binSize * 3.5))
            return '#C5D7E8';
        else if (variance > (minVar + binSize * 3))
            return '#8AAFD0';
        else if (variance >= (minVar))
            return '#467EAF';
    }

    // create the x scale
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([plr, w - plr])

    // create the y scale
    const yScale = d3.scaleLinear()
        .domain([11, 0])
        .range([h - pbtm, ptop])

    console.log(yScale(8))

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
        .attr('y', (d) => yScale(d.month - 2))
        .attr('height', (h - ptop - pbtm) / 11)
        .attr('width', (w - plr * 2) / (yearData.length / 12))
        .attr('fill', (d) => getColour(d.variance))
        .on('mouseover', (d) => {
            tooltip
                .style('opacity', 1)
                .html(`<p>Year: ${d.year}</p><p>Temperature: ${d.variance + baseTemp}`)
        });

    // add the x axis
    const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('.4r'))

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${h - pbtm})`)
        .call(xAxis)

    // add the y axis
    const yAxis = d3.axisLeft()
        .scale(yScale)

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${plr}, 0)`)
        .call(yAxis)

})

