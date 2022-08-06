export default class Convert {
  radiansToDegree(radians: number) {
    return radians / (Math.PI / 180);
  }

  degreeToRadians(degree: number) {
    return degree * (Math.PI / 180);
  }

  getVectorSize = (vectorSize: number, angle: number) => {
    return {
      x: vectorSize * Math.cos(this.degreeToRadians(angle)),
      y: vectorSize * Math.sin(this.degreeToRadians(angle)),
    };
  };
}
