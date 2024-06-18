import React from "react";
const svgString = `
<svg 
   viewBox="0 0 400 400.00001"
   id="svg2"
   version="1.1"
   >
  <defs
     id="defs4" />

  <metadata
     id="metadata7">
  </metadata>
  <g
     id="layer1"
     transform="translate(0,-652.36216)">
    <path
       style="opacity:1;fill-opacity:1;stroke:none;stroke-width:1;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
       d="m 0,652.36212 0,116 116,0 0,-116 -116,0 z m 141,0 0,116 116,0 0,-116 -116,0 z m 141,0 0,116 118,0 0,-116 -118,0 z m -282,141 0,116 116,0 0,-116 -116,0 z m 141,0 0,116 116,0 0,-116 -116,0 z m 141,0 0,116 118,0 0,-116 -118,0 z m -282,141 0,118.00008 116,0 0,-118.00008 -116,0 z m 141,0 0,118.00008 116,0 0,-118.00008 -116,0 z m 141,0 0,118.00008 118,0 0,-118.00008 -118,0 z"
       id="rect23362"
       />
  </g>
</svg>
`;

const dashboard = (props) => {
  return <div {...props} dangerouslySetInnerHTML={{ __html: svgString }} />;
};

export default dashboard;