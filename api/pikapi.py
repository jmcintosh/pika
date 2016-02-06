import redis
from flask import Flask, request, jsonify

redis_host = 'localhost'
redis_port = 6379
redis_db = 0

redis_con = ''
IP_ADDRESS_SET = 'ip_address_set'

app = Flask(__name__)

@app.route("/")
def hello():
    url = request.url
    endpoint = request.endpoint
    ip_address = request.remote_addr

    response = "<p>url: " + url + "</p>\n"
    response = response + "<p>endpoint: " + endpoint + "</p>\n"
    response = response + "<p>ip_address: " + ip_address + "</p>\n"

    return response


''' /question?id=1&answer=true'''
@app.route("/question")
def question():
    question_id = request.args.get('id')
    answer = request.args.get('answer')
    ip_address = request.remote_addr

    # if ip is not in the set, increment the answer
    if !redis_con.sismember(IP_ADDRESS_SET,ip_address):
        pipe = redis_con.pipline()
        pipe.sadd(IP_ADDRESS_SET,ip_address)
        pipe.hincrby(question_id,answer)
        pipe.execute();

    response = redis_con.hgetall(question_id)

    return jsonify(response)

if __name__ == "__main__":
    redis_con = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db)
    app.debug = True
    app.run(host='0.0.0.0')
