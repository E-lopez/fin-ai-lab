export interface UserInit {
  userData: {
    userName: string,
    idNumber: string,
    email: string,
    dateOfBirth: string,
    gender: 'M'|'F'|'Otro',
    occupation: string    
  },
  scoringData: {
    [key: string]: {
      [key: string]: string | number
    }
  }
}