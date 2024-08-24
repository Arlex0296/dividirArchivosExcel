import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
////   Listado de datos mas de 3000 y dividirlo por la  cantidad necesaria  en  otros  docuemntos de  excel
const FileProcessor = () => {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const processFile = () => {
    if (!file || !fileName) {
      alert("Por favor, sube un archivo y proporciona un nombre.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const rows = fileContent.split("\n");
      
      for (let i = 0; i < rows.length; i += 3000) {
        const chunk = rows.slice(i, i + 3000);
        const chunkFileName = `${fileName}_part${Math.floor(i / 3000) + 1}.xlsx`;

        // Crear una hoja de trabajo
        const ws = XLSX.utils.aoa_to_sheet(chunk.map(row => [row]));
        console.log(ws)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Convertir el libro de trabajo a un blob y guardarlo
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" });
        saveAs(blob, chunkFileName);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
      <input
        type="text"
        placeholder="Nombre del archivo"
        value={fileName}
        onChange={handleFileNameChange}
      />
      <button onClick={processFile}>Procesar Archivo</button>
    </div>
  );
};

export default FileProcessor;
