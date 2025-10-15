import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import EmployeeModal from './EmployeeModal';
import LoadingScreen from './LoadingScreen';
import './EmployeeTable.css';

const EmployeeTable = ({ searchTerm = '', onFilteredDataChange }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  // Filtered employees based on search term
  const filteredEmployees = employees.filter(employee => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const nombre = (employee.NOMBRE || '').toLowerCase();
    const apellido = (employee.APELLIDO || '').toLowerCase();
    const documento = (employee.NRO_DOCUMENTO || '').toLowerCase();
    
    return nombre.includes(searchLower) || 
           apellido.includes(searchLower) || 
           documento.includes(searchLower);
  });

  // Notify parent component of filtered data changes
  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredEmployees);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, searchTerm]); // Cambiado a employees y searchTerm

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const employeesCollection = collection(db, 'employees');
      const employeesSnapshot = await getDocs(employeesCollection);
      const employeesList = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(employeesList);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setError('Error al cargar los empleados. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'employees', employeeId));
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      toast.success('🗑️ Empleado eliminado exitosamente');
    } catch (err) {
      console.error('Error al eliminar empleado:', err);
      toast.error('❌ Error al eliminar el empleado. Por favor, intenta de nuevo.');
    }
  };

  const handleViewDetails = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleSaveSuccess = () => {
    fetchEmployees();
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

  if (loading) {
    return (
      <div className="employee-table-container">
        <LoadingScreen message="Cargando empleados..." />
      </div>
    );
  }

  return (
    <div className="employee-table-container">
      <div className="table-header">
        <div>
          <h2>Gestión de Empleados</h2>
          <p className="table-subtitle">
            {searchTerm ? (
              <>
                Mostrando <strong>{filteredEmployees.length}</strong> de <strong>{employees.length}</strong> empleados
              </>
            ) : (
              <>
                Total de empleados: <strong>{employees.length}</strong>
              </>
            )}
          </p>
        </div>
        <motion.button 
          className="btn-add-employee" 
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="btn-icon">+</span>
          Agregar Empleado
        </motion.button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {filteredEmployees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          {searchTerm ? (
            <>
              <h3>No se encontraron resultados</h3>
              <p>No hay empleados que coincidan con "{searchTerm}"</p>
            </>
          ) : (
            <>
              <h3>No hay empleados registrados</h3>
              <p>Comienza agregando tu primer empleado</p>
              <button className="btn-primary" onClick={handleAddNew}>
                Agregar Primer Empleado
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nro. Documento</th>
                <th>Cargo</th>
                <th>Correo</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="employee-name">
                      <strong>{employee.NOMBRE} {employee.APELLIDO}</strong>
                    </div>
                  </td>
                  <td>{employee.NRO_DOCUMENTO || '-'}</td>
                  <td>{employee.CARGO || '-'}</td>
                  <td>{employee.CORREO || '-'}</td>
                  <td>{employee.NRO_CONTACTO || '-'}</td>
                  <td>{getStatusBadge(employee.ESTADO)}</td>
                  <td>
                    <div className="action-buttons">
                      <motion.button
                        className="btn-action btn-view"
                        onClick={() => handleViewDetails(employee.id)}
                        title="Ver detalles"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        👁️
                      </motion.button>
                      <motion.button
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(employee)}
                        title="Editar"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(employee.id)}
                        title="Eliminar"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={handleModalClose}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
