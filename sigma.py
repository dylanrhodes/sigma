# sigma.py - main flask file for sigma.jmvldz.com
# written by Josh Valdez

# imports
import json
from flask import Flask, render_template, jsonify
#from flask import request

from functools import wraps
from flask import request, current_app

def jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/javascript'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

# application
app = Flask(__name__)
app.config.from_pyfile('config/sigma.cfg')

# routes
@app.route('/')
def show_index():
    return render_template('index.html')

@app.route('/get_emails')
@jsonp
def send_recent_email_json():
    # get emails from database
    import redis
    rServer = redis.Redis("localhost")
    #mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf", 0, 10)
    mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf")
    #print mail
    parsedMail = {}
    for email in mail:
        pMail = json.loads(email)
        parsedMail[pMail['id']] = pMail
    return jsonify(parsedMail)

@app.route('/categorize_email', methods=["POST"])
def categorize_email():
    # TODO get username
    email = json.loads(request.data)
    import redis
    rServer = redis.Redis("localhost")
    mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    pMail = json.loads(mail[0])
    pMail['category'] = email['category']
    pMail['categorized'] = True
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    rServer.zremrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    rServer.zadd("mail:exxonvaldeez:inbox", emailJSON, email['id'])
    return "Success"

@app.route('/mark_as_read', methods=["POST"])
def mark_email_read():
    # TODO get username
    email = json.loads(request.data)
    import redis
    rServer = redis.Redis("localhost")
    mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    pMail = json.loads(mail[0])
    pMail['read'] = True
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    rServer.zremrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    rServer.zadd("mail:exxonvaldeez:inbox", emailJSON, email['id'])
    return "Success"

# main
if __name__ == '__main__':
    app.run()
