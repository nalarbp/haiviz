/*
// TODO:
Validation: all leaf node in the tree must exist in isolate data (nodes tidak boleh lebih besar dari isolate data)
Important settings:
+ node label text size change
+ node size
+ change scale
+ align
+ sort
*/
import React, { useEffect, useState } from "react";
import { text } from "d3-fetch";
import { hierarchy, cluster } from "d3-hierarchy";
import { Card, Empty, Spin, Upload } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import newickParse from "../utils/newick";
import { PhylotreeInputSVG } from "../utils/customIcons";
import { filterUnique } from "../utils/utils";

const { Dragger } = Upload;

//props.treeData, props.loadTreeData

const PhylotreeInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  async function parseTree(fileURL) {
    let tree_promise = await text(fileURL).then(function(result) {
      return result;
    });
    // Do validation here
    let tree_is_valid = false;
    let phylotree;
    try {
      phylotree = newickParse(tree_promise); //err stop here
    } catch (e) {
      setisLoading(false);
    }

    //alert and stop when invalid, send tree to store when valid
    if (phylotree) {
      let phylotreeData = hierarchy(phylotree, (d) => d.branchset).sum((d) =>
        d.branchset ? 0 : 1
      );
      let clusterLayout = cluster().size([100, 100]);
      let treeLayout = clusterLayout(phylotreeData);
      let tree_leaves = treeLayout.leaves().map((d) => d.data.name);
      let tree_leaves_unique = tree_leaves.filter(filterUnique);
      if (tree_leaves.length === tree_leaves_unique.length) {
        tree_is_valid = true;
      } else {
        alert("Invalid tree: duplicated leaf labels are detected");
        setisLoading(false);
        return;
      }
    }
    if (tree_is_valid) {
      props.loadTreeData(tree_promise);
    } else {
      alert("Invalid tree");
      setisLoading(false);
      return;
    }
  }
  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseTree(dataUrl);
      };
    }
  };

  useEffect(() => {
    if (props.treeData) {
      setisLoading(false);
    }
  }, [props.treeData]);

  return (
    <React.Fragment>
      <Card
        title={"Phylogenetic tree"}
        style={{ height: "100%" }}
        headStyle={{ textAlign: "left" }}
        bodyStyle={{ margin: "0px", padding: "5px" }}
      >
        {!props.isolateData && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={"Please load the metadata first"}
          />
        )}
        {props.isolateData && !isLoading && !props.treeData && (
          <React.Fragment>
            <Dragger
              accept={".nwk, .tre, .tree"}
              style={{ padding: "10px" }}
              name="file"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <PhylotreeInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {props.isolateData && isLoading && !props.treeData && <Spin />}
        {props.isolateData && !isLoading && props.treeData && (
          <React.Fragment>
            <div style={{ padding: "10px" }}>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "20pt" }}
              />
              <p>Loaded!</p>
            </div>
          </React.Fragment>
        )}
      </Card>
    </React.Fragment>
  );
};
export default PhylotreeInput;
