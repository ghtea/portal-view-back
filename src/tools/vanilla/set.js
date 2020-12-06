

// https://stackoverflow.com/questions/31128855/comparing-ecma6-sets-for-equality
// https://medium.com/@khwsc1/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-es6-set%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90-9b7294dfba99

export const areEqualSets = (set1, set2) => {
	
  if (set1.size !== set2.size) return false;
    
  for (var a of set1) if (!set2.has(a)) return false;
  
  return true;
  
}


/*
export const isEqual = (set1, set2) => {
	
  return set1.size === set2.size && all(isIn(set2), set1);
  
}


export const all = (pred, set1) => {
	
  for (var a of set1) if (!pred(a)) return false;
  return true;
    
}


export const isIn = (set1) => {
	
  return function (a) {
      return set1.has(a);
  };
  
}
*/