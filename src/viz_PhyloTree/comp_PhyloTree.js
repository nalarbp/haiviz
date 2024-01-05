import React, { useState, useEffect } from "react";
import PhyloTreeChart from "./chart_PhyloTree_phylocanvas";
import PhyloTreeSettings from "./comp_PhyloTree_Settings";
import { Row, Col, Card, Button } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import withMeasure from "../hocs/withMeasure";
import { deactivateChart, setSelectedData } from "../action/index";
import {
  DragOutlined,
  CloseOutlined,
  RetweetOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  changeTreeResizeSignal,
  changeTreeLayout,
  changeIsTreeNodeAligned,
  changeTreeNodeSize,
  changeTreeTextSize,
  changeTreeTextOffset,
  changeIsTreeScaleShown,
  changeTreeScaleFactor,
  changeTreeCustomScale,
  changeIsTreeDownloading,
} from "../action/phyloTree_actions";

const dimensions = ["width", "height"];

const PhyloTree = (props) => {
  const [isUserRedraw, setisUserRedraw] = useState(false);
  const [isDrawerVisible, setisDrawerVisible] = useState(false);

  // USEEFFECTS
  useEffect(() => {
    if (isUserRedraw) {
      setisUserRedraw(false);
    }
  }, [isUserRedraw]);

  //HANDLERS
  const closeCardHandler = () => {
    props.deactivateChart(props.id);
    props.changeTreeResizeSignal(false);
  };
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };
  const userRedrawHandler = () => {
    if (!isUserRedraw) {
      setisUserRedraw(true);
      props.changeTreeResizeSignal(false);
    }
  };

  //
  return (
    <React.Fragment>
      <div style={{ height: "100%" }}>
        <Card
          title={"Phylogenetic tree"}
          bordered={true}
          headStyle={{ height: "50px", padding: "0 20px" }}
          style={{ height: "100%" }}
          bodyStyle={{ margin: "0px", padding: "5px" }}
          extra={
            <Row>
              <Col span={6}>
                <Button
                  className="panelHeader"
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<DragOutlined />}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<RetweetOutlined />}
                  onClick={userRedrawHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<SettingOutlined />}
                  onClick={openDrawerHandler}
                ></Button>
              </Col>
              <Col span={6}>
                <Button
                  size={"small"}
                  style={{ margin: "0 5px", border: "none" }}
                  icon={<CloseOutlined />}
                  onClick={closeCardHandler}
                ></Button>
              </Col>
            </Row>
          }
        >
          <React.Fragment>
            <div id="phylotree-drawer-settings">
              <PhyloTreeSettings
                isDrawerVisible={isDrawerVisible}
                closeDrawerHandler={closeDrawerHandler}
                phylotreeSettings={props.phylotreeSettings}
                changeTreeLayout={props.changeTreeLayout}
                changeIsTreeNodeAligned={props.changeIsTreeNodeAligned}
                changeTreeNodeSize={props.changeTreeNodeSize}
                changeTreeTextSize={props.changeTreeTextSize}
                changeTreeTextOffset={props.changeTreeTextOffset}
                changeIsTreeScaleShown={props.changeIsTreeScaleShown}
                changeTreeScaleFactor={props.changeTreeScaleFactor}
                changeTreeCustomScale={props.changeTreeCustomScale}
                changeIsTreeDownloading={props.changeIsTreeDownloading}
              />
            </div>
            {props.treeData && (
              <PhyloTreeChart
                width={props.width}
                height={props.height}
                isolateData={props.isolateData}
                data={props.treeData}
                isUserRedraw={isUserRedraw}
                phylotreeSettings={props.phylotreeSettings}
                selectedData={props.selectedData}
                setSelectedData={props.setSelectedData}
                colorScale={props.colorScale}
                changeIsTreeDownloading={props.changeIsTreeDownloading}
              />
            )}
          </React.Fragment>
        </Card>
      </div>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    isolateData: state.isolateData,
    treeData: state.tree,
    selectedData: state.selectedData,
    phylotreeSettings: state.phylotreeSettings,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      changeTreeResizeSignal: changeTreeResizeSignal,
      changeTreeLayout: changeTreeLayout,
      changeIsTreeNodeAligned: changeIsTreeNodeAligned,
      changeTreeNodeSize: changeTreeNodeSize,
      changeTreeTextSize: changeTreeTextSize,
      changeTreeTextOffset: changeTreeTextOffset,
      changeIsTreeScaleShown: changeIsTreeScaleShown,
      changeTreeScaleFactor: changeTreeScaleFactor,
      changeTreeCustomScale: changeTreeCustomScale,
      changeIsTreeDownloading: changeIsTreeDownloading,
      setSelectedData: setSelectedData,
    },
    dispatch
  );
}

const MeasuredPhyloTree = withMeasure(dimensions)(PhyloTree);

export default connect(mapStateToProps, mapDispatchToProps)(MeasuredPhyloTree);
