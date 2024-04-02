import sys
import json
import csv
import math


def calculate_bmr(age, gender, weight, height):
    if gender.lower() == 'male':
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    return bmr

def suggest_food_and_exercise(age, gender, weight, height, bmi, glucose_level, activity_level):
    # Calculate BMR using Harris-Benedict equation
    bmr = calculate_bmr(age, gender, weight, height)

    # Define activity factors based on activity level
    activity_factors = {
        'sedentary': 1.2,
        'lightly active': 1.375,
        'moderately active': 1.55,
        'very active': 1.725,
        'extra active': 1.9
    }

    # Calculate total daily caloric needs
    daily_caloric_intake = bmr * activity_factors.get(activity_level.lower(), 1.2)

    # Suggest food based on caloric intake and glucose level
    if glucose_level < 100:
        food_suggestion = "You have a normal glucose level. Maintain a balanced diet with fruits, vegetables, lean proteins, and whole grains."
    else:
        food_suggestion = "Monitor your glucose level and consult with a healthcare professional for dietary recommendations."

    # Suggest exercise based on BMI
    if bmi < 18.5:
        exercise_suggestion = "Consider incorporating strength training exercises and a balanced diet to gain healthy weight."
    elif 18.5 <= bmi < 24.9:
        exercise_suggestion = "Maintain a regular exercise routine and a balanced diet to stay in a healthy weight range."
    else:
        exercise_suggestion = "Incorporate both cardiovascular exercises and strength training along with a balanced diet to manage weight."

    return food_suggestion, exercise_suggestion, daily_caloric_intake


def recommend_food_and_exercise(user_input, dataset):
    # Convert user input values to the appropriate data types
    user_input = {key: float(value) if key not in ('gender', 'food_recommendation', 'exercise_recommendation') and isinstance(value, str) and value.replace('.', '', 1).isdigit() else value for key, value in user_input.items()}

    # Calculate the Euclidean distance between the user input and each data point in the dataset
    distances = []
    for data_point in dataset:
        # Convert dataset values to the appropriate data types
        data_point = {key: float(value) if key not in ('gender', 'food_recommendation', 'exercise_recommendation') and isinstance(value, str) and value.replace('.', '', 1).isdigit() else value for key, value in data_point.items()}

        distance = sum((user_input[key] - data_point[key]) ** 2 for key in ['age', 'weight', 'height', 'bmi', 'glucose'])
        distances.append(distance)

    # Find the index of the data point with the minimum distance
    min_distance_index = distances.index(min(distances))

    # Retrieve food and exercise recommendations for the user
    food_recommendation = dataset[min_distance_index]['food_recommendation']
    exercise_recommendation = dataset[min_distance_index]['exercise_recommendation']

    return {'food_recommendation': "We Recommand You " + food_recommendation + "exercises", 'exercise_recommendation': "We Recommand You "+exercise_recommendation+ "low fat"}

def load_dataset_from_csv(file_path):
    dataset = []
    with open(file_path, 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            dataset.append(row)
    return dataset

if __name__ == "__main__":
    # Read the JSON input from stdin
    input_data = json.loads(sys.stdin.read())

    # Access individual values from the input_data dictionary
    age = input_data['age']
    gender = input_data['gender']
    weight = input_data['weight']
    height = input_data['height']
    bmi = input_data['bmi']
    glucose = input_data['sugarcount']

    user_input = {
        'age': age,
        'gender': gender,
        'weight': weight,
        'height': height,
        'bmi': bmi,
        'glucose': glucose
    }

    csv_file_path = './dataset.csv'  # Replace with the actual path to your CSV file
    dataset = load_dataset_from_csv(csv_file_path)
    recommendations = recommend_food_and_exercise(user_input, dataset)
    print(json.dumps(recommendations))
