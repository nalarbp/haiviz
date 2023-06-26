/* ============================================================================
============================================================================ */
import React, { useState } from "react";
import { color } from "d3-color";
import { ExportToCsv } from "export-to-csv";
import { Button, Select, Drawer, Row, Col } from "antd";
import { dateToStringIS08601 } from "../utils/utils";
const { Option } = Select;

const DataTableSettings = (props) => {
  const [downloadFormat, setdownloadFormat] = useState("HAIviz");

  //HANDLERS
  const downloadTableHandler = () => {
    createCSVObject(props.isolateData, props.selectedData);
  };

  const changeTableFormatHandler = (val) => {
    setdownloadFormat(val);
  };

  function createCSVObject(isolateData, selectedData) {
    let csvObj = isolateData.map((d) => {
      return {
        isolate_name: d.isolate_name,
        isolate_species: d.isolate_species,
        isolate_sourceType: d.isolate_sourceType,
        isolate_sourceName: d.isolate_sourceName,
        isolate_colDate: dateToStringIS08601(d.isolate_colDate),
        isolate_colLocation: d.isolate_colLocation,
        profile_1: d.profile_1,
        profile_2: d.profile_2,
        profile_3: d.profile_3,
        "isolate_species:color": color(
          props.colorScale.bySpecies.get(d.isolate_species)
        ).formatHex(),
        "isolate_sourceType:color": color(
          props.colorScale.bySourceType.get(d.isolate_sourceType)
        ).formatHex(),
        "isolate_colLocation:color": color(
          props.colorScale.byLocation.get(d.isolate_colLocation)
        ).formatHex(),
        "profile_1:color": color(
          props.colorScale.byProfile1.get(d.profile_1)
        ).formatHex(),
        "profile_2:color": color(
          props.colorScale.byProfile2.get(d.profile_2)
        ).formatHex(),
        "profile_3:color": color(
          props.colorScale.byProfile3.get(d.profile_3)
        ).formatHex(),
      };
    });
    //filter by selected data
    if (selectedData && selectedData.length > 0) {
      csvObj = csvObj.filter(
        (d) => selectedData.indexOf(d.isolate_name) !== -1
      );
    }

    if (csvObj) {
      const options = {
        fieldSeparator: ",",
        filename: "IsolateData_HAIviz",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };
      const csvExporter = new ExportToCsv(options);
      csvExporter.generateCsv(csvObj);
    }
  }

  return (
    <React.Fragment>
      <Drawer
        title="Table settings"
        placement="right"
        closable={true}
        onClose={props.closeDrawerHandler}
        visible={props.isDrawerVisible}
        getContainer={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p>Table format </p>
            <Select
              style={{ width: "100%" }}
              placeholder={downloadFormat}
              onChange={changeTableFormatHandler}
              value={downloadFormat}
            >
              <Option value="HAIviz">HAIviz</Option>
            </Select>
          </Col>
          <Col span={24}>
            <Button onClick={downloadTableHandler}>
              Download table (.csv)
            </Button>
          </Col>
        </Row>
      </Drawer>
    </React.Fragment>
  );
};

export default DataTableSettings;
