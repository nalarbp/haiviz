import React, { useEffect, useRef } from "react";
import { select } from "d3-selection";
import "./style_PhyloTree.css";
import { Empty, Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { removeAllChildFromNode, downloadFileAsText } from "../utils/utils";
import Phylocanvas from "phylocanvas";
import "phylocanvas/polyfill";
import exportSvgPlugin from "phylocanvas-plugin-export-svg";
import scalebarPlugin from "phylocanvas-plugin-scalebar";
Phylocanvas.plugin(exportSvgPlugin);
Phylocanvas.plugin(scalebarPlugin);

const PhyloTreeChart = (props) => {
  // tree constructror will be recalled when props from parent change, so just put it here
  const phylotreeContainerRef = useRef();
  const phylocanvasRef = useRef(null);
  const observedWidth = props.width - 10;
  const observedHeight = props.height - 80;
  const phylotreeData = props.data;
  const container_w = observedWidth;
  const container_h = observedHeight;

  //SETTINGS
  const isUserStartResize = props.phylotreeSettings.isUserStartResize;
  const treeLayout = props.phylotreeSettings.layout;
  const isTaxaAligned = props.phylotreeSettings.isTaxaAligned;
  const leafLabelSize = props.phylotreeSettings.textSize;
  const treeIsDownloading = props.phylotreeSettings.isDownloading;

  //USE-EFFECTS
  useEffect(() => {
    //console.log("PhyloTreeChart: useEffect: props.data");
    if (
      observedWidth &&
      observedHeight &&
      !isUserStartResize &&
      !props.isUserRedraw
    ) {
      //when initial draw
      draw();
    } else if (
      observedWidth &&
      observedHeight &&
      !isUserStartResize &&
      props.isUserRedraw
    ) {
      //when user click redraw
      draw();
      // reset currentEvent.zoom transform
    } else {
      select("#phylotree-zoomButton-container").style("display", "none");
      select("#phylotree-no-drawing").style("display", "block");
      //clean previous-draw
      removeAllChildFromNode("#phylocanvas-container");
    }
  }, [observedWidth, observedHeight, isUserStartResize, props.isUserRedraw]);

  //Update selected node(s)
  useEffect(() => {
    //console.log("PhyloTreeChart: useEffect: props.selectedData");
    if (props.selectedData) {
      let tree = phylocanvasRef.current;
      if (tree) {
        updateSelectedData(tree)
      }
    }
  }, [props.selectedData]);
  function updateSelectedData(tree) {
    if (props.selectedData && props.selectedData.length > 0) {
      //keep all branch lines color to black. tree.branches is a object, so iterate through its keys
      Object.keys(tree.branches).forEach((key) => {
        tree.branches[key].highlighted = false;
        tree.branches[key].selected = false;
      });

      tree.leaves.forEach((leaf, i) => {
        if (props.selectedData.indexOf(leaf.id) !== -1) {
          leaf.highlighted = true;
          leaf.selected = true;
        } else {
          leaf.highlighted = false;
          leaf.selected = false;
        }
      });
      tree.draw();
    } else {
      tree.leaves.forEach((leaf, i) => {
        leaf.highlighted = false;
        leaf.selected = false;
      });
      tree.draw();
    }
  }

  //Update layout
  useEffect(() => {
    //console.log("PhyloTreeChart: useEffect: props.phylotreeSettings.layout");
    let tree = phylocanvasRef.current;
    if (tree) {
      tree.setTreeType(treeLayout);
      tree.draw();
    }
  }, [treeLayout]);

  //downloading
  useEffect(() => {
    //console.log("PhyloTreeChart: useEffect: props.phylotreeSettings.isDownloading");
    if (treeIsDownloading) {
      let tree = phylocanvasRef.current;
      if(tree){
        let svgData = tree.exportSVG.getSerialisedSVG(true);
        downloadFileAsText("HAIviz-phylocanvas-svg.svg", svgData);
        props.changeIsTreeDownloading(false);
      }
    }
  }, [treeIsDownloading]);

  //Update isTaxaAligned
  useEffect(() => {
    //console.log("PhyloTreeChart: useEffect: props.phylotreeSettings.isTaxaAligned");
    let tree = phylocanvasRef.current;
    if (tree) {
      tree.alignLabels = isTaxaAligned;
      tree.draw();
    }
  }, [isTaxaAligned]);

  //Update leaf's label size
  useEffect(() => {
    //console.log("PhyloTreeChart: useEffect: props.phylotreeSettings.textSize");
    let tree = phylocanvasRef.current;
    if (tree) {
      updateLeafLabelSize(tree)
    }
  }, [leafLabelSize]);
  function updateLeafLabelSize(tree) {
    tree.leaves.forEach((leaf, i) => {
      leaf.labelStyle = { textSize: leafLabelSize };
    });
    tree.draw();
 
  }

  //DRAWING
  function draw() {
    //clean previous drawing artifacts
    select("#phylotree-no-drawing").style("display", "none");
    select("#phylotree-zoomButton-container").style("display", "block");
    removeAllChildFromNode("#phylocanvas-container");

    //first draw phylocanvas
    let tree = Phylocanvas.createTree("phylocanvas-container", {
      scalebar: {
        active: true,
        width: 100,
        height: 20,
        fillStyle: "black",
        strokeStyle: "black",
        lineWidth: 1,
        fontFamily: "Sans-serif",
        textBaseline: "bottom",
        textAlign: "center",
        digits: 2,
        position: {
          bottom: 10,
          left: 10,
        },
      },
    });
    tree.setSize(container_w, container_h);

    //global config
    tree.hoverLabel = true;
    tree.hoverLabel = false;
    tree.highlightColour = "red";
    tree.highlightSize = 2;
    tree.highlightWidth = 2;
    tree.selectedColour = "red";
    tree.addListener("click", function(e) {
      let selectedLeaves = tree.getSelectedNodeIds();
      if (selectedLeaves.length > 0) {
        //console.log(selectedLeaves);
        props.setSelectedData(selectedLeaves);
      }
    });
    tree.addListener("dblclick", function(e) {
      props.setSelectedData([]);
    });
    tree.setTreeType(treeLayout); // Supported for rectangular, circular, and hierarchical tree types
    tree.alignLabels = isTaxaAligned; // false to reset
    tree.load(phylotreeData);
    updateLeafLabelSize(tree)
    updateSelectedData(tree)
    //
    phylocanvasRef.current = tree;
  }

  //HANDLERS

  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };

  return (
    <React.Fragment>
      <div id="phylotreeContainer" ref={phylotreeContainerRef}>
        <div id="phylotree-no-drawing">
          <Empty
            description={"No chart: please click redraw button"}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        <div id="phylotree-zoomButton-container">
          <Button
            title={"Clear selection"}
            shape={"circle"}
            id={"phylotree-clearSelection"}
            size={"medium"}
            icon={<ClearOutlined />}
            onClick={clearSelectedDataHandler}
          ></Button>
        </div>
        <div id="phylocanvas-container"></div>
      </div>
    </React.Fragment>
  );
};

export default PhyloTreeChart;
