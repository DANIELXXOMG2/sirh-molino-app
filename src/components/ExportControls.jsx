import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './ExportControls.css';

/**
 * ExportControls Component
 * Provides PDF and Excel export functionality for employee or contract data
 * 
 * @param {Array} data - Array of data objects to export (employees or contracts)
 * @param {String} type - Type of data: 'employees' or 'contracts'
 * @param {String} title - Title for the export documents
 */
export default function ExportControls({ data = [], type = 'employees', title = 'Reporte' }) {
  
  const handleExportPDF = () => {
    // Create new PDF document
    const doc = new jsPDF();
    console.log('jsPDF doc object:', doc);
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(211, 47, 47); // Primary red color
    doc.text(title, 14, 22);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100);
    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Generado: ${today}`, 14, 30);
    
    // Prepare table data based on type
    let columns, rows;
    
    if (type === 'employees') {
      // Map employee data with user-friendly headers
      const mappedData = data.map(emp => ({
        'Nro. Documento': emp.NRO_DOCUMENTO || 'N/A',
        'Nombre': emp.NOMBRE || 'N/A',
        'Apellido': emp.APELLIDO || 'N/A',
        'Cargo': emp.CARGO || 'N/A',
        'Email': emp.CORREO || 'N/A',
        'Nro. Contacto': emp.NRO_CONTACTO || 'N/A',
        'Estado': emp.ESTADO === 'ACTIVO' ? 'Activo' : 'Inactivo'
      }));

      columns = [
        { header: 'Nro. Documento', dataKey: 'Nro. Documento' },
        { header: 'Nombre', dataKey: 'Nombre' },
        { header: 'Apellido', dataKey: 'Apellido' },
        { header: 'Cargo', dataKey: 'Cargo' },
        { header: 'Email', dataKey: 'Email' },
        { header: 'Nro. Contacto', dataKey: 'Nro. Contacto' },
        { header: 'Estado', dataKey: 'Estado' }
      ];
      
      rows = mappedData;
    } else if (type === 'contracts') {
      // Map contract data with user-friendly headers
      const mappedData = data.map(contract => ({
        'Tipo Contrato': contract.TIPO_CONTRATO || 'N/A',
        'Fecha Inicio': contract.FECHA_INICIO || 'N/A',
        'Fecha Fin': contract.FECHA_FIN || 'N/A',
        'Salario': contract.SALARIO 
          ? `$${parseFloat(contract.SALARIO).toLocaleString('es-CO', { minimumFractionDigits: 0 })}` 
          : 'N/A',
        'Estado': contract.ESTADO || 'N/A'
      }));

      columns = [
        { header: 'Tipo Contrato', dataKey: 'Tipo Contrato' },
        { header: 'Fecha Inicio', dataKey: 'Fecha Inicio' },
        { header: 'Fecha Fin', dataKey: 'Fecha Fin' },
        { header: 'Salario', dataKey: 'Salario' },
        { header: 'Estado', dataKey: 'Estado' }
      ];
      
      rows = mappedData;
    }
    
    // Generate table
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 35,
      theme: 'striped',
      headStyles: {
        fillColor: [211, 47, 47], // Primary red
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [255, 245, 245] // Light pink
      },
      margin: { top: 35 },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });
    
    // Save PDF
    const filename = type === 'employees' 
      ? `Reporte_Empleados_${new Date().toISOString().split('T')[0]}.pdf`
      : `Reporte_Contratos_${new Date().toISOString().split('T')[0]}.pdf`;
    
    doc.save(filename);
  };

  const handleExportExcel = () => {
    // Prepare data based on type with user-friendly headers
    let excelData;
    
    if (type === 'employees') {
      // Map employee data with all required fields
      excelData = data.map(emp => ({
        'Nro. Documento': emp.NRO_DOCUMENTO || 'N/A',
        'Nombre': emp.NOMBRE || 'N/A',
        'Apellido': emp.APELLIDO || 'N/A',
        'Cargo': emp.CARGO || 'N/A',
        'Email': emp.CORREO || 'N/A',
        'Nro. Contacto': emp.NRO_CONTACTO || 'N/A',
        'Estado': emp.ESTADO === 'ACTIVO' ? 'Activo' : 'Inactivo'
      }));
    } else if (type === 'contracts') {
      // Map contract data with all required fields
      excelData = data.map(contract => ({
        'Tipo Contrato': contract.TIPO_CONTRATO || 'N/A',
        'Fecha Inicio': contract.FECHA_INICIO || 'N/A',
        'Fecha Fin': contract.FECHA_FIN || 'N/A',
        'Salario': contract.SALARIO 
          ? parseFloat(contract.SALARIO).toLocaleString('es-CO', { 
              style: 'currency', 
              currency: 'COP',
              minimumFractionDigits: 0 
            })
          : 'N/A',
        'Estado': contract.ESTADO || 'N/A',
        'Descripción': contract.DESCRIPCION || 'N/A'
      }));
    }
    
    console.log('Data for Excel:', data);
    console.log('Excel formatted data:', excelData);
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const columnWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = columnWidths;
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook, 
      worksheet, 
      type === 'employees' ? 'Empleados' : 'Contratos'
    );
    
    // Generate and download file
    const filename = type === 'employees' 
      ? 'Reporte_Empleados.xlsx'
      : 'Reporte_Contratos.xlsx';
    
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="export-controls">
      <button 
        className="btn-export btn-export-pdf"
        onClick={handleExportPDF}
        disabled={!data || data.length === 0}
      >
        <span className="export-icon">📄</span>
        Exportar a PDF
      </button>
      
      <button 
        className="btn-export btn-export-excel"
        onClick={handleExportExcel}
        disabled={!data || data.length === 0}
      >
        <span className="export-icon">📊</span>
        Exportar a Excel
      </button>
    </div>
  );
}
