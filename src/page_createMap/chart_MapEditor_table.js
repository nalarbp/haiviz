/* ============================================================================
============================================================================ */
import React, { useState, useEffect } from "react";
import { Table } from "antd";

const MapEditorTableViewer = (props) => {
  const tableHeaders = ["name", "x", "y"].map((key) => ({
    key: key,
    dataIndex: key,
    title: key,
  }));

  const tableData = props.data.map((d, idx) => {
    return {
      key: idx,
      name: d.name,
      x: d.x,
      y: d.y,
    };
  });

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

export default MapEditorTableViewer;
