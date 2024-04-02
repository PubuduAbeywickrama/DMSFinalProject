import sys
import pdfplumber
import re
import csv
import argparse

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

def recommend_food_and_exercise(user_input, dataset):
    user_input = {key: float(value) if key not in ('gender', 'food_recommendation', 'exercise_recommendation') and isinstance(value, str) and value.replace('.', '', 1).isdigit() else value for key, value in user_input.items()}

    distances = []
    for data_point in dataset:
        data_point = {key: float(value) if key not in ('gender', 'food_recommendation', 'exercise_recommendation') and isinstance(value, str) and value.replace('.', '', 1).isdigit() else value for key, value in data_point.items()}
        distance = sum((user_input[key] - data_point[key]) ** 2 for key in ['age', 'weight', 'height', 'bmi', 'glucose'])
        distances.append(distance)

    min_distance_index = distances.index(min(distances))

    food_recommendation = dataset[min_distance_index]['food_recommendation']
    exercise_recommendation = dataset[min_distance_index]['exercise_recommendation']

    return food_recommendation, exercise_recommendation

def load_dataset_from_csv(file_path):
    dataset = []
    with open(file_path, 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            dataset.append(row)
    return dataset

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Recommend food and exercise based on user input.')
    parser.add_argument('--age', type=int, help='User age')
    parser.add_argument('--gender', type=str, help='User gender')
    parser.add_argument('--weight', type=float, help='User weight')
    parser.add_argument('--height', type=float, help='User height')
    parser.add_argument('--bmi', type=float, help='User BMI')
    parser.add_argument('--glucose', type=float, help='User glucose level')

    args = parser.parse_args()

    user_input = {
        'age': args.age,
        'gender': args.gender,
        'weight': args.weight,
        'height': args.height,
        'bmi': args.bmi,
        'glucose': args.glucose
    }

    pdf_path = sys.argv[1] if len(sys.argv) > 1 else None

    if pdf_path:
        date, glucose_level = extract_date_and_glucose_level(pdf_path)
    
        if date and glucose_level:
            print(f"Extracted Date: {date}")
            print(f"Extracted Glucose Level: {glucose_level}")
        else:
            print("Date or glucose level not found in the PDF.")
    else:
        print("Please provide a PDF file path as a command-line argument.")

    csv_file_path = './dataset.csv'
    dataset = load_dataset_from_csv(csv_file_path)
    food, exercise = recommend_food_and_exercise(user_input, dataset)
    print(f"Food Recommendation: {food}")
    print(f"Exercise Recommendation: {exercise}")
