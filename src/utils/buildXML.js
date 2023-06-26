const buildHAIvizXML = (SVGnode, locationsObj) => {
  let header =
    '<?xml version="1.0" encoding="utf-8"?><haivizmap><mapsvg></mapsvg><mapdata></mapdata></haivizmap>';
  //let text = "<haivimap><mapsvg></mapsvg><mapdata></mapdata></haivimap>";

  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(header, "application/xml");

  //append svg map
  xmlDoc.getElementsByTagName("mapsvg")[0].appendChild(SVGnode);

  locationsObj.forEach(d => {
    let newLoc = xmlDoc.createElement("location");
    newLoc.setAttribute("name", d.name);
    newLoc.setAttribute("x", d.x);
    newLoc.setAttribute("y", d.y);
    xmlDoc.getElementsByTagName("mapdata")[0].appendChild(newLoc);
  });

  //Serialize it
  let XMLS = new XMLSerializer();
  let serializedXML = XMLS.serializeToString(xmlDoc);
  return serializedXML;
};

export default buildHAIvizXML;
