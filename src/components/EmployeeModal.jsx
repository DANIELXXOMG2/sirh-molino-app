import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import './EmployeeModal.css';

const EmployeeModal = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    NRO_DOCUMENTO: '',
    NOMBRE: '',
    APELLIDO: '',
    EDAD: '',
    GENERO: '',
    CARGO: '',
    CORREO: '',
    NRO_CONTACTO: '',
    ESTADO: 'activo',
    OBSERVACIONES: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        NRO_DOCUMENTO: employee.NRO_DOCUMENTO || '',
        NOMBRE: employee.NOMBRE || '',
        APELLIDO: employee.APELLIDO || '',
        EDAD: employee.EDAD || '',
        GENERO: employee.GENERO || '',
        CARGO: employee.CARGO || '',
        CORREO: employee.CORREO || '',
        NRO_CONTACTO: employee.NRO_CONTACTO || '',
        ESTADO: employee.ESTADO || 'activo',
        OBSERVACIONES: employee.OBSERVACIONES || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.NOMBRE.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.APELLIDO.trim()) {
      setError('El apellido es obligatorio');
      return false;
    }
    if (!formData.NRO_DOCUMENTO.trim()) {
      setError('El número de documento es obligatorio');
      return false;
    }
    if (formData.CORREO && !formData.CORREO.includes('@')) {
      setError('El correo electrónico no es válido');
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Validación de documento duplicado solo para nuevos empleados
      if (!employee?.id) {
        const employeesRef = collection(db, 'employees');
        const q = query(
          employeesRef, 
          where('NRO_DOCUMENTO', '==', formData.NRO_DOCUMENTO.trim())
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setError(`El número de documento ${formData.NRO_DOCUMENTO} ya está registrado en el sistema.`);
          setLoading(false);
          return;
        }
      }

      // Preparar datos limpios
      const dataToSave = {
        ...formData,
        EDAD: formData.EDAD ? parseInt(formData.EDAD) : null,
        updatedAt: new Date().toISOString()
      };

      if (employee?.id) {
        // Actualizar empleado existente
        const employeeRef = doc(db, 'employees', employee.id);
        await updateDoc(employeeRef, dataToSave);
        alert('Empleado actualizado exitosamente');
      } else {
        // Crear nuevo empleado
        dataToSave.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'employees'), dataToSave);
        alert('Empleado creado exitosamente');
      }

      onSave();
    } catch (err) {
      console.error('Error al guardar empleado:', err);
      setError('Error al guardar el empleado. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{employee ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSave} className="employee-form">
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="NRO_DOCUMENTO">
                Nro. Documento <span className="required">*</span>
              </label>
              <input
                type="text"
                id="NRO_DOCUMENTO"
                name="NRO_DOCUMENTO"
                value={formData.NRO_DOCUMENTO}
                onChange={handleChange}
                placeholder="Ej: 12345678"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="NOMBRE">
                Nombre <span className="required">*</span>
              </label>
              <input
                type="text"
                id="NOMBRE"
                name="NOMBRE"
                value={formData.NOMBRE}
                onChange={handleChange}
                placeholder="Ej: Juan"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="APELLIDO">
                Apellido <span className="required">*</span>
              </label>
              <input
                type="text"
                id="APELLIDO"
                name="APELLIDO"
                value={formData.APELLIDO}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="EDAD">Edad</label>
              <input
                type="number"
                id="EDAD"
                name="EDAD"
                value={formData.EDAD}
                onChange={handleChange}
                placeholder="Ej: 30"
                min="18"
                max="100"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="GENERO">Género</label>
              <select
                id="GENERO"
                name="GENERO"
                value={formData.GENERO}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="CARGO">Cargo</label>
              <input
                type="text"
                id="CARGO"
                name="CARGO"
                value={formData.CARGO}
                onChange={handleChange}
                placeholder="Ej: Desarrollador"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="CORREO">Correo Electrónico</label>
              <input
                type="email"
                id="CORREO"
                name="CORREO"
                value={formData.CORREO}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="NRO_CONTACTO">Nro. Contacto</label>
              <input
                type="tel"
                id="NRO_CONTACTO"
                name="NRO_CONTACTO"
                value={formData.NRO_CONTACTO}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="ESTADO">
                Estado <span className="required">*</span>
              </label>
              <select
                id="ESTADO"
                name="ESTADO"
                value={formData.ESTADO}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="activo">Activo</option>
                <option value="retirado">Retirado</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="OBSERVACIONES">Observaciones</label>
              <textarea
                id="OBSERVACIONES"
                name="OBSERVACIONES"
                value={formData.OBSERVACIONES}
                onChange={handleChange}
                placeholder="Ingrese cualquier observación o nota relevante sobre el empleado..."
                rows="4"
                disabled={loading}
                className="textarea-observaciones"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Guardando...' : employee ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
