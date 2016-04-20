
from flask import Flask, request, jsonify
from flask.ext.cors import CORS
import sqlite3
import json
import bleach

app = Flask(__name__)
CORS(app)

DB_FILE_NAME = 'pika.sqlite'
QUESTION_IDS = set(['1','2','3','4'])
ANSWERS = set(['yes','no'])
ANSWERS_4 = set(['recycling','carpooling','biking_walking','vegetarian','other','no_response'])

@app.route("/")
def hello():
    url = request.url
    endpoint = request.endpoint
    ip_address = request.remote_addr

    response = "<p>url: " + url + "</p>\n"
    response = response + "<p>endpoint: " + endpoint + "</p>\n"
    response = response + "<p>ip_address: " + ip_address + "</p>\n"

    return response


''' /question?id=1&answer=yes '''
''' /question?id=4&recycling=1&carpooling=1&biking_walking=1&vegetarian=1&other=1&no_response=0 '''
@app.route("/question",methods=['GET','POST','PUT'])
def question():
    question_id = str(request.args.get('id'))
    user_id = buildUserID(request)
    addUserIfNotExists(user_id)

    response = ''

    if question_id == '4':
        no_response = str(request.args.get('no_response',0))
        if no_response == '0':
            no_response = False
        else:
            no_response = True
        answers = dict()
        for a in ANSWERS_4:
            temp = str(request.args.get(a,0))
            if temp == '0' or no_response:
                answers[a] = '0'
            else:
                answers[a] = '1'
                
        if(no_response):
            answers['no_response'] = '1'

        updateAnswer4(user_id,answers)
        response = getAnswers(question_id);
    else:
        answer = str(request.args.get('answer')).lower()
        if question_id in QUESTION_IDS:
            if answer in ANSWERS:
                updateAnswer(user_id,question_id,answer)
            response = getAnswers(question_id)

    return response

''' /question?name=john&content=pikasrule '''
@app.route("/comment")
def comment():
    # use bleach to sanitize input
    content = bleach.clean(request.args.get('content'))
    name = bleach.clean(request.args.get('name'))
    user_id = buildUserID(request)

    insertComment(user_id,comment,content)

    response = getComments()

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

def buildUserID(request):
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent')
    return ip_address + ':-:' + user_agent


def addUserIfNotExists(user_id):
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()

    cur.execute('SELECT user_id FROM poll WHERE user_id = ?',(user_id,))
    response = cur.fetchone();
    if response == None:
        cur.execute('INSERT INTO poll (user_id) VALUES (?)',(user_id,))
        conn.commit()

    cur.execute('SELECT user_id FROM answer_4 WHERE user_id = ?',(user_id,))
    response = cur.fetchone();
    if response == None:
        cur.execute('INSERT INTO answer_4 (user_id) VALUES (?)',(user_id,))
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

def updateAnswer4(user_id,answers):
    update_sql = "UPDATE poll SET answer_4 = 1 WHERE user_id =?"
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.execute(update_sql,(user_id,))
    keys = answers.keys()
    for key in keys:
        update_sql = "UPDATE answer_4 SET {0} = ? WHERE user_id = ?".format(key)
        cur.execute(update_sql,(answers[key],user_id))
    conn.commit()
    cur.close()
    conn.close()
    return

def getAnswers(question_id):
    if question_id == '4':
        return getAnswers4()
    else:
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

def getAnswers4():
    response = {}
    query_sql = '''SELECT 
        SUM(recycling) as recycling,
        SUM(carpooling) as carpooling,
        SUM(biking_walking) as biking_walking,
        SUM(vegetarian) as vegetarian,
        SUM(other) as other,
        SUM(no_response) as no_response
        FROM answer_4
    '''
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.execute(query_sql)
    row = cur.fetchone()
    response = {}
    response["recycling"] = row[0]
    response["carpooling"] = row[1];
    response["biking_walking"] = row[2];
    response["vegetarian"] = row[3];
    response["other"] = row[4];
    response["no_response"] = row[5];
    response = json.dumps(response)
    return response

def insertComment(user_id,comment,content):

    return

def getComments():
    response = {}

    response = json.dumps(response)
    return response


def initDB():
    conn = sqlite3.connect(DB_FILE_NAME)
    cur = conn.cursor()
    cur.executescript('''CREATE TABLE IF NOT EXISTS poll (
            user_id TEXT PRIMARY KEY,
            answer_1 TEXT DEFAULT NULL,
            answer_2 TEXT DEFAULT NULL,
            answer_3 TEXT DEFAULT NULL,
            answer_4 INT DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS poll_user_id_idx ON poll(user_id);

        CREATE TABLE IF NOT EXISTS answer_4(
            user_id TEXT PRIMARY KEY,
            recycling INT DEFAULT 0,
            carpooling INT DEFAULT 0,
            biking_walking INT DEFAULT 0,
            vegetarian INT DEFAULT 0,
            other INT DEFAULT 0,
            no_response INT DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES poll(user_id)
        );

        CREATE INDEX IF NOT EXISTS answer_4_user_id_idx ON answer_4(user_id);

        CREATE TABLE IF NOT EXISTS comment(
            comment_id INTEGER PRIMARY KEY,
            user_id TEXT,
            name TEXT,
            content TEXT,
            approved INT DEFAULT 0
        );''')
    conn.commit()
    cur.close()
    conn.close()
    return



if __name__ == "__main__":
    initDB()
    app.debug = True
    app.run(host='0.0.0.0')
