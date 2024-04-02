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

# Example usage
age = 30
gender = 'male'
weight = 70  # in kilograms
height = 175  # in centimeters
bmi = weight / (height / 100) ** 2
glucose_level = 90  # mg/dL
activity_level = 'moderately active'

food_suggestion, exercise_suggestion, daily_caloric_intake = suggest_food_and_exercise(age, gender, weight, height, bmi, glucose_level, activity_level)

print("Food Suggestion:", food_suggestion)
print("Exercise Suggestion:", exercise_suggestion)
print("Daily Caloric Intake:", daily_caloric_intake)
