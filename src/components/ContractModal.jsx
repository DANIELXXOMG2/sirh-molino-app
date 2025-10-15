import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import './ContractModal.css';

const ContractModal = ({ employeeId, contract, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    TIPO_CONTRATO: '',
    FECHA_INICIO: '',
    FECHA_FIN: '',
    SALARIO: '',
    ESTADO: 'activo',
    DESCRIPCION: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contract) {
      setFormData({
        TIPO_CONTRATO: contract.TIPO_CONTRATO || '',
        FECHA_INICIO: contract.FECHA_INICIO || '',
        FECHA_FIN: contract.FECHA_FIN || '',
        SALARIO: contract.SALARIO || '',
        ESTADO: contract.ESTADO || 'activo',
        DESCRIPCION: contract.DESCRIPCION || ''
      });
    }
  }, [contract]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.TIPO_CONTRATO.trim()) {
      setError('El tipo de contrato es obligatorio');
      return false;
    }
    if (!formData.FECHA_INICIO) {
      setError('La fecha de inicio es obligatoria');
      return false;
    }
    if (formData.FECHA_FIN && formData.FECHA_INICIO > formData.FECHA_FIN) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }
    if (formData.SALARIO && parseFloat(formData.SALARIO) <= 0) {
      setError('El salario debe ser mayor a 0');
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
      // Preparar datos limpios
      const dataToSave = {
        ...formData,
        SALARIO: formData.SALARIO ? parseFloat(formData.SALARIO) : null,
        updatedAt: new Date().toISOString()
      };

      // Referencia a la subcolección de contratos
      const contractsRef = collection(db, 'employees', employeeId, 'contracts');

      if (contract?.id) {
        // Actualizar contrato existente
        const contractRef = doc(db, 'employees', employeeId, 'contracts', contract.id);
        await updateDoc(contractRef, dataToSave);
        toast.success('✅ Contrato actualizado exitosamente');
      } else {
        // Crear nuevo contrato
        dataToSave.createdAt = new Date().toISOString();
        await addDoc(contractsRef, dataToSave);
        toast.success('✅ Contrato creado exitosamente');
      }

      onSave();
    } catch (err) {
      console.error('Error al guardar contrato:', err);
      setError('Error al guardar el contrato. Por favor, intenta de nuevo.');
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
          <h2>{contract ? 'Editar Contrato' : 'Nuevo Contrato'}</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSave} className="contract-form">
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="TIPO_CONTRATO">
                Tipo de Contrato <span className="required">*</span>
              </label>
              <select
                id="TIPO_CONTRATO"
                name="TIPO_CONTRATO"
                value={formData.TIPO_CONTRATO}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Indefinido">Indefinido</option>
                <option value="Fijo">Fijo</option>
                <option value="Obra o Labor">Obra o Labor</option>
                <option value="Prestación de Servicios">Prestación de Servicios</option>
                <option value="Aprendizaje">Aprendizaje</option>
                <option value="Temporal">Temporal</option>
              </select>
            </div>

            <div className="form-group">
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
                <option value="finalizado">Finalizado</option>
                <option value="suspendido">Suspendido</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="FECHA_INICIO">
                Fecha de Inicio <span className="required">*</span>
              </label>
              <input
                type="date"
                id="FECHA_INICIO"
                name="FECHA_INICIO"
                value={formData.FECHA_INICIO}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="FECHA_FIN">Fecha de Fin</label>
              <input
                type="date"
                id="FECHA_FIN"
                name="FECHA_FIN"
                value={formData.FECHA_FIN}
                onChange={handleChange}
                disabled={loading}
              />
              <small className="field-hint">
                Dejar vacío para contratos indefinidos
              </small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="SALARIO">Salario (COP)</label>
              <input
                type="number"
                id="SALARIO"
                name="SALARIO"
                value={formData.SALARIO}
                onChange={handleChange}
                placeholder="Ej: 2500000"
                min="0"
                step="1000"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="DESCRIPCION">Descripción</label>
              <textarea
                id="DESCRIPCION"
                name="DESCRIPCION"
                value={formData.DESCRIPCION}
                onChange={handleChange}
                placeholder="Detalles adicionales del contrato..."
                rows="4"
                disabled={loading}
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
              {loading ? 'Guardando...' : contract ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractModal;
