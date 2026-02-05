import { useState } from "react";
import axios from "axios";
import "./app.css";
import ReactMarkdown from 'react-markdown';

const App = () => { 

    const [arquivo, setarquivo] = useState(null);
    const [status, setstatus] = useState("idle");
    const [resumo, setresumo] = useState("");
    const API_URL = import.meta.env.VITE_API_URL;

    const handleMudançadeArquivo = (e) => {

        const arquivoSelecionado = e.target.files[0];
        
        if (arquivoSelecionado && arquivoSelecionado.type === "application/pdf") {
            setarquivo(arquivoSelecionado);
            handleUpload(arquivoSelecionado);
        } else {
            alert("Por favor, selecione um arquivo PDF.");
        }
    }

    const handleUpload = async (arquivoParaResumir) => {
        setstatus("Carregando....");
        console.log (API_URL);
        const formData = new FormData();
        formData.append("file", arquivoParaResumir);

        try {

            const response = await axios.post(`${API_URL}/summarize`, formData, {
                headers: {
        'Content-Type': 'multipart/form-data'
      }
    });console.log("Resposta do servidor:", response.data)

            setTimeout(() => {
                setresumo(response.data.summary);
                setstatus("result");
            }, 3000);

        }catch (error) {
            console.error("Erro ao resumir o arquivo", error);
            setstatus("idle");
            alert("Ocorreu um erro ao resumir o arquivo. Por favor, tente novamente.");
        }
    }

    return (

        <div className="container">
      <h1 className="title">Gemini PDF Summarizer</h1>

      <div className="upload-card">
        
        {status === 'idle' && (
          <div className="idle-state">
            <input type="file" accept=".pdf" onChange={handleMudançadeArquivo} className="hidden-input" id="pdf-upload" hidden />
            <label htmlFor="pdf-upload" className="dropzone-label">
              <p>Arraste ou <span className="highlight-text">clique para selecionar</span> o PDF</p>
              <p className="subtext">Apenas arquivos .pdf</p>
            </label>
          </div>
        )}

        {status === 'loading' && (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Resumindo seu documento...</p>
          </div>
        )}

        {status === 'result' && (
  <div className="summary-container">
    <h2 className="text-2xl font-bold mb-4 text-green-400">Resumo Gerado</h2>
    
    <div className="prose prose-invert max-w-none bg-gray-800 p-6 rounded-lg border border-gray-700">
      <ReactMarkdown>{resumo}</ReactMarkdown>
    </div>

    <button 
      onClick={() => setstatus('idle')}
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
    >
      Resumir outro arquivo
    </button>
  </div>
)}
      </div>
    </div>

    )

}

export default App;