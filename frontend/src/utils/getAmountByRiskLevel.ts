export default function getAmountByRiskLevel(level: number) {
  if(!level) return 0.0;
  const parsedNumber = Number(level);

  let res;    
  switch(true) { 
    case parsedNumber > 90 && parsedNumber <= 100:
      res = 10000000;
      break;  
    case parsedNumber > 80 && parsedNumber <= 90:
      res = 7000000;
      break;
    case parsedNumber > 70 && parsedNumber <= 80:
      res = 4000000;
      break; 
    case parsedNumber > 60 && parsedNumber <= 70:
      res = 1500000;
      break;
    case parsedNumber <= 60:
      res = 0;
      break;
    default:
      res = 0;
      break;  
  }
  return res;
}