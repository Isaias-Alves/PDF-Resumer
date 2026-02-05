import os
import io
import PyPDF2
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai  
from fastapi.responses import JSONResponse

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize")
async def summarize_pdf(file: UploadFile = File(...)):
    try:

        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        texto_completo = ""
        for page in pdf_reader.pages:
            extraido = page.extract_text()
            if extraido:
                texto_completo += extraido

        if not texto_completo.strip():
            return {"summary": "Não foi possível extrair texto deste PDF."}

        response = client.models.generate_content(
            model="gemini-flash-latest", 
            contents=f"Resuma em tópicos: {texto_completo}"
        )

        return {"summary": response.text}
    
    except Exception as e:
        print(f"Erro: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    port_env = int(os.getenv("PORT", 8000))
    print(f"🚀 Servidor rodando na porta: {port_env}")
    uvicorn.run(app, host="0.0.0.0", port=port_env)