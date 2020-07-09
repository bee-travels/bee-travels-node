import React, { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import globalHistory from "globalHistory";
import Graph from "react-graph-vis";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";

import reducer from 'redux/reducer';
import init from 'redux/init';

import BookingLayout from "components/BookingLayout/BookingLayout";
import HomeLayout from "components/HomeLayout/HomeLayout";
import ErrorLayout from "components/ErrorLayout/ErrorLayout";

function runThroughNodes(parent, nodes, edges, level) {
  parent.children.forEach((child) => {
    if (child.service === undefined) {
      return;
    }

    if (nodes.filter((n) => n.id === child.service).length === 0) {
      nodes.push({
        id: child.service,
        label: child.service,
        title: child.service,
        level: level + 1,
      });
    }

    edges.push({ from: parent.service, to: child.service });
    runThroughNodes(child, nodes, edges, level + 1);
  });
}

function generateGraph(json) {
  let nodes = [];
  let edges = [];
  nodes.push({
    id: json.service,
    label: json.service,
    title: json.service,
    level: 0,
  });

  runThroughNodes(json, nodes, edges, 0);

  let nodesOnLevel = ["IBM Developer is a piece of shit"];
  for (let i = 0; nodesOnLevel.length > 0; i++) {
    nodesOnLevel = nodes.filter((n) => n.level === i);
    nodesOnLevel.forEach((n) => {
      const foundEdges = edges.filter((e) => e.from === n.id);

      const nodesToBump = foundEdges.map((e) => e.to);

      nodesToBump.forEach((nodeId) => {
        const nodeI = nodes.findIndex((n) => n.id === nodeId);
        if (n.level === nodes[nodeI].level) {
          console.log("bumping", nodeId);
          console.log("because of", n.id);
          nodes[nodeI].level = nodes[nodeI].level + 1;
        }
      });
    });
  }

  return { nodes, edges };
}

function GraphPage() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  useEffect(() => {
    fetch("/info")
      .then((r) => r.json())
      .then((json) => {
        const graph = generateGraph(json);
        console.log(graph);
        // const graph = {
        //   nodes: [
        //     { id: 1, label: "Node 1", title: "node 1 tootip text" },
        //     { id: 2, label: "Node 2", title: "node 2 tootip text" },
        //     { id: 3, label: "Node 3", title: "node 3 tootip text" },
        //     { id: 4, label: "Node 4", title: "node 4 tootip text" },
        //     { id: 5, label: "Node 5", title: "node 5 tootip text" },
        //   ],
        //   edges: [
        //     { from: 1, to: 2 },
        //     { from: 1, to: 3 },
        //     { from: 2, to: 4 },
        //     { from: 2, to: 5 },
        //   ],
        // };
        setGraph(graph);
      });
  }, []);

  const options = {
    // autoResize: null,
    // manipulation: false,
    edges: {
      smooth: true,
      color: null,
      width: 2,
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
        },
      },
    },
    layout: {
      hierarchical: {
        enabled: true,
        levelSeparation: 300,
      },
    },
    physics: {
      hierarchicalRepulsion: {
        nodeDistance: 300,
      },
      solver: "hierarchicalRepulsion",
    },
    nodes: {
      shape: "dot",
      color: "#7BE141",
      borderWidth: 4,
      size: 20,
      // color: {
      //   border: "#222222",
      //   background: "#666666",
      // },
      // font: { color: "#eeeeee" },
    },
  };

  return (
    <Graph
      graph={graph}
      options={options}
      style={{ position: "absolute", height: "100%", width: "100%" }}
    />
  );
}

const CustomRouter = () => {
  const store = createStore(
    reducer,
    init(),
    composeWithDevTools({ name: "bee-travels" })()
  );
  return (
    <Provider store={store}>
      <Router history={globalHistory}>
        <Switch>
          <Route exact path="/" component={HomeLayout} />
          <Route
            path="/destinations/:country/:city"
            component={BookingLayout}
          />
          <Route path="/super-secret" component={GraphPage} />
          <Route component={ErrorLayout} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default CustomRouter;
