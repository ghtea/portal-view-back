

export const returnStringFromNumber = (number, lengthInt) => {
	
  let string = number.toString();
  
  const spaceRemaining = lengthInt - string.length;
  
  if (lengthInt > 0) {
    for (var i = 0; i < spaceRemaining; i++){
    	string = '0' + string;
    }
  }
  
  return string;
}