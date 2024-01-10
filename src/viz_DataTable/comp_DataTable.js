import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deactivateChart, setSelectedData } from "../action/index";
import { Row, Col, Card, Button, Table, Skeleton} from "antd";
//import DataTableSettings from "./comp_DataTable_Settings";
import {
  DragOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { dateToStringIS08601, getIsolateDataHeader } from "../utils/utils";
import withMeasure from "../hocs/withMeasure";

const dimensions = ["width", "height"];
const _ = require("lodash");

const DataTable = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const isolateData = _.cloneDeep(Array.from(props.data.values()));
  const dataTable = { headers: null, cells: null };

  const cells =
    isolateData && isolateData[0]
      ? isolateData.map((d, idx) => {
          if (d.isolate_colDate instanceof Date) {
            d.isolate_colDate = dateToStringIS08601(d.isolate_colDate);
          }
          return { key: d.isolate_name, ...d };
        })
      : null;
  const [tableCells, setTableCells] = useState(cells);
  //create headers
  const tableHeaders =
    isolateData && isolateData[0] ? createHeaders(isolateData) : null;
  
    //USE EFFECTS
  useEffect(() => {
    if (props.selectedData) {
      setSelectedRowKeys(props.selectedData);
      let tableCells = isolateData.map((d, idx) => {
        if (d.isolate_colDate instanceof Date) {
          d.isolate_colDate = dateToStringIS08601(d.isolate_colDate);
        }
        return { key: d.isolate_name, ...d };
      });

      if (props.selectedData.length > 0) {
        let filteredCells = tableCells.filter((d) => {
          return props.selectedData.indexOf(d.isolate_name) !== -1;
        });
        setTableCells(filteredCells);
        
      } else {
        setTableCells(tableCells);
      }
    }
  }, [props.selectedData]);

  //HANDLERS
  const onCloseHandler = () => {
    props.deactivateChart(props.id);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const resetSelection = () => {
    setSelectedRowKeys([]);
    props.setSelectedData([]);
  };

const displaySelectedData = () => {
if (selectedRowKeys.length > 0) {
    props.setSelectedData(selectedRowKeys);
  }
}

  //Util functions
  function createHeaders(isolateData) {
    let raw_headers = isolateData[0];
    //sort raw_headers so that isolate_name, date and location are always first
    let headers = Object.keys(raw_headers)
      .sort(function(a, b) {
        if (a === "isolate_name") return -1;
        if (b === "isolate_name") return 1;
        if (a === "isolate_colDate") return -1;
        if (b === "isolate_colDate") return 1;
        if (a === "isolate_colLocation") return -1;
        if (b === "isolate_colLocation") return 1;
        return 0;
      })
      .filter(function(key) {
        // remove any header contain ":color"
        return key.indexOf(":color") === -1;
      })
      .map(function(key) {
        return {
          key: key,
          dataIndex: key,
          title: getIsolateDataHeader(key),
          sorter: {
            compare: (a, b) => {
              if (a[key] < b[key]) {
                return -1;
              }
              if (a[key] > b[key]) {
                return 1;
              }
              return 0;
            }
          }
        };
      });
    return headers;
  }

  return (
    <React.Fragment>
      <Card
        title={"Table"}
        bordered={false}
        style={{ height: "100%" }}
        bodyStyle={{ padding: "0px", width: "100%" }}
        extra={
          <Row>
            <Col span={8}>
              <Button
                className="panelHeader"
                size={"small"}
                style={{ margin: "0 5px", border: "none" }}
                icon={<DragOutlined />}
              ></Button>
            </Col>

            <Col span={8}>
              {" "}
              <Button
                size={"small"}
                style={{ margin: "0 5px", border: "none" }}
                icon={<CloseOutlined />}
                onClick={onCloseHandler}
              ></Button>
            </Col>
          </Row>
        }
      >
        {!dataTable && (
          <Row
            style={{
              margin: "20px",
              overflowY: "auto",
              height: props.height - 100,
            }}
          >
            <Skeleton active />
          </Row>
        )}
        {dataTable && (
          <Row
            style={{
              margin: "20px",
              overflowY: "auto",
              height: props.height - 100,
            }}
          >
            <p style={{ height: "40px", marginLeft: "10px" }}>
              Row/s selected: &nbsp;
              <strong>{selectedRowKeys.length}</strong> &nbsp;
            </p>
            <Button onClick={resetSelection}>Reset Selection</Button>
            <Button style={{marginLeft: "10px"}} onClick={displaySelectedData}>Display Selected Row/s</Button>
            <Table
              style={{
                width: "100%",
                height: props.height - 160,
              }}
              dataSource={tableCells}
              pagination={false}
              columns={tableHeaders}
              rowSelection={rowSelection}
            />
          </Row>
        )}
      </Card>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    data: state.isolateData,
    selectedData: state.selectedData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deactivateChart: deactivateChart,
      setSelectedData: setSelectedData,
    },
    dispatch
  );
}

const MeasuredDataTable = withMeasure(dimensions)(DataTable);

export default connect(mapStateToProps, mapDispatchToProps)(MeasuredDataTable);

/*
for next release:
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };
  
<Col span={8}>
              <Button
                size={"small"}
                style={{ margin: "0 5px", border: "none" }}
                icon={<SettingOutlined />}
                onClick={openDrawerHandler}
              ></Button>
            </Col>
            
<div id="dataTable-drawer-settings">
          <DataTableSettings
            isolateData={isolateData}
            selectedData={props.selectedData}
            colorScale={props.colorScale}
            isDrawerVisible={isDrawerVisible}
            closeDrawerHandler={closeDrawerHandler}
          />
        </div>
*/
