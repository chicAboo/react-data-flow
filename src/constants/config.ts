/**
 * @author ChicAboo
 * @date 2020/12/24 3:57 下午
 */

export const canvasWidth = 1920 * 2;
export const canvasHeight = 1080 * 2;

export const controls = ['left', 'right', 'top', 'bottom'];

export const config = {
  grid: {
    strokeColor: '#E2E2F0',
    strokeWidth: 1,
    distance: 20,
    isLineDash: true,
    lineDash: [3, 3],
  },
  arrow: {
    strokeColor: '#ACB1B5',
    strokeColorHover: '#0077FF',
  },
  rect: {
    strokeWidth: 1,
    strokeColor: '#2994FF',
    fill: '#FAFBFC',
    width: 180,
    height: 50,
    distance: 10,
    radius: 4,
    hover: {
      fill: '#E9F3FC',
    },
    delRadius: 10,
  },
  rectText: {
    marginTop: 5,
    fill: '#333',
    fontSize: 14,
  },
  point: {
    radius: 5,
    fill: '#fff',
    stroke: '#2994ff',
  },
  line: {
    strokeWidth: 1,
    strokeColor: '#ACB1B5',
    hover: {
      strokeColor: '#0077FF',
      strokeWidth: 2,
      textFill: '#fff',
    },
  },
  path: {
    middleDistance: 40,
  },
  lineCircle: {
    marginTop: 5,
    fill: '#FAFBFC',
    addStyle: {
      radius: 12,
      fill: '#FAFBFC',
      stroke: '#2994FF',
      textFill: '#2994FF',
      fontSize: 18,
      textAnchor: 'middle',
    },
    cbStyle: {
      radius: 16,
      fill: '#2994FF',
      textFill: '#666',
      stroke: '#D2D5D8',
      fontSize: 14,
      textAnchor: 'middle',
    },
  },
};
