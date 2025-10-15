import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './ReportsPage.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalContracts: 0,
    activeContracts: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Obtener empleados
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeesList = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(employeesList);

      // Obtener todos los contratos de todos los empleados
      let allContracts = [];
      for (const emp of employeesList) {
        const contractsSnapshot = await getDocs(
          collection(db, 'employees', emp.id, 'contracts')
        );
        const empContracts = contractsSnapshot.docs.map(doc => ({
          id: doc.id,
          employeeId: emp.id,
          ...doc.data()
        }));
        allContracts = [...allContracts, ...empContracts];
      }
      setContracts(allContracts);

      // Calcular KPIs
      const activeEmployees = employeesList.filter(
        emp => emp.ESTADO?.toLowerCase() === 'activo'
      ).length;
      const activeContracts = allContracts.filter(
        contract => contract.ESTADO?.toLowerCase() === 'activo'
      ).length;

      setKpis({
        totalEmployees: employeesList.length,
        activeEmployees: activeEmployees,
        totalContracts: allContracts.length,
        activeContracts: activeContracts
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Datos para gráfico de empleados por cargo (Doughnut)
  const employeesByPosition = employees.reduce((acc, emp) => {
    const cargo = emp.CARGO || 'Sin Cargo';
    acc[cargo] = (acc[cargo] || 0) + 1;
    return acc;
  }, {});

  const employeesByCargoData = {
    labels: Object.keys(employeesByPosition),
    datasets: [
      {
        label: 'Empleados',
        data: Object.values(employeesByPosition),
        backgroundColor: [
          'rgba(211, 47, 47, 0.8)',   // Rojo principal
          'rgba(236, 64, 122, 0.8)',  // Rosa principal
          'rgba(255, 205, 210, 0.8)', // Crema/rosa claro
          'rgba(102, 187, 106, 0.8)', // Verde
          'rgba(141, 110, 99, 0.8)',  // Marrón
          'rgba(255, 138, 101, 0.8)', // Naranja
          'rgba(171, 71, 188, 0.8)',  // Púrpura
          'rgba(66, 165, 245, 0.8)'   // Azul
        ],
        borderColor: [
          'rgb(211, 47, 47)',
          'rgb(236, 64, 122)',
          'rgb(255, 205, 210)',
          'rgb(102, 187, 106)',
          'rgb(141, 110, 99)',
          'rgb(255, 138, 101)',
          'rgb(171, 71, 188)',
          'rgb(66, 165, 245)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Datos para gráfico de comparación de estado (Bar)
  const employeeStatusData = {
    labels: ['Activo', 'Retirado'],
    datasets: [
      {
        label: 'Número de Empleados',
        data: [
          kpis.activeEmployees,
          kpis.totalEmployees - kpis.activeEmployees
        ],
        backgroundColor: [
          'rgba(102, 187, 106, 0.8)', // Verde para activos
          'rgba(211, 47, 47, 0.8)'    // Rojo para retirados
        ],
        borderColor: [
          'rgb(102, 187, 106)',
          'rgb(211, 47, 47)'
        ],
        borderWidth: 2
      }
    ]
  };

  // Opciones de gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      }
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Volver al Dashboard
        </button>
        <h1>📊 Reportes de Talento Humano</h1>
      </div>

      {/* KPIs Section */}
      <div className="kpis-section">
        <div className="kpi-card">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>Número Total de Empleados</h3>
            <p className="kpi-value">{kpis.totalEmployees}</p>
            <span className="kpi-label">Registrados en el sistema</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon active">✓</div>
          <div className="kpi-content">
            <h3>Total de Empleados Activos</h3>
            <p className="kpi-value">{kpis.activeEmployees}</p>
            <span className="kpi-label">
              {kpis.totalEmployees > 0 
                ? `${Math.round((kpis.activeEmployees / kpis.totalEmployees) * 100)}% del total`
                : '0% del total'}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">📄</div>
          <div className="kpi-content">
            <h3>Número Total de Contratos Vigentes</h3>
            <p className="kpi-value">{kpis.activeContracts}</p>
            <span className="kpi-label">
              {kpis.totalContracts > 0
                ? `${Math.round((kpis.activeContracts / kpis.totalContracts) * 100)}% del total`
                : '0% del total'}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon active">📝</div>
          <div className="kpi-content">
            <h3>Total de Contratos</h3>
            <p className="kpi-value">{kpis.totalContracts}</p>
            <span className="kpi-label">Registrados en el sistema</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribución de Empleados por Cargo</h3>
            <p>Vista detallada de la distribución por posiciones</p>
          </div>
          <div className="chart-container">
            <Doughnut data={employeesByCargoData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Comparativa de Estado de Empleados</h3>
            <p>Comparación entre empleados activos y retirados</p>
          </div>
          <div className="chart-container">
            <Bar data={employeeStatusData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>📈 Resumen Ejecutivo</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">Tasa de Empleados Activos:</span>
              <span className="summary-value">
                {kpis.totalEmployees > 0
                  ? `${Math.round((kpis.activeEmployees / kpis.totalEmployees) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tasa de Contratos Activos:</span>
              <span className="summary-value">
                {kpis.totalContracts > 0
                  ? `${Math.round((kpis.activeContracts / kpis.totalContracts) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Promedio Contratos/Empleado:</span>
              <span className="summary-value">
                {kpis.totalEmployees > 0
                  ? (kpis.totalContracts / kpis.totalEmployees).toFixed(2)
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
