import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deactivateChart, setSelectedData } from "../action/index";
import { Row, Col, Card, Button, Table, Skeleton, Input, Space } from "antd";
//import DataTableSettings from "./comp_DataTable_Settings";
import {
  DragOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { dateToStringIS08601, getIsolateDataHeader } from "../utils/utils";
import withMeasure from "../hocs/withMeasure";

const dimensions = ["width", "height"];
const _ = require("lodash");

const DataTable = (props) => {
  const isolateData = _.cloneDeep(Array.from(props.data.values()));
  const dataTable = { headers: null, cells: null };
  const cells =
    isolateData && isolateData[0]
      ? isolateData.map((d, idx) => {
          if (d.isolate_colDate instanceof Date) {
            d.isolate_colDate = dateToStringIS08601(d.isolate_colDate);
          }
          return { key: idx, ...d };
        })
      : null;
  const [tableCells, setTableCells] = useState(cells);
  //create headers
  const tableHeaders =
    isolateData && isolateData[0] ? createHeaders(isolateData) : null;

  //USE EFFECTS
  useEffect(() => {
    if (props.selectedData) {
      let tableCells = isolateData.map((d, idx) => {
        if (d.isolate_colDate instanceof Date) {
          d.isolate_colDate = dateToStringIS08601(d.isolate_colDate);
        }
        return { key: idx, ...d };
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

  const onTableChangeHandler = (searchedColumn, searchText, tableData) => {
    const searchTextList = searchText.split("::");
    if (Array.isArray(tableData.currentDataSource)) {
      if (tableData.currentDataSource.length > 0) {
        props.setSelectedData(
          tableData.currentDataSource.map((d) => d.isolate_name)
        );
      } else {
        let selectedData = [];
        if (searchedColumn === "isolate_colDate") {
          let filteredCells = isolateData.filter(function(d) {
            let record = d[searchedColumn];
            return searchTextList.indexOf(record) !== -1 ? true : false;
            //return searchTextList.some((t) => record.includes(t.toLowerCase()));
          });
          if (filteredCells) {
            selectedData = filteredCells;
          }
        } else {
          let filteredCells = isolateData.filter(function(d) {
            let record = d[searchedColumn].toString();
            return searchTextList.indexOf(record) !== -1 ? true : false;
            //return searchTextList.some((t) => record.includes(t.toLowerCase()));
          });

          if (filteredCells) {
            selectedData = filteredCells;
          }
        }
        if (selectedData && selectedData.length > 0) {
          props.setSelectedData(selectedData.map((d) => d.isolate_name));
        }
      }
    }
  };

  const clearSelectedDataHandler = () => {
    //setSearchText(null);
    props.setSelectedData([]);
  };

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
          filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={`Filter ${getIsolateDataHeader(key)}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => {
                  confirm();
                }}
                style={{ width: 188, marginBottom: 8, display: "block" }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    confirm();
                  }}
                  icon={<FilterOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Filter
                </Button>
                <Button
                  onClick={() => {
                    clearFilters();
                    clearSelectedDataHandler();
                  }}
                  size="small"
                  style={{ width: 90 }}
                >
                  Reset filter
                </Button>
              </Space>
            </div>
          ),
          filteredValue: null,
          onFilter: function(value, record) {
            if (record[key]) {
              const textInCell = record[key].toString();
              //if text in cell contains value, return true
              const res = textInCell.match(value) ? true : false;
              return res;
            } else {
              return "";
            }
          },
          filterIcon: function(filtered) {
            return (
              <FilterOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
              />
            );
          },
          filterMultiple: true,
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
              Data selected: &nbsp;
              <strong>{tableCells.length}</strong> &nbsp;
            </p>
            <Button onClick={clearSelectedDataHandler}>Reset</Button>
            <Table
              style={{
                width: "100%",
                height: props.height - 160,
              }}
              dataSource={tableCells}
              pagination={false}
              columns={tableHeaders}
              onChange={function(filters, extra) {
                //only trigered when filters are changed
                let searchedColumn = null;
                let searchText = null;
                Object.keys(filters).forEach(function(key) {
                  if (filters[key]) {
                    searchedColumn = key;
                    searchText = filters[key][0]; //get the content of an array
                  }
                });
                if (searchedColumn && searchText) {
                  onTableChangeHandler(searchedColumn, searchText, extra);
                }
              }}
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
