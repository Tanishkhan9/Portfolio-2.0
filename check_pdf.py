import PyPDF2

try:
    r = PyPDF2.PdfReader('Resume-Tanish.pdf')
    print('pages', len(r.pages))
except Exception as e:
    print('error', e)
