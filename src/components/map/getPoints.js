export function quadraticBezierCurve(p1, p2, controlPoint, numPoints = 100) {
  const points = [];
  const step = 1 / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const t = i * step;
    const x =
      (1 - t) ** 2 * p1[0] +
      2 * (1 - t) * t * controlPoint[0] +
      t ** 2 * p2[0];
    const y =
      (1 - t) ** 2 * p1[1] +
      2 * (1 - t) * t * controlPoint[1] +
      t ** 2 * p2[1];
    points.push({ latitude: x, longitude: y });
  }
  return points;
}

const calculateControlPoint = (p1, p2) => {
    const d = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
    if (d === 0) {return [p1[0], p1[1]];}

    const scale = 1;
    const h = d * scale;
    const w = d / 2;
    const x_m = (p1[0] + p2[0]) / 2;
    const y_m = (p1[1] + p2[1]) / 2;

    const x_c = x_m + ((h * (p2[1] - p1[1])) / (2 * d)) * (w / d);
    const y_c = y_m + ((h * (p2[0] - p1[0])) / (2 * d)) * (w / d);

    return [x_c, y_c];
};


export const getPoints = (places) => {
  if (
    !Array.isArray(places) ||
    places.length < 2 ||
    !places[0] ||
    !places[1] ||
    typeof places[0].latitude !== 'number' ||
    typeof places[0].longitude !== 'number' ||
    typeof places[1].latitude !== 'number' ||
    typeof places[1].longitude !== 'number'
  ) {
    return [];
  }

  const p1 = [places[0].latitude, places[0].longitude];
  const p2 = [places[1].latitude, places[1].longitude];
  const controlPoint = calculateControlPoint(p1, p2);

  return quadraticBezierCurve(p1, p2, controlPoint, 100);
};
