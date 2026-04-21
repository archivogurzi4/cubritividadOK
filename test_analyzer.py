import fitz
doc = fitz.open()
page = doc.new_page()
doc.save('dummy.pdf')
doc.close()
from backend.pdf_analyzer import analyze_pdf_coverage
try:
    print(analyze_pdf_coverage('dummy.pdf'))
except Exception as e:
    import traceback
    traceback.print_exc()
