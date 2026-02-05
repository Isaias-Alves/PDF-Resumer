import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import PyPDF2
import io

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.Model("gemini-1.5-flash")


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
        # 1. Ler o conteúdo do PDF
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        
        texto_completo = ""
        for page in pdf_reader.pages:
            texto_completo += page.extract_text()

        # 2. Mandar pro Gemini
        prompt = f"Resuma o seguinte texto de forma clara e em tópicos:\n\n{texto_completo}"
        response = model.generate_content(prompt)

        return {"summary": response.text}
    
 except Exception as e:
        return {"error": str(e)}, 500
 
if __name__ == "__main__":
    import uvicorn
    port_env = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Servidor rodando na porta: {port_env}")
    
    uvicorn.run(app, host="0.0.0.0", port=port_env)