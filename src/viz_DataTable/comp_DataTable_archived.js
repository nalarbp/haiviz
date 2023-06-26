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
  SearchOutlined,
} from "@ant-design/icons";
import { dateToStringIS08601, getIsolateDataHeader } from "../utils/utils";
//import { ExportToCsv } from "export-to-csv";

import withMeasure from "../hocs/withMeasure";

const moment = require("moment");
const dimensions = ["width", "height"];
const _ = require("lodash");

const DataTable = (props) => {
  const [isDrawerVisible, setisDrawerVisible] = useState(false);
  const [dataTable, setdataTable] = useState(null);
  const isolateData = _.cloneDeep(Array.from(props.data.values()));
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {}, [searchText, searchedColumn]);

  useEffect(() => {
    if (props.data && !props.selectedData) {
      const headersUnfiltered = Object.keys(isolateData[0]).map((key) => ({
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
              placeholder={`Search ${key}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                setSearchText(selectedKeys[0]);
                setSearchedColumn(key);
              }}
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  confirm();
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(key);
                  //console.log("search");
                }}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                  setSearchText("");
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        onFilter: (value, record) =>
          record[key]
            ? record[key]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            : "",
        //sorter: (a, b) => (a[key] > b[key]) - (a[key] < b[key]),
        //sortDirections: ["descend"],
        filterIcon: <SearchOutlined style={{ color: "black" }} />,
      }));
      const headers = headersUnfiltered.filter((d) => {
        return d.key !== "uid";
      });

      const cells = isolateData.map((d, idx) => {
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
      setdataTable({ headers: headers, cells: cells });
    } else if (props.data && props.selectedData) {
      const headersUnfiltered = Object.keys(isolateData[0]).map((key) => ({
        key: key,
        dataIndex: key,
        title: getIsolateDataHeader(key),
      }));
      const headers = headersUnfiltered.filter((d) => {
        return d.key !== "uid";
      });

      let cells = isolateData.map((d, idx) => {
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
        let filtered_cells = cells.filter((d) => {
          return props.selectedData.indexOf(d.isolate_name) !== -1;
        });
        setdataTable({ headers: headers, cells: filtered_cells });
      } else {
        setdataTable({ headers: headers, cells: cells });
      }
    }
  }, [props.data, props.selectedData]);

  //HANDLERS
  const onCloseHandler = () => {
    props.deactivateChart(props.id);
  };

  const clearSelectedDataHandler = () => {
    props.setSelectedData([]);
  };
  const openDrawerHandler = () => {
    setisDrawerVisible(true);
  };
  const closeDrawerHandler = () => {
    setisDrawerVisible(false);
  };

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
          <Row style={{ margin: "20px" }}>
            <Skeleton active />
          </Row>
        )}
        {dataTable && (
          <Row style={{ margin: "20px", overflowY: "auto" }}>
            <p style={{ marginLeft: "10px" }}>
              Number of displayed data: &nbsp;
              <strong>{dataTable.cells.length}</strong> &nbsp;
            </p>
            <Button onClick={clearSelectedDataHandler}>Clear selection</Button>
            <Table
              style={{ width: "100%", height: "100%" }}
              dataSource={dataTable.cells}
              pagination={{ pageSize: 5 }}
              columns={dataTable.headers}
            />
          </Row>
        )}
      </Card>
    </React.Fragment>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    data: state.isolateData,
    selectedData: state.selectedData,
    colorScale: state.colorScale,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
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
