# sigma.py - main flask file for sigma.jmvldz.com
# written by Josh Valdez

# imports
import json
from flask import Flask, render_template, jsonify
#from flask import request

# application
app = Flask(__name__)
app.config.from_pyfile('config/sigma.cfg')

# routes
@app.route('/')
def show_index():
    return render_template('index.html')

@app.route('/get_emails')
def send_recent_email_json():
    # get emails from database
    import redis
    rServer = redis.Redis("localhost")
    #mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf", 0, 10)
    mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf")
    parsedMail = {}
    for email in mail:
        pMail = json.loads(email)
        parsedMail[pMail['id']] = pMail
    return jsonify(parsedMail)


# main
if __name__ == '__main__':
    app.run()
