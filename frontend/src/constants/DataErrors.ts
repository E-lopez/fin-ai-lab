const DataErrors = new Map()

DataErrors
.set('DUPLICATED_COMPANY', 'Ya existe una empresa con el mismo nombre.')
.set('COMPANY_ID_MISSING', 'Crea una compañía para subir documentos!.')
.set('LINK_EXISTS', 'El usuario ya está vinculado a una organización.');

export default DataErrors;
