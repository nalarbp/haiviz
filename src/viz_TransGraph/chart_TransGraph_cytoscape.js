import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import coseBilkent from "cytoscape-cose-bilkent";
import {
  getColorScaleByObject,
  removeAllChildFromNode,
  downloadFileAsText,
} from "../utils/utils";
import { Button, Empty, Spin } from "antd";
import "./style_TransGraph.css";
import cytoscape from "cytoscape";

import svg from "cytoscape-svg";
import { ClearOutlined } from "@ant-design/icons";
import usePrevious from "../react_hooks/usePrevious-hook";

const spread = require("cytoscape-spread");
const fcose = require("cytoscape-fcose");
cytoscape.use(spread); // register extension
cytoscape.use(coseBilkent); // register extension
cytoscape.use(fcose); // register extension
cytoscape.use(svg);

const _ = require("lodash");

const TransGraph = (props) => {
  //DRAWING CONSTRUCTOR
  const [isDrawCompleted, setisDrawCompleted] = useState(null);
  const transmission = _.cloneDeep(props.data);
  //console.log(transmission);
  const transmissionCytoscapeRef = useRef();
  const transmissionContainerRef = useRef();
  const cytoscapeRef = useRef(null);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const prevDimension = usePrevious(observedWidth + observedHeight);
  const isInitialDraw = prevDimension && prevDimension < 0 ? true : false;

  //SETTINGS
  const isUserStartResize = props.transgraphSettings.isUserStartResize;
  const isUserStyleApplied = props.transgraphSettings.isUserStyleApplied;
  const isNodeLabelShown = props.transgraphSettings.isNodeLabelShown;
  const isLinkLabelShown = props.transgraphSettings.isLinkLabelShown;
  const isLinkWeightApplied = props.transgraphSettings.isLinkWeightApplied;
  const layoutKey = props.transgraphSettings.layoutKey;
  const linkFactor = props.transgraphSettings.linkFactor;
  const transgraphIsDownloading =
    props.transgraphSettings.transgraphIsDownloading;
  //HANDLERS
  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };

  // const boxSelectionHandler = () => {
  //   if (cytoscapeRef.current) {
  //     let cy = cytoscapeRef.current;

  //     let selectedNodes = [];
  //     cy.nodes().forEach(function(n) {
  //       console.log(n.selected());
  //       if (n.active()) {
  //         selectedNodes.push(n.data("label"));
  //       }
  //     });
  //     //console.log(selectedNodes);
  //     //props.setSelectedData(selectedNodes);
  //   }
  // };

  //USE-EFFECTS
  //downloading
  useEffect(() => {
    if (transgraphIsDownloading) {
      let cy = cytoscapeRef.current;
      let svgContent = cy.svg({ scale: 1, full: true });
      downloadFileAsText("HAIviz-cytoscape-svg.svg", svgContent);
      props.changeTransIsDownloading(false);
    }
  }, [transgraphIsDownloading]);

  useEffect(() => {
    console.log("transgraph isInitialDraw, isUserStartResize, isUserRedraw");
    if (isUserStartResize) {
      console.log("transgraph isUserStartResize");
      //if its back from other tab or page
      //else if its from resize
      if(cytoscapeRef.current){
        console.log("transgraph isUserStartResize, cytoscapeRef.current is not null");
        //save current Ref
        const savedGraph = cytoscapeRef.current.json().elements;
        props.changeTransSavedGraph(savedGraph);
        select("#transgraph-zoomButton-container").style("display", "none");
        select("#transgraph-no-drawing").style("display", "block");
        removeAllChildFromNode("#transmission-cy");
        cytoscapeRef.current = null;
      } else {
        console.log("transgraph isUserStartResize, cytoscapeRef.current is null");
        //cytoscapeRef.current = null;
        
      }
    } else {
      if (isInitialDraw) {
        console.log("transgraph isInitialDraw");
        draw();
      } else if (props.isUserRedraw) {
          console.log("transgraph isUserRedraw");
          //redraw using the saved graph
          const cy = cytoscape({
            container: document.getElementById("transmission-cy"),
            pannable: true,
            selected: true,
            boxSelectionEnabled: false});
          cy.add(props.transgraphSettings.savedGraph);
          


          cy.style().update();
          cytoscapeRef.current = cy;
        }
    }
  }, [isInitialDraw, isUserStartResize, props.isUserRedraw]);
  //changing layout
  useEffect(() => {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      let graph_layout = {
        name: layoutKey,
        animate: false,
        fit: true,
        prelayout: false,
      };
      cy.layout(graph_layout).run();
      cytoscapeRef.current = cy;
    }
  }, [layoutKey]);

  useEffect(() => {
    selectUnselect();
  }, [props.selectedData]);

  useEffect(() => {
      if (isDrawCompleted) {
          select("#transgraph-loading").style("display", "none");
      } else {
        select("#transgraph-loading").style("display", "block");
      }
  }, [isDrawCompleted]);

  useEffect(() => {
    if (cytoscapeRef.current && props.colorScale.colorType) {
      let cy = cytoscapeRef.current;
      cy.style()
        .selector("node")
        .style({
          "background-color": function(d) {
            let isolate_name = d.data("label");
            let obj = props.isolateData.get(isolate_name);
            let col = getColorScaleByObject(obj, props.colorScale);
            return col;
          },
        })
        .update();
      cytoscapeRef.current = cy;
    }
  }, [props.colorScale]);

  useEffect(() => {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      cy.style()
        .selector("edge")
        .style({
          "line-style": (d) => (isUserStyleApplied ? d.data("style") : "solid"),
          "line-color": (d) => (isUserStyleApplied ? d.data("color") : "black"),
          "target-arrow-color": (d) =>
            isUserStyleApplied ? d.data("color") : "black",
        })
        .update();
      cytoscapeRef.current = cy;
    }
  }, [isUserStyleApplied]);

  useEffect(() => {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      if (isLinkLabelShown) {
        cy.style()
          .selector("edge")
          .style({
            "text-background-opacity": 1,
            "text-opacity": 1,
          })
          .update();
        cytoscapeRef.current = cy;
      } else {
        cy.style()
          .selector("edge")
          .style({
            "text-background-opacity": 0,
            "text-opacity": 0,
          })
          .update();
        cytoscapeRef.current = cy;
      }
    }
  }, [isLinkLabelShown]);

  useEffect(() => {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      if (isNodeLabelShown) {
        cy.style()
          .selector("node")
          .style({
            "text-size": 1,
          })
          .update();
        cytoscapeRef.current = cy;
      } else {
        cy.style()
          .selector("node")
          .style({
            "text-opacity": 0,
          })
          .selector(":parent")
          .style({
            "text-opacity": 1,
          })
          .update();
        cytoscapeRef.current = cy;
      }
    }
  }, [isNodeLabelShown]);

  useEffect(() => {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      if (isLinkWeightApplied) {
        cy.style()
          .selector("edge")
          .style({
            width: function(e) {
              return getEdgeArrowWidth(
                isLinkWeightApplied,
                e.data("weight"),
                linkFactor,
                "edge"
              );
            },
            "arrow-scale": function(e) {
              return getEdgeArrowWidth(
                isLinkWeightApplied,
                e.data("weight"),
                linkFactor,
                "arrow"
              );
            },
          })
          .update();
        cytoscapeRef.current = cy;
      } else {
        cy.style()
          .selector("edge")
          .style({
            width: 3,
            "arrow-scale": 1,
          })
          .update();
        cytoscapeRef.current = cy;
      }
    }
  }, [isLinkWeightApplied, linkFactor]);

  //Util
  const getEdgeArrowWidth = function(
    isEdgeWeightApplied,
    edgeWeight,
    weightFactor,
    option
  ) {
    if (isEdgeWeightApplied) {
      let width = edgeWeight ? edgeWeight * weightFactor : 3;
      if (option === "edge") {
        return width;
      } else {
        let arrow_w = width < 1 ? width : 1;
        return arrow_w;
      }
    } else {
      if (option === "edge") {
        return 3;
      } else {
        return 1;
      }
    }
  };

  //DRAW
  function draw() {
    //clean previous drawing artifacts
    select("#transgraph-no-drawing").style("display", "none");
    select("#transgraph-zoomButton-container").style("display", "block");
    const graph_layout = { name: layoutKey, animate: false, fit: true };

    const cy = cytoscape({
      elements: transmission,
      container: document.getElementById("transmission-cy"),
      pannable: true,
      selected: true,
      boxSelectionEnabled: false,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "border-width": 3,
            "border-style": "solid",
            "border-color": "black",
          },
        },
        {
          selector: ":parent",
          shape: "round",
          style: {
            "background-image": "none",
            "padding-top": "5px",
            "background-position-x": "0",
            "background-position-y": "0",
            "background-width": "100%",
            "background-height": "100%",
            "background-fit": "contain",
            "background-opacity": "0",
            "border-width": "1",
            "text-valign": "top",
            "text-halign": "center",
          },
        },

        {
          selector: "edge",
          style: {
            label: "data(weight)",
            "font-size": "8px",
            "text-background-color": "yellow",
            "text-background-opacity": 0,
            "text-opacity": 0,
            color: "black",
            width: function(e) {
              return getEdgeArrowWidth(
                isLinkWeightApplied,
                e.data("weight"),
                linkFactor,
                "edge"
              );
            },
            "line-style": (d) =>
              isUserStyleApplied ? d.data("style") : "solid",
            "line-color": (d) =>
              isUserStyleApplied ? d.data("color") : "black",
            "target-arrow-color": (d) =>
              isUserStyleApplied ? d.data("color") : "black",
            "target-arrow-shape": function(e) {
              let arrowShape =
                e.data("dir") === "forward" ? "triangle" : "none";

              return arrowShape;
            },
            "arrow-scale": function(e) {
              return getEdgeArrowWidth(
                isLinkWeightApplied,
                e.data("weight"),
                linkFactor,
                "arrow"
              );
            },
            "curve-style": "bezier",
          },
        },
        {
          selector: ":selected",
          style: {
            "border-width": "5",
            "border-color": "red",
            "border-style": "dashed",
            padding: "8px",
          },
        },
      ],
    });
    cy.selectionType("single");
    cy.layout(graph_layout).run();

    //node event click listener
    cy.nodes().bind("click", function(evt) {
      let clickedNode = [evt.target.data("label")];
      // let prevSelectedNodes = [];
      // cy.nodes().forEach(function(n) {
      //   if (n.selected()) {
      //     prevSelectedNodes.push(n.data("label"));
      //   }
      // });
      // console.log(prevSelectedNodes);
      // prevSelectedNodes.push(clickedNode);
      props.setSelectedData(clickedNode);
    });
    //click on background listener
    cy.on("click", function(evt) {
      if (evt.target === cy) {
        props.setSelectedData([]);
      }
    });
    cy.on('position', 'node', function(event) {
      var node = event.target; // Get the node object
      var newPosition = node.position(); // Get the new position of the node
    
      // Call your custom function here and pass the necessary arguments
      console.log(newPosition);
    });
    // cy.on("box", function(evt) {
    //   props.setSelectedData([evt.target.data("label")]);
    // });

    //color the nodes
    cy.style()
      .selector("node")
      .style({
        "background-color": function(d) {
          let isolate_name = d.data("label");
          let col = "gray";
          if (props.isolateData) {
            let obj = props.isolateData.get(isolate_name);
            col = obj ? getColorScaleByObject(obj, props.colorScale) : "gray";
          }
          return col;
        },
      })
      .update();

    //save current Ref
    cytoscapeRef.current = cy;
    setisDrawCompleted(true);
  }
  //write fuction redraw, that will be called when user click redraw button. it should be based on the current state of the cytoscapeRef.current. dont rerun the layout, just update the data and style
  //REDRAW
  function redraw() {
    if (cytoscapeRef.current) {
      const graph_layout = { name: layoutKey, animate: false, fit: true };
      let cy = cytoscapeRef.current;
      cy.layout(graph_layout).run();
    }
  }

      

  //SELECT & UNSELECT
  function selectUnselect() {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      if (props.selectedData && props.selectedData.length > 0) {
        cy.nodes().forEach(function(n) {
          let node = n.data("label");
          let isNodeInSelectedData =
            props.selectedData.indexOf(node) === -1 ? false : true;
          if (isNodeInSelectedData) {
            n.select();
          } else {
            n.unselect();
          }
        });
        cy.style().update();
        cytoscapeRef.current = cy;
      } else if (props.selectedData && props.selectedData.length === 0) {
        cy.nodes().unselect();
        cy.style().update();
        cytoscapeRef.current = cy;
      }
    }
  }

  return (
    <React.Fragment>
      <div id="transmissionContainer" ref={transmissionContainerRef}>
        <div id="transgraph-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="transgraph-loading">
          <Spin />
        </div>
        <div id="transgraph-zoomButton-container">
          <Button
            title={"Clear selection"}
            shape={"circle"}
            id={"transgraph-clearSelection"}
            size={"medium"}
            icon={<ClearOutlined />}
            onClick={clearSelectedDataHandler}
          ></Button>
        </div>
        <div
          id="transmission-cy"
          style={{ width: props.width - 10, height: props.height - 80 }}
          ref={transmissionCytoscapeRef}
        ></div>
      </div>
    </React.Fragment>
  );
};

export default TransGraph;
