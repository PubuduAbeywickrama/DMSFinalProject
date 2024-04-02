from flask import Flask, render_template, request, jsonify
import spacy
from spacy.matcher import Matcher
import string
import csv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class ChatbotApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.nlp_model = spacy.load("en_core_web_sm")
        self.dataset = self.load_dataset_from_csv("./data.csv")
        self.matcher = Matcher(self.nlp_model.vocab)
        self.setup_patterns()  # Call setup_patterns during initialization
        self.setup_cors()
    
    def setup_cors(self):
        CORS(self.app)

    def load_dataset_from_csv(self, csv_filename):
        dataset = []
        with open(csv_filename, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                dataset.append({
                    'ID': int(row['ID']),
                    'User_Message': row['User_Message'],
                    'Bot_Response': row['Bot_Response']
                })
        return dataset
    
    def setup_patterns(self):
        # Add patterns for user messages
        for entry in self.dataset:
            # Tokenize the user message, remove punctuation, and convert to lowercase
            pattern_tokens = [token.text.lower() for token in self.nlp_model(entry["User_Message"]) if token.text not in string.punctuation]
            entry["pattern_tokens"] = pattern_tokens
            print(f"Pattern for ID {entry['ID']}: {pattern_tokens}")
    
    def get_bot_response(self, user_input):
        # Convert the user input to lowercase for case-insensitive matching
        user_input_lower = user_input.lower()

        # Compare user input with User_Message in the dataset (case-insensitive)
        for entry in self.dataset:
            if user_input_lower == entry["User_Message"].lower():
                return entry["Bot_Response"]

        # If no match is found, provide a default response
        return "I'm sorry, I don't understand that question."
    
    def index(self):
        return render_template('index.html')

    def get_bot_response_route(self):
        user_input = request.json['user_input']
        bot_response = self.get_bot_response(user_input)
        return jsonify({'bot_response': bot_response})

    def run(self):
        self.app.route('/')(self.index)
        self.app.route('/get_bot_response', methods=['POST'])(self.get_bot_response_route)
        self.app.run(debug=True)

if __name__ == '__main__':
    chatbot_app = ChatbotApp()
    chatbot_app.run()
