

export const blendColor = (ZeroToOne, rgbStart, rgbEnd) => {

  const wStart = 1 - ZeroToOne;
  const wEnd = ZeroToOne;

  const rgb = [
  	
  	Math.round(rgbStart[0] * wStart + rgbEnd[0] * wEnd)
    , Math.round(rgbStart[1] * wStart + rgbEnd[1] * wEnd)
    ,  Math.round(rgbStart[2] * wStart + rgbEnd[2] * wEnd)
    
  ];
      
  return rgb;
};