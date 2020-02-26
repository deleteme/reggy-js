//const maxVisibleMatches;
// add a single character match
// if visible? repeat.
// else return count.

const CHARACTER_WIDTH = 15;
const LINE_HEIGHT = 26;
// calculate number of columns and rows
// columns: Math.round(areaHeight / characterWidth)
// rows: Math.ceil(areaHeight / lineHeight)
// count the characters: columns * rows
//const linesInArea = { firstLine, lastLine };
// scrollPercentage: Math.abs(scrollTop) / areaHeight
// firstLine: scrollPercentage * rows
// lastLine: firstLine + rows

// virtualContent: detect if character is within linesInArea
// virtualScroll: will always be less than the height of a line or two
// virtualScroll: scrollTop - (firstLine * lineHeight)?
export const measurePreviewArea = ({ getState, dispatch }) => {
  const element = document.getElementById('preview-interior');
  dispatch({
    type: 'MEASURE_PREVIEW',
    areaHeight: element.offsetHeight,
    areaWidth: element.offsetWidth
  });
};

const derive = (areaHeight, areaWidth, scrollTop) => {
  const columns = Math.round(areaWidth / CHARACTER_WIDTH);
  const rows = Math.ceil(areaHeight / LINE_HEIGHT);
  const scrollPercentage = Math.abs(scrollTop) / areaHeight;
  const firstLine = Math.round(scrollPercentage * rows);
  const lastLine = firstLine + rows;
  return {
    columns,
    rows,
    firstLine,
    lastLine
  };
};
