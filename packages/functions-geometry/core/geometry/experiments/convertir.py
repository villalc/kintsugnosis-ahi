import os
from fpdf import FPDF

def convert_all_py_to_pdf():
    # Listar todos los archivos .py en la carpeta actual
    archivos = [f for f in os.listdir('.') if f.endswith('.py') and f != 'convertir.py']
    
    for archivo in archivos:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Courier", size=10) # Courier mantiene la indentación
        
        # Leer el código con encoding utf-8 por si tienes acentos o ñ
        try:
            with open(archivo, "r", encoding="utf-8") as f:
                for line in f:
                    # Sustituir caracteres raros que fpdf no soporte
                    clean_line = line.encode('latin-1', 'replace').decode('latin-1')
                    pdf.cell(0, 5, txt=clean_line, ln=True)
            
            nombre_salida = archivo.replace('.py', '.pdf')
            pdf.output(nombre_salida)
            print(f"✅ Convertido: {archivo} -> {nombre_salida}")
        except Exception as e:
            print(f"❌ Error en {archivo}: {e}")

if __name__ == "__main__":
    convert_all_py_to_pdf()
