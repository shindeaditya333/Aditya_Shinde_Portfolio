import pandas as pd

def authenticate(username, password):
    users = pd.read_csv("users.csv")
    return not users[
        (users.username == username) &
        (users.password == password)
    ].empty
