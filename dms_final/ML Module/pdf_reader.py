import pdfplumber
import re

def extract_date_and_glucose_level(pdf_path):
    date = None
    glucose_level = None

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()

            # Define a regular expression pattern to match date values
            date_pattern = r'\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b'
            date_match = re.search(date_pattern, text)
            if date_match:
                date = date_match.group(0)

            # Define a regular expression pattern to match glucose level values
            glucose_pattern = r'Glucose[^\d]*Level:[^\d]*(\d+(?:\.\d+)?)'
            glucose_match = re.search(glucose_pattern, text, re.IGNORECASE)
            if glucose_match:
                glucose_level = glucose_match.group(1)

    return date, glucose_level



# Provide the hardcoded PDF file path
pdf_path = './fbs - wps sooriyaarachchi.pdf'
date, glucose_level = extract_date_and_glucose_level(pdf_path)

if date and glucose_level:
    print(f"Extracted Date: {date}")
    print(f"Extracted Glucose Level: {glucose_level}")
else:
    print("Date or glucose level not found in the PDF.")
