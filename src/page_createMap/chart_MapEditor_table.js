import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadLocationsMapEditor } from "../action/mapEditor_actions";
import { v1 as uuidv1 } from "uuid";

const MapEditorTableViewer = (props) => {
  let initialTableData = props.mapEditorLocations
    ? props.mapEditorLocations
    : [];
  const [tableData, setTableData] = useState(initialTableData);

  const tableHeaders = ["name", "x", "y"].map((k, idx) => ({
    //set key to unique value using uuid
    key: uuidv1(),
    dataIndex: k,
    title: k,
  }));

  console.log(tableHeaders);

  useEffect(() => {
    if (props.mapEditorLocations) {
      let tableData = props.mapEditorLocations.map((d, idx) => {
        return {
          key: idx,
          name: d.name,
          x: d.x,
          y: d.y,
        };
      });
      setTableData(tableData);
    }
  }, [props.mapEditorLocations]);

  return (
    <React.Fragment>
      <Table
        style={{ width: "100%", height: "100%" }}
        width={"data"}
        dataSource={tableData}
        pagination={{ pageSize: 5 }}
        columns={tableHeaders}
      />
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return {
    mapEditorLocations: state.mapEditor.locationData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadLocationsMapEditor,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapEditorTableViewer);
