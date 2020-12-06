export const toggleArrayElement = (array, value, true_false) => {
    let index = array.indexOf(value);
		
		if (true_false) { // value should exist in array now
	    if (index === -1) {
	        array.push(value);
	    } else {}
		}
		else { // value should not exist in array now
	    if (index === -1) {} 
	    else {
	        array.splice(index, 1);
	    }
		}
    
    return array;
}

// https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array/38571132#38571132
export const getRandomSubArray = (arr, n) => {
  let result = new Array(n);
  
  let len = arr.length;
  let taken = new Array(len);
      
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}