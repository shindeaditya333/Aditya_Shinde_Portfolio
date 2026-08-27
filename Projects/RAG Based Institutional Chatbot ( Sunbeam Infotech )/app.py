import streamlit as st
from login import authenticate
from Sunbeam_ChatBot import run_chatbot

if "auth" not in st.session_state:
    st.session_state.auth = False

if "user_name" not in st.session_state:
    st.session_state.user_name = None

if "is_admin" not in st.session_state:
    st.session_state.is_admin = False

if not st.session_state.auth:
    st.subheader("Login")

    user = st.text_input("Username")
    pwd = st.text_input("Password", type="password")

    if st.button("Login"):
        if authenticate(user, pwd):
            st.session_state.auth = True
            st.session_state.user_name = user

            # ADMIN CHECK (AS REQUESTED)
            if user == "admin" and pwd == "admin123":
                st.session_state.is_admin = True
            else:
                st.session_state.is_admin = False

            st.rerun()
        else:
            st.error("Invalid credentials")
else:
    run_chatbot()
