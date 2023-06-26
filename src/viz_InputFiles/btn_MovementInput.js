import React, { useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { Card, Empty, Spin, Upload } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { MovementInputSVG } from "../utils/customIcons";

import Moment from "moment";
import { extendMoment } from "moment-range";
import { color } from "d3-color";

const moment = extendMoment(Moment);
const { Dragger } = Upload;

//props.movementData, loadMovementData

const MovementInput = (props) => {
  const [isLoading, setisLoading] = useState(false);

  //functions
  async function parseMovement(fileURL) {
    let data_promise = await csv(fileURL).then(function(result) {
      return result;
    });
    //Validation runs here
    // headers
    const validHeaders = [
      "source_name",
      "location_name",
      "start_date",
      "end_date",
    ];
    const inputHeaders = Object.keys(data_promise[0]);
    let header_is_valid = true;
    validHeaders.forEach((item) => {
      if (inputHeaders.indexOf(item) === -1) {
        header_is_valid = false;
      }
    });

    if (!header_is_valid) {
      setisLoading(false);
      alert("Invalid headers");
      return;
    }

    // no empty record or invalid format on start and end date
    let date_invalid = false;
    data_promise.forEach(function(d) {
      if (moment(d.start_date) && moment(d.end_date)) {
        d.start_date = moment(d.start_date);
        d.end_date = moment(d.end_date);
      } else if (d.location_color) {
        //console.log(color(d.location_color));
        d.location_color = color(d.location_color);
      } else if (parseInt(d.source_name.isInteger())) {
        d.source_name = parseInt(d.source_name);
      } else {
        date_invalid = true;
      }
    });

    if (date_invalid) {
      setisLoading(false);
      alert("Invalid data: wrong date format in column start or end date");
      return;
    }

    //check adm and discharge column
    data_promise.forEach(function(d) {
      if (d["is_admDisc"]) {
        d["is_admDisc"] = d["is_admDisc"] == "y" ? true : false;
      } else {
        d["is_admDisc"] = false;
      }
    });

    data_promise.sort((a, b) => a.source_name - b.source_name);

    props.loadMovementData(data_promise);
  }

  const beforeUploadHandler = (file) => {
    setisLoading(true);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(evt) {
        const dataUrl = evt.target.result;
        parseMovement(dataUrl);
      };
    }
  };

  useEffect(() => {
    if (props.movementData) {
      setisLoading(false);
    }
  }, [props.movementData]);

  return (
    <React.Fragment>
      <Card
        title={"Movement data"}
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
        {props.isolateData && !isLoading && !props.movementData && (
          <React.Fragment>
            <Dragger
              accept={".csv"}
              style={{ padding: "10px" }}
              name="file"
              multiple={false}
              action="dummy-post"
              beforeUpload={beforeUploadHandler}
            >
              <h1>
                <MovementInputSVG />
              </h1>
            </Dragger>
          </React.Fragment>
        )}
        {props.isolateData && isLoading && !props.movementData && <Spin />}
        {props.isolateData && !isLoading && props.movementData && (
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
export default MovementInput;
