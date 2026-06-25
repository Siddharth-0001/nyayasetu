import streamlit as st
import google.generativeai as genai

# Setup the page appearance
st.set_page_config(page_title="My Custom Bot", page_icon="🤖")
st.title("🤖 My Custom Free Chatbot")

# Safely pull the API key from Streamlit's secrets
api_key = st.secrets.get("GEMINI_API_KEY") 

if not api_key:
    st.warning("Please add your GEMINI_API_KEY to the Streamlit Secrets.")
    st.stop()

# Configure the AI model
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

# Initialize the chat memory so it remembers previous messages
if "chat_session" not in st.session_state:
    st.session_state.chat_session = model.start_chat(history=[])

# Display the chat history on the screen
for message in st.session_state.chat_session.history:
    role = "assistant" if message.role == "model" else "user"
    with st.chat_message(role):
        st.markdown(message.parts[0].text)

# Create the chat input box at the bottom
if prompt := st.chat_input("Type your message here..."):
    # Show what the user typed
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Send to Gemini and show the response
    with st.chat_message("assistant"):
        response = st.session_state.chat_session.send_message(prompt)
        st.markdown(response.text)