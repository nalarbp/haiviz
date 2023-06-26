/* ============================================================================
============================================================================ */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deactivateChart, setSelectedData } from "../action/index";
import { Row, Col, Card, Button, Table, Skeleton, Input, Space } from "antd";
import DataTableSettings from "./comp_DataTable_Settings";
import {
  DragOutlined,
  SettingOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { dateToStringIS08601, getIsolateDataHeader } from "../utils/utils";
//import { ExportToCsv } from "export-to-csv";

import withMeasure from "../hocs/withMeasure";

const dimensions = ["width", "height"];
const _ = require("lodash");

const DataTable = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  const isolateData = _.cloneDeep(Array.from(props.data.values()));
  // const [searchText, setSearchText] = useState(null);
  // const [searchedColumn, setSearchedColumn] = useState(null);
  const dataTable = { headers: null, cells: null };
  const cells =
    isolateData && isolateData[0]
      ? isolateData.map((d, idx) => {
          return {
            key: idx,
            isolate_name: d.isolate_name,
            isolate_species: d.isolate_species,
            isolate_sourceType: d.isolate_sourceType,
            isolate_sourceName: d.isolate_sourceName,
            isolate_colDate: dateToStringIS08601(d.isolate_colDate),
            isolate_colLocation: d.isolate_colLocation,
            profile_1: d.profile_1,
            profile_2: d.profile_2,
            profile_3: d.profile_3,
          };
        })
      : null;
  const [tableCells, setTableCells] = useState(cells);
  const tableHeaders =
    isolateData && isolateData[0] ? createHeaders(isolateData) : null;

  //USE EFFECTS
  useEffect(() => {
    if (props.selectedData) {
      let tableCells = isolateData.map((d, idx) => {
        return {
          key: idx,
          isolate_name: d.isolate_name,
          isolate_species: d.isolate_species,
          isolate_sourceType: d.isolate_sourceType,
          isolate_sourceName: d.isolate_sourceName,
          isolate_colDate: dateToStringIS08601(d.isolate_colDate),
          isolate_colLocation: d.isolate_colLocation,
          profile_1: d.profile_1,
          profile_2: d.profile_2,
          profile_3: d.profile_3,
        };
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

  // useEffect(() => {
  //   if (
  //     searchText &&
  //     searchedColumn &&
  //     searchText !== "" &&
  //     searchedColumn !== ""
  //   ) {
  //     let selectedData = [];
  //     if (searchedColumn === "isolate_colDate") {
  //       let filteredCells = isolateData.filter(function(d) {
  //         return dateToStringIS08601(d[searchedColumn])
  //           .toString()
  //           .toLowerCase()
  //           .includes(searchText.toLowerCase());
  //       });
  //       if (filteredCells) {
  //         selectedData = filteredCells;
  //       }
  //     } else {
  //       let filteredCells = isolateData.filter(function(d) {
  //         return d[searchedColumn]
  //           .toString()
  //           .toLowerCase()
  //           .includes(searchText.toLowerCase());
  //       });
  //       if (filteredCells) {
  //         selectedData = filteredCells;
  //       }
  //     }
  //     let filteredIsolateNames =
  //       selectedData && selectedData.length > 0
  //         ? selectedData.map((d) => d.isolate_name)
  //         : [];
  //     props.setSelectedData(filteredIsolateNames);
  //   } else if (searchText === "" || searchedColumn === "") {
  //     props.setSelectedData([]);
  //   }
  // }, [searchText, searchedColumn]);

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
            let record = dateToStringIS08601(d[searchedColumn]).toString();
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
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };

  //Util functions
  function createHeaders(isolateData) {
    let raw_headers = isolateData[0];
    delete raw_headers["uid"];
    let headers = Object.keys(raw_headers).map(function(key) {
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
                // setSearchText(selectedKeys[0]);
                // setSearchedColumn(key);
              }}
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  confirm();
                  // setSearchText(selectedKeys[0]);
                  // setSearchedColumn(key);
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
          const searchTextList = value.split("::");
          if (record[key]) {
            const textInCell = record[key].toString();
            //does text in cell are in the search list? !== -1, yes => true, no => false
            const res =
              searchTextList.indexOf(textInCell) !== -1 ? true : false;
            return res;
          } else {
            return "";
          }
          // return record[key]
          //   ? record[key]
          //       .toString()
          //       .toLowerCase()
          //       .includes(value.toLowerCase())
          //   : "";
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
        title={"Isolates table"}
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
              <Button
                size={"small"}
                style={{ margin: "0 5px", border: "none" }}
                icon={<SettingOutlined />}
                onClick={openDrawerHandler}
              ></Button>
            </Col>
            <Col span={8}>
              {" "}
              <Button
                size={"small"}
                style={{ border: "none" }}
                icon={<CloseOutlined />}
                onClick={onCloseHandler}
              ></Button>
            </Col>
          </Row>
        }
      >
        <div id="movement-drawer-settings">
          <DataTableSettings
            isolateData={isolateData}
            selectedData={props.selectedData}
            colorScale={props.colorScale}
            isDrawerVisible={isDrawerVisible}
            closeDrawerHandler={closeDrawerHandler}
          />
        </div>
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
              Number of selected isolates: &nbsp;
              <strong>{tableCells.length}</strong> &nbsp;
            </p>
            <Button onClick={clearSelectedDataHandler}>Reset</Button>
            <Table
              style={{
                width: "100%",
                height: props.height - 160,
              }}
              dataSource={tableCells}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                pageSizeOptions: "[5]",
              }}
              columns={tableHeaders}
              onChange={function(pagination, filters, sorter, extra) {
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
    colorScale: state.colorScale,
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
//onChange={function(pagination, filters, sorter, extra) {
//   console.log(filters);
// }}
//sorter: (a, b) => (a[key] > b[key]) - (a[key] < b[key]),
//sortDirections: ["descend"],
