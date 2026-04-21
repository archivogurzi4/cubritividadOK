import fitz
doc = fitz.open()
page = doc.new_page()
print('doc methods:', [m for m in dir(doc) if 'sep' in m.lower()])
print('page methods:', [m for m in dir(page) if 'sep' in m.lower()])
