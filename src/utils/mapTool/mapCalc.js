import { area, polygon } from "@turf/turf";
const WKT = require("terraformer-wkt-parser");

// 计算wkt面积
export const calcAreaByWkt = (frameWkt) => {
  let areaNum = area(polygon(WKT.parse(frameWkt).coordinates));
  let unit = '平方公里'
  areaNum *= 0.000001
  return {
    areaNum: areaNum.toFixed(2),
    unit
  }
};
