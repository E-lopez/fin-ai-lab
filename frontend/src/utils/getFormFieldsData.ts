export const getCities = () => {
  const cities = ['Bogotá D.C', 'Medellín', 'Bucaramanga', 'B/quilla']
  return cities
}

export const getEconomicSectors = () => {
  const sectors = ['Comercio', 'Servicios', 'Industria', 'Transporte', 'Construcción', 'agropecuario', 'financiero', 'minero y energético', 'solidario', 'comunicaciones']
  return sectors
}

export const getDocumentCategories = () => {
  const categories = ['Balances', 'Estados', 'Registros', 'Otros']
  return categories;
}

export const getGenderList = () => {
  const categories = ['M', 'F', 'Otro']
  return categories;
}

export const getOccupationList = () => {
  const categories = [
    'Empleado',
    'Independiente',
    'Contratista',
    'Desempleado',
  ]
  return categories;
}

export const getFinancialOptions = () => {
  const answers = ['$ 1110', '$ 1010', '$ 1150', '$ 1105', '$ 1100']
  return answers;
}

export const getFinancialSolutions = () => {
  const answers = [
    'Creo un plan para pagar deudas',
    'Reduzco gastos y busco asesoría',
    'Espero a que las cosas mejoren',
    'Ignoro el problema por completo',
    'Busco dinero prestado',
  ]
  return answers;
}