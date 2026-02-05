import { useState } from "react";
import axios from "axios";
import "./app.css";


const App = () => { 

    const [arquivo, setarquivo] = useState(null);
    const [status, setstatus] = useState("idle");
    const [resumo, setresumo] = useState("");

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

        const formData = new FormData();
        formData.append("file", arquivoParaResumir);

        try {
            // TODO: Descomentar após o backend ser feito.    
            // const response = await axios.post("http://localhost:8000/summarize", formData, {

            setTimeout(() => {
                setresumo("Resumo de exemplo: Este é um resumo gerado para fins de demonstração.");
                setstatus("idle");
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
            <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden-input" id="pdf-upload" hidden />
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
          <div className="summary-content">
            <h2 className="summary-title">Resumo Gerado:</h2>
            <p>{summary}</p>
            <button onClick={() => setStatus('idle')} className="btn-reset">
              Resumir outro arquivo
            </button>
          </div>
        )}
      </div>
    </div>

    )

}

export default App;