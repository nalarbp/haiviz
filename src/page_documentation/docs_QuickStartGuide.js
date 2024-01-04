import React, { useState } from "react";
import { Typography, Row, Col, Button } from "antd";
import { pdfjs, Document, Page } from "react-pdf";
import { quickStartGuideFile } from "../utils/constants";

import "./style_Documentation.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Title, Text } = Typography;

const QuickStartGuide = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>Quick Start Guide</Title>
        <Text>
          Download HAIviz quick start guide{" "}
          <a href={quickStartGuideFile}>here</a>.
        </Text>

        <Row align="left" style={{ margin: "10px 0px" }}>
          <Col xs={24}>
            <p>
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>
          </Col>

          <Col xs={24}>
            <Button
              style={{ marginRight: "10px" }}
              type="primary"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Previous
            </Button>

            <Button
              type="primary"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
            </Button>
          </Col>
        </Row>

        <Row id="haiviz-docs-pdf">
          <Document
            file={quickStartGuideFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default QuickStartGuide;
