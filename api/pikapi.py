
from flask import Flask, request, jsonify
import sqlite3
import json

app = Flask(__name__)

DB_FILE_NAME = 'pika.sqlite'
QUESTION_IDS = set(['1','2','3','4'])
ANSWERS = set(['yes','no'])

@app.route("/")
def hello():
    url = request.url
    endpoint = request.endpoint
    ip_address = request.remote_addr

    response = "<p>url: " + url + "</p>\n"
    response = response + "<p>endpoint: " + endpoint + "</p>\n"
    response = response + "<p>ip_address: " + ip_address + "</p>\n"

    return response


''' /question?id=1&answer=yes'''
@app.route("/question")
def question():
    question_id = str(request.args.get('id'))
    answer = str(request.args.get('answer')).lower()
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent')

    user_id = ip_address + ':-:' + user_agent
    addUserIfNotExists(user_id)

    response = ''

    if question_id in QUESTION_IDS:
        if answer in ANSWERS:
            updateAnswer(user_id,question_id,answer)
        response = getAnswers(question_id)

    return response


'''TODELETE: for testing purposes, remove before going public'''
# @app.route("/users")
def getUsers():
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.execute("SELECT * FROM poll")
    response = str(cur.fetchall())
    cur.close()
    conn.close()
    return response




def addUserIfNotExists(user_id):
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.execute('SELECT user_id FROM poll WHERE user_id = ?',(user_id,))
    response = cur.fetchone();
    if response == None:
        cur.execute('INSERT INTO poll (user_id) VALUES (?)',(user_id,))
        conn.commit()
    cur.close()
    conn.close()
    return

def updateAnswer(user_id,question_id,answer):
    update_sql = '''UPDATE poll SET answer_{0} = ? 
        WHERE user_id =?'''.format(question_id)
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.execute(update_sql,(answer,user_id))
    conn.commit()
    cur.close()
    conn.close()
    return

def getAnswers(question_id):
    query_sql = '''SELECT answer_{0},
        count(answer_{0}) AS count
        FROM poll
        GROUP BY answer_{0}'''.format(question_id)
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.execute(query_sql)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    response = {}
    for row in rows:
        answer = row[0]
        count = row[1]
        response[answer] = count
    response = json.dumps(response)
    return response



def initDB():
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.executescript('''CREATE TABLE IF NOT EXISTS poll (
            user_id TEXT PRIMARY KEY,
            answer_1 TEXT,
            answer_3 TEXT,
            answer_2 TEXT,
            answer_4 TEXT
        );

        CREATE INDEX IF NOT EXISTS poll_user_id_idx ON poll(user_id);
    ''')
    conn.commit()
    cur.close()
    conn.close()
    return



if __name__ == "__main__":
    initDB()
    app.debug = True
    app.run(host='0.0.0.0')
