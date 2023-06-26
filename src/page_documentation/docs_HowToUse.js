/* ============================================================================
============================================================================ */
import React from "react";
import { Typography } from "antd";
import "./style_Documentation.css";

const { Title } = Typography;

const HowToUse = () => {
  return (
    <React.Fragment>
      <div className="haiviz-docs-content">
        <Title level={2}>Updated soon</Title>
      </div>
    </React.Fragment>
  );
};

export default HowToUse;

/*
<Paragraph>
  The following tasks are only the few examples how HAIviz might help
  visualize your outbreak data.
</Paragraph>
<Divider />

<Title level={3}>How the isolates was spread over time </Title>
<ul>
  <li>Open map, timeline</li>
  <li>Play animation</li>
</ul>
<Divider />

<Title level={3}>
  Are isolates collected from patients who shared ward are genetically
  close?{" "}
</Title>
<ul>
  <li>Open movement chart, tree</li>
  <li>Overlay sample collection to gantt chart</li>
  <li>Select isolate from patient marked as overlapping </li>
  <li>Look their position on the tree </li>
  <li>
    If they close, good indication that transmission may be occured{" "}
  </li>
</ul>
<Divider />

<Title level={3}>Phylogenetic tree </Title>
<Divider />

<Title level={3}>Transmission graph</Title>
<Divider />

<Title level={3}>Movement table</Title>
<Divider />
*/
