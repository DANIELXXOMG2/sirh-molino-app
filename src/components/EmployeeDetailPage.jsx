import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import ContractModal from './ContractModal';
import ExportControls from './ExportControls';
import MusicControlButton from './MusicControlButton';
import './EmployeeDetailPage.css';

const EmployeeDetailPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener datos del empleado
      const employeeRef = doc(db, 'employees', employeeId);
      const employeeSnap = await getDoc(employeeRef);

      if (!employeeSnap.exists()) {
        setError('Empleado no encontrado');
        return;
      }

      setEmployee({
        id: employeeSnap.id,
        ...employeeSnap.data()
      });

      // Obtener contratos del empleado
      await fetchContracts();
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar la información del empleado');
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    try {
      const contractsRef = collection(db, 'employees', employeeId, 'contracts');
      const contractsSnap = await getDocs(contractsRef);
      const contractsList = contractsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContracts(contractsList);
    } catch (err) {
      console.error('Error al cargar contratos:', err);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const handleAddContract = () => {
    setSelectedContract(null);
    setShowContractModal(true);
  };

  const handleEditContract = (contract) => {
    setSelectedContract(contract);
    setShowContractModal(true);
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este contrato?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'employees', employeeId, 'contracts', contractId));
      setContracts(contracts.filter(c => c.id !== contractId));
      toast.success('🗑️ Contrato eliminado exitosamente');
    } catch (err) {
      console.error('Error al eliminar contrato:', err);
      toast.error('❌ Error al eliminar el contrato');
    }
  };

  const handleModalClose = () => {
    setShowContractModal(false);
    setSelectedContract(null);
  };

  const handleSaveSuccess = () => {
    fetchContracts();
    handleModalClose();
  };

  const getStatusBadge = (estado) => {
    const isActive = estado?.toLowerCase() === 'activo';
    return (
      <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? '✓ Activo' : '⏸ Retirado'}
      </span>
    );
  };

  const getContractStatusBadge = (estado) => {
    const statusMap = {
      activo: { class: 'active', label: '✓ Activo' },
      finalizado: { class: 'finished', label: '✓ Finalizado' },
      suspendido: { class: 'suspended', label: '⏸ Suspendido' }
    };
    const status = statusMap[estado?.toLowerCase()] || statusMap.activo;
    return (
      <span className={`status-badge ${status.class}`}>
        {status.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="employee-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando información del empleado...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="employee-detail-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>{error || 'Empleado no encontrado'}</h2>
          <button className="btn-back" onClick={() => navigate('/employees')}>
            Volver a Empleados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-detail-container">
      <MusicControlButton />
      {/* Header con botón de volver */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/employees')}>
          ← Volver
        </button>
        <h1>Detalles del Empleado</h1>
      </div>

      {/* Información del Empleado */}
      <div className="employee-info-card">
        <div className="employee-header">
          <div className="employee-avatar">
            {employee.NOMBRE?.[0]}{employee.APELLIDO?.[0]}
          </div>
          <div className="employee-title">
            <h2>{employee.NOMBRE} {employee.APELLIDO}</h2>
            <p className="employee-cargo">{employee.CARGO || 'Sin cargo asignado'}</p>
          </div>
          <div className="employee-status">
            {getStatusBadge(employee.ESTADO)}
          </div>
        </div>

        <div className="employee-details-grid">
          <div className="detail-item">
            <span className="detail-label">Nro. Documento</span>
            <span className="detail-value">{employee.NRO_DOCUMENTO || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Edad</span>
            <span className="detail-value">{employee.EDAD ? `${employee.EDAD} años` : '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Género</span>
            <span className="detail-value">{employee.GENERO || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Correo Electrónico</span>
            <span className="detail-value">{employee.CORREO || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Nro. Contacto</span>
            <span className="detail-value">{employee.NRO_CONTACTO || '-'}</span>
          </div>
        </div>
      </div>

      {/* Sección de Observaciones */}
      {employee.OBSERVACIONES && (
        <div className="observations-section">
          <div className="observations-header">
            <span className="observations-icon">📝</span>
            <h3>Observaciones</h3>
          </div>
          <div className="observations-content">
            <p>{employee.OBSERVACIONES}</p>
          </div>
        </div>
      )}

      {/* Sección de Contratos */}
      <div className="contracts-section">
        <div className="section-header">
          <div>
            <h2>Contratos</h2>
            <p className="section-subtitle">
              Total de contratos: <strong>{contracts.length}</strong>
            </p>
          </div>
          <div className="section-actions">
            <ExportControls 
              data={contracts} 
              type="contracts"
              title={`Contratos de ${employee.NOMBRE} ${employee.APELLIDO}`}
            />
            <button className="btn-add-contract" onClick={handleAddContract}>
              <span className="btn-icon">+</span>
              Agregar Contrato
            </button>
          </div>
        </div>

        {contracts.length === 0 ? (
          <div className="empty-contracts">
            <div className="empty-icon">📄</div>
            <h3>No hay contratos registrados</h3>
            <p>Agrega el primer contrato para este empleado</p>
            <button className="btn-primary" onClick={handleAddContract}>
              Agregar Primer Contrato
            </button>
          </div>
        ) : (
          <div className="contracts-table-wrapper">
            <table className="contracts-table">
              <thead>
                <tr>
                  <th>Tipo de Contrato</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Salario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td><strong>{contract.TIPO_CONTRATO || '-'}</strong></td>
                    <td>{contract.FECHA_INICIO || '-'}</td>
                    <td>{contract.FECHA_FIN || '-'}</td>
                    <td>
                      {contract.SALARIO 
                        ? new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(contract.SALARIO)
                        : '-'}
                    </td>
                    <td>{getContractStatusBadge(contract.ESTADO)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleEditContract(contract)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteContract(contract.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showContractModal && (
        <ContractModal
          employeeId={employeeId}
          contract={selectedContract}
          onClose={handleModalClose}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default EmployeeDetailPage;
