import React, { Component } from "react";
import { dia, shapes } from "jointjs";
import { GraphProvider, Paper } from "./jointInternal/index";

class JointJSCanvas extends Component {
  constructor(props) {
    super(props);
    this.graph = new dia.Graph({}, { cellNamespace: shapes });
  }

  componentDidMount() {}

  addShape(shape) {
    this.graph.addCell(shape);
  }

  render() {
    return (
      <GraphProvider graph={this.graph}>
        <Paper />
      </GraphProvider>
    );
  }
}

export default JointJSCanvas;
