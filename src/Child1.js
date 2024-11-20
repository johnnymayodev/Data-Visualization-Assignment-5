import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  state = {
    company: "Apple",
    selectedMonth: "November",
  };

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.csv_data !== this.props.csv_data || prevState.company !== this.state.company || prevState.selectedMonth !== this.state.selectedMonth) {
      this.drawChart();
    }
  }

  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  drawChart() {
    const { csv_data } = this.props;
    const { company, selectedMonth } = this.state;

    // Filter data by selected company and month
    const filteredData = csv_data.filter((d) => d.Company === company && d.Date.getMonth() === new Date(`${selectedMonth} 1, ${d.Date.getFullYear()}`).getMonth());

    // Define SVG canvas dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select("#chart").selectAll("*").remove();

    // Create SVG container
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip setup
    const tooltip = d3
      .select("#chart")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("display", "none");

    // Set up scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.Date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(filteredData, (d) => Math.min(d.Open, d.Close)), d3.max(filteredData, (d) => Math.max(d.Open, d.Close))])
      .range([height, 0]);

    // Define line generators with smooth curves
    const lineOpen = d3
      .line()
      .x((d) => x(d.Date))
      .y((d) => y(d.Open))
      .curve(d3.curveMonotoneX);

    const lineClose = d3
      .line()
      .x((d) => x(d.Date))
      .y((d) => y(d.Close))
      .curve(d3.curveMonotoneX);

    // Append the "Open" price line
    svg.append("path").datum(filteredData).attr("fill", "none").attr("stroke", "#b2df8a").attr("stroke-width", 2).attr("d", lineOpen);

    // Append circles for the "Open" price data points
    svg
      .selectAll(".open-circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "open-circle")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Open))
      .attr("r", 5)
      .attr("fill", "#b2df8a")
      .on("mouseover", (event, d) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .style("display", "inline-block")
          .html(
            `<strong>Date:</strong> ${d.Date.toLocaleDateString()}<br>` +
              `<strong>Open:</strong> $${d.Open.toFixed(2)}<br>` +
              `<strong>Close:</strong> $${d.Close.toFixed(2)}<br>` +
              `<strong>Difference:</strong> $${(d.Close - d.Open).toFixed(2)}`
          );
      })
      .on("mouseout", () => tooltip.style("display", "none"));

    // Append the "Close" price line
    svg.append("path").datum(filteredData).attr("fill", "none").attr("stroke", "#e41a1c").attr("stroke-width", 2).attr("d", lineClose);

    // Append circles for the "Close" price data points
    svg
      .selectAll(".close-circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "close-circle")
      .attr("cx", (d) => x(d.Date))
      .attr("cy", (d) => y(d.Close))
      .attr("r", 5)
      .attr("fill", "#e41a1c")
      .on("mouseover", (event, d) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .style("display", "inline-block")
          .html(
            `<strong>Date:</strong> ${d.Date.toLocaleDateString()}<br>` +
              `<strong>Open:</strong> $${d.Open.toFixed(2)}<br>` +
              `<strong>Close:</strong> $${d.Close.toFixed(2)}<br>` +
              `<strong>Difference:</strong> $${(d.Close - d.Open).toFixed(2)}`
          );
      })
      .on("mouseout", () => tooltip.style("display", "none"));

    // Add axes
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));
  }

  render() {
    const companies = ["Apple", "Microsoft", "Amazon", "Google", "Meta"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="child1">
        <div className="selectors">
          <h3>Select Company</h3>
          <div className="company-selectors">
            {companies.map((company) => (
              <label key={company}>
                <input type="radio" name="company" value={company} checked={this.state.company === company} onChange={this.handleCompanyChange} />
                {company}
              </label>
            ))}
          </div>

          <div className="month-selectors">
            <h3>Select Month</h3>
            <select value={this.state.selectedMonth} onChange={this.handleMonthChange}>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div id="chart" />
      </div>
    );
  }
}

export default Child1;
