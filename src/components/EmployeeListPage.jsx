import { useState } from 'react';
import EmployeeTable from './EmployeeTable';
import ExportControls from './ExportControls';
import MusicControlButton from './MusicControlButton';
import { useNavigate } from 'react-router-dom';
import './EmployeeListPage.css';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  return (
    <div className="employee-list-page">
      <MusicControlButton />
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver al Dashboard
        </button>
        <h1>Gestión de Empleados</h1>
      </div>

      <div className="controls-section">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, apellido o documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="btn-clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <ExportControls 
          data={filteredEmployees} 
          type="employees"
          title="Reporte de Empleados"
        />
      </div>

      <EmployeeTable 
        searchTerm={searchTerm}
        onFilteredDataChange={setFilteredEmployees}
      />
    </div>
  );
};

export default EmployeeListPage;
