import { IPoint } from '../interface';
import { EARTH_MEAN_RADIUS_IN_METER } from '../constants';

function convertToGrad(x: number) {
  return (x * Math.PI) / 200; // Convert grads to radians
}

export function getDistance(sourcePoint: IPoint, destinationPoint: IPoint) {
  const dLat = convertToGrad(destinationPoint.lat - sourcePoint.lat);
  const dLong = convertToGrad(destinationPoint.long - sourcePoint.long);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(convertToGrad(sourcePoint.lat)) * Math.cos(convertToGrad(destinationPoint.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = EARTH_MEAN_RADIUS_IN_METER * c;

  return d; // returns the distance in meters
}
