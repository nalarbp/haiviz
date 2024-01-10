import React, { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import coseBilkent from "cytoscape-cose-bilkent";
import {
  getColorScaleByObject,
  removeAllChildFromNode,
  downloadFileAsText,
} from "../utils/utils";
import { Button, Empty, Spin, notification } from "antd";
import "./style_TransGraph.css";
import cytoscape from "cytoscape";
import svg from "cytoscape-svg";
import { ClearOutlined, SaveOutlined } from "@ant-design/icons";
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

  const saveGraphHandler = () => {
    const savedGraph = cytoscapeRef.current.json().elements;
    props.changeTransSavedGraph(savedGraph);
    notification.info({
      message: "Graph's layout has been saved",
      placement: "bottomRight",
      duration: 1
    });
  };

  //USE-EFFECTS
  //downloading
  useEffect(() => {
    if (transgraphIsDownloading) {
      //console.log("downloading");
      let cy = cytoscapeRef.current;
      let svgContent = cy.svg({ scale: 1, full: true });
      downloadFileAsText("HAIviz-cytoscape-svg.svg", svgContent);
      props.changeTransIsDownloading(false);
    }
  }, [transgraphIsDownloading]);

  useEffect(() => {
    //console.log("useEffect isInitialDraw ---");
    if(isInitialDraw){
      if(!props.transgraphSettings.savedGraph){
        if(isUserStartResize && !props.isUserRedraw){
          //console.log("isUserStartResize");
          select("#transgraph-zoomButton-container").style("display", "none");
          select("#transgraph-no-drawing").style("display", "block");
          removeAllChildFromNode("#transmission-cy");
        } else {
          //console.log("no saved graph");
          draw();
        }
        
      }
      else{
        if(isUserStartResize && !props.isUserRedraw){
          //console.log("isUserStartResize");
          select("#transgraph-zoomButton-container").style("display", "none");
          select("#transgraph-no-drawing").style("display", "block");
          removeAllChildFromNode("#transmission-cy");
        }
        else{
          //console.log("saved graph");
          removeAllChildFromNode("#transmission-cy");
          redrawPreviousGraph()
        }
      }
    }
  }, [isInitialDraw])

  useEffect(() => {
    if(isUserStartResize){
      //console.log("isUserStartResize");
      select("#transgraph-zoomButton-container").style("display", "none");
      select("#transgraph-no-drawing").style("display", "block");
      removeAllChildFromNode("#transmission-cy");
    }
  },[isUserStartResize])

  useEffect(() => {
    if(props.isUserRedraw){
      //console.log("isUserRedraw");
      if(props.transgraphSettings.savedGraph){
        //console.log("savedGraph is true");
        removeAllChildFromNode("#transmission-cy");
        redrawPreviousGraph();
      }
      else{
        //console.log("else");
        removeAllChildFromNode("#transmission-cy");
        draw();
      }
    }
  }, [props.isUserRedraw]);
  
  //changing layout
  useEffect(() => {
    if (cytoscapeRef.current) {
      //console.log("changing layout");
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
    //console.log("useEffect selectedData ---");
    selectUnselect();
  }, [props.selectedData]);

  useEffect(() => {
      if (isDrawCompleted) {
        //console.log("isDrawCompleted");
          select("#transgraph-loading").style("display", "none");
          //hide #transmission-cy by setting opacity to 0
          select("#transmission-cy").style("opacity", 1);
      } else {
        //console.log("isDrawCompleted else");
        select("#transgraph-loading").style("display", "block");
        select("#transmission-cy").style("opacity", 0);
      }
  }, [isDrawCompleted]);

  useEffect(() => {
    if (cytoscapeRef.current && props.colorScale.colorType) {
      //console.log("colorScale changed");
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
      updateUserLinkStyle(cy)
    }
  }, [isUserStyleApplied]);

  function updateUserLinkStyle(cy) {
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

  useEffect(() => {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      updateLinkLabelShow(cy);
    }
  }, [isLinkLabelShown]);
function updateLinkLabelShow(cy) {
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

  useEffect(() => {
    if (cytoscapeRef.current) {
      var cy = cytoscapeRef.current;
      updateNodeLabelShow(cy);
    }
  }, [isNodeLabelShown]);
  function updateNodeLabelShow(cy) {
    if (isNodeLabelShown) {
      cy.style()
        .selector("node")
        .style({
          "text-opacity": 1,
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

  useEffect(() => {
    if (cytoscapeRef.current) {
      //console.log("isLinkWeightApplied changed")
      let cy = cytoscapeRef.current;
      updateLinkWeight(cy);
    }
  }, [isLinkWeightApplied, linkFactor]);
  function updateLinkWeight(cy) {
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
    //console.log("draw");
    setisDrawCompleted(false);
    select("#transgraph-no-drawing").style("display", "none");
    const graph_layout = { name: layoutKey, animate: false, fit: true, prelayout: false };
    const cy = cytoscape({
      elements: transmission,
      container: document.getElementById("transmission-cy"),
      pannable: true,
      selected: true,
      boxSelectionEnabled: true});
    if(transmission.length > 300){
      setTimeout(() => {
        coreDraw(cy);
        cy.layout(graph_layout).run();
        setisDrawCompleted(true);
      }, 1000);
    }
    else{
      coreDraw(cy);
      cy.layout(graph_layout).run();
      setisDrawCompleted(true);
    }
    select("#transgraph-zoomButton-container").style("display", "block");
  }
  
  //REDRAW
  function redrawPreviousGraph() {
    setisDrawCompleted(false);
    if (props.transgraphSettings.savedGraph) {
      select("#transgraph-no-drawing").style("display", "none");
      const cy = cytoscape({
        container: document.getElementById("transmission-cy"),
        pannable: true,
        selected: true,
        boxSelectionEnabled: true});
      cy.add(props.transgraphSettings.savedGraph);
      const nodesEdgesCount = cy.nodes().length + cy.edges().length;
      const graph_layout = {
        name: 'preset',
        positions: function( node ){ 
          return node.position(); 
        },
        fit: true
      };
      if(nodesEdgesCount > 300){
        setTimeout(() => {
          coreDraw(cy);
          cy.layout(graph_layout).run();
          setisDrawCompleted(true);
        }, 1000);
      }
      else{
        coreDraw(cy);
        cy.layout(graph_layout).run();
        setisDrawCompleted(true);
      }
      select("#transgraph-zoomButton-container").style("display", "block");
    }
  }

  //CORE DRAW
  function coreDraw(cy) {
    //update the child nodes
    cy.style()
    .selector("node")
    .style({
        label: "data(label)",
        "border-width": 3,
        "border-style": "solid",
        "border-color": "black",
        "background-color": function(d) {
            let isolate_name = d.data("label");
            let col = "gray";
            if (props.isolateData) {
              let obj = props.isolateData.get(isolate_name);
              col = obj ? getColorScaleByObject(obj, props.colorScale) : "gray";
            }
            return col;
          }
      })
      .update();
    
    //set the selected nodes by props.selectedData
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
    
    //update the selected nodes style
    cy.style()
    .selector(":selected")
    .style({
          "border-width": "5",
          "border-color": "red",
          "border-style": "dashed",
          padding: "8px",
        })
        .update();

    cy.selectionType("single");

      //update the parent nodes
      cy.style()
      .selector(":parent")
      .style({
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
          })
        .update();

    //update the edges
    cy.style()
      .selector("edge")
      .style({
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
          })
          .update();

    //node event click listener
    cy.nodes().bind("click", function(evt) {
      let clickedNode = [evt.target.data("label")];
      props.setSelectedData(clickedNode);
    });

    //when box selection is enabled
    cy.on("boxselect", function(evt) {
      boxSelectionHandler();
    });

    //click on background listener to reset selection
    cy.on("click", function(evt) {
      if (evt.target === cy) {
        props.setSelectedData([]);
      }
    });
    //some preliminary updates
    updateLinkWeight(cy);
    updateNodeLabelShow(cy);
    updateLinkLabelShow(cy);

    cytoscapeRef.current = cy;
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

  function boxSelectionHandler() {
    if (cytoscapeRef.current) {
      let cy = cytoscapeRef.current;
      let selectedNodes = [];
      cy.nodes().forEach(function(n) {
        if (n.selected()) {
          selectedNodes.push(n.data("label"));
        }
      });
      props.setSelectedData(selectedNodes);
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
        <p>Rendering graph, please wait ...</p>
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
          <Button
            title={"Save graph"}
            shape={"circle"}
            id={"transgraph-saveGraph"}
            size={"medium"}
            icon={<SaveOutlined />}
            onClick={saveGraphHandler}
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
