import openai 
openai.api_key = key

print("Chatbot OK")
ALLOWED_TOPICS = ["bey of bengal","sundarbans","mangroves","nature","environment","global warming","ocean", "marine", "fish", "coral", "pollution", "sea", "whale", "shark", "underwater", "ecosystem", "species", "conservation","hi there","hi","hello","greetings","how are you?","whats up?"]

def is_valid_question(user_input):
    return any(word in user_input.lower() for word in ALLOWED_TOPICS)

def chat_with_ray(prompt):
    if not is_valid_question(prompt):
        return "I can only discuss marine-related topics. Ask me something about the ocean!"

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are Mr. Ray, a marine expert and a guide for the Conserve the Deep platform. You can only answer ocean and conservation related questions."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message["content"].strip()
if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit","exit","bye"]:
            break;

        response = chat_with_ray(user_input)
        print("Chatbot: ",response)