import React, { useEffect, useState } from "react";
import Graph from "react-graph-vis";

function runThroughNodes(parent, nodes, edges, level) {
  parent.children.forEach((child) => {
    if (child.service === undefined) {
      return;
    }

    if (nodes.filter((n) => n.id === child.service).length === 0) {
      nodes.push({
        id: child.service,
        label: `${child.service}\n\n${child.hostname}\n${child.language}`,
        title: child.service,
        level: level + 1,
        widthConstraint: {
          minimum: 150,
          maximum: 250,
        },
        font: {
          multi: "html",
          size: 20,
        },
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
    label: `<b>${json.service}</b>\n${json.hostname}`,
    title: json.service,
    level: 0,
    heightConstraint: {
      minimum: 100,
    },
    font: {
      multi: "html",
      size: 20,
    },
    shape: "box",
  });

  runThroughNodes(json, nodes, edges, 0);

  let nodesOnLevel = ["max is a piece of sunshine"];
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

export function GraphPage() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  useEffect(() => {
    fetch("/info")
      .then((r) => r.json())
      .then((json) => {
        console.log("JSON:", json);
        const graph = generateGraph(json);
        console.log("GRAPH:", graph);
        setGraph(graph);
      });
  }, []);

  const options = {
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
        nodeSpacing: 344,
      },
    },
    physics: {
      hierarchicalRepulsion: {
        nodeDistance: 350,
      },
      solver: "hierarchicalRepulsion",
    },
    nodes: {
      shape: "box",
      color: "#7BE141",
    },
  };

  return (
    <Graph
      graph={graph}
      options={options}
      style={{ position: "absolute", height: "100%", width: "100%" }}
      // getNetwork={network => {
      //   network.setOptions({
      //     physics: {enabled: false}
      //   })
      // }}
    />
  );
}
