// get the data
url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

d3.json(url, (error, json) => {

    console.log(json)
    const baseTemp = json.baseTemperature
    console.log(baseTemp)

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
})

