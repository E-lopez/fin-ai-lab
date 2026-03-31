export const validationFeedback = (fieldName: string) => {
  switch(fieldName) {
    case 'userName': return 'Ingresa tu nombre y apellido sin símbolos ni números'
    case 'idNumber': return 'Ingresa máximo 10 números sin símbolos.'
    case 'period': return 'Ingresa el valor en meses, mínimo 1 y máximo 36'
    case 'files': return 'Sube únicamente PDF o imágenes. No debe faltar ningún archivo.'
    case 'email': return 'Ingresa tu correo de esta forma: ejemplo@gmail.com'
    case 'dateOfBirth': return '¡Debes ser mayor de edad!'
    case 'amount': return 'Revisa el valor máximo de tu préstamo.'
    default: return 'Revisa este valor'
  }
}