import csv
import math
import argparse

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

    csv_file_path = './dataset.csv'
    dataset = load_dataset_from_csv(csv_file_path)
    food, exercise = recommend_food_and_exercise(user_input, dataset)
    print(f"Food Recommendation: {food}")
    print(f"Exercise Recommendation: {exercise}")
