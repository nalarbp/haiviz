import { range } from "d3-array";
import { scaleOrdinal, scalePoint, scaleBand } from "d3-scale";

const d3Grid = () => {
  var mode = "equal",
    layout = _distributeEqually,
    x = scaleOrdinal(),
    y = scaleOrdinal(),
    size = [1, 1],
    actualSize = [0, 0],
    nodeSize = false,
    bands = false,
    padding = [0, 0],
    cols,
    rows;

  function grid(nodes) {
    return layout(nodes);
  }

  function _distributeEqually(nodes) {
    var i = -1,
      n = nodes.length,
      _cols = cols ? cols : 0,
      _rows = rows ? rows : 0,
      col,
      row;

    if (_rows && !_cols) {
      _cols = Math.ceil(n / _rows);
    } else {
      _cols || (_cols = Math.ceil(Math.sqrt(n)));
      _rows || (_rows = Math.ceil(n / _cols));
    }

    if (nodeSize) {
      x.domain(range(_cols)).range(
        range(0, (size[0] + padding[0]) * _cols, size[0] + padding[0])
      );
      y.domain(range(_rows)).range(
        range(0, (size[1] + padding[1]) * _rows, size[1] + padding[1])
      );
      actualSize[0] = bands ? x(_cols - 1) + size[0] : x(_cols - 1);
      actualSize[1] = bands ? y(_rows - 1) + size[1] : y(_rows - 1);
    } else if (bands) {
      var x = scaleBand();
      var y = scaleBand();
      x.domain(range(_cols)).range([0, size[0]], padding[0], 0);
      y.domain(range(_rows)).range([0, size[1]], padding[1], 0);
      actualSize[0] = x.bandwidth() - 10;
      actualSize[1] = y.bandwidth() - 10;
    } else {
      var x = scalePoint();
      var y = scalePoint();
      x.domain(range(_cols)).range([0, size[0]]);
      y.domain(range(_rows)).range([0, size[1]]);
      actualSize[0] = x(1);
      actualSize[1] = y(1);
    }

    while (++i < n) {
      col = i % _cols;
      row = Math.floor(i / _cols);
      nodes[i].x = x(col);
      nodes[i].y = y(row);
    }

    return nodes;
  }

  grid.size = function(value) {
    if (!arguments.length) return nodeSize ? actualSize : size;
    actualSize = [0, 0];
    nodeSize = (size = value) == null;
    return grid;
  };

  grid.nodeSize = function(value) {
    if (!arguments.length) return nodeSize ? size : actualSize;
    actualSize = [0, 0];
    nodeSize = (size = value) != null;
    return grid;
  };

  grid.rows = function(value) {
    if (!arguments.length) return rows;
    rows = value;
    return grid;
  };

  grid.cols = function(value) {
    if (!arguments.length) return cols;
    cols = value;
    return grid;
  };

  grid.bands = function() {
    bands = true;
    return grid;
  };

  grid.points = function() {
    bands = false;
    return grid;
  };

  grid.padding = function(value) {
    if (!arguments.length) return padding;
    padding = value;
    return grid;
  };

  return grid;
};

export default d3Grid;
