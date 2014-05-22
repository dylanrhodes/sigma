# sigma.py - main flask file for sigma.jmvldz.com
# written by Josh Valdez

# imports
import json
from functools import wraps

from flask import Flask, render_template, jsonify
from flask import request, current_app
from flask.ext.login import LoginManager

from app.db import db
from app.forms import LoginForm

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

# database, login manager
lm = LoginManager()
lm.init_app(app)

#@lm.user_load
#def load_user(userid):
#    return User.get(userid)

# routes
@app.route('/')
def show_index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    return render_template("login.html", form=form)

@app.route('/get_emails')
@jsonp
def get_recent_email():
    # get emails from database
    #mail = db.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf", 0, 10)
    mail = db.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf")
    #print mail
    parsedMail = {}
    for email in mail:
        pMail = json.loads(email)
        parsedMail[pMail['id']] = pMail
    return jsonify(parsedMail)

@app.route('/get_category_unread')
@jsonp
def get_category_unread():
    # TODO get username
    # TODO test this
    category = request.args.get('category')
    mail = db.smembers("mail:exxonvaldeez:%s" % category)
    unread = 0
    for emailID in mail:
        emailObj = db.zrevrangebyscore("mail:exxonvaldeez:inbox", emailID, emailID)
        pMail = json.loads(emailObj[0])
        if not pMail['read']:
            unread += 1
    response = {'unread': unread}
    return jsonify(response)

@app.route('/categorize_email', methods=["POST"])
def categorize_email():
    # TODO get username
    # TODO is this working?
    email = json.loads(request.data)
    mail = db.zrevrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    pMail = json.loads(mail[0])
    oldCategory = pMail['category']
    pMail['category'] = email['category']
    pMail['categorized'] = True
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    db.zremrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    db.zadd("mail:exxonvaldeez:inbox", emailJSON, email['id'])
    db.smove("mail:exxonvaldeez:%s" % oldCategory, "mail:exxonvaldeez:%s" % pMail['category'], email['id'])
    return "Success"

@app.route('/mark_as_read', methods=["POST"])
def mark_email_read():
    # TODO get username
    # TODO test this
    email = json.loads(request.data)
    mail = db.zrevrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    pMail = json.loads(mail[0])
    pMail['read'] = True
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    db.zremrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    db.zadd("mail:exxonvaldeez:inbox", emailJSON, email['id'])
    return "Success"

@app.route('/mark_as_unread', methods=["POST"])
def mark_email_unread():
    # TODO get username
    # TODO test this
    email = json.loads(request.data)
    mail = db.zrevrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    pMail = json.loads(mail[0])
    pMail['read'] = False
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    db.zremrangebyscore("mail:exxonvaldeez:inbox", email['id'], email['id'])
    db.zadd("mail:exxonvaldeez:inbox", emailJSON, email['id'])
    return "Success"

@app.route('/delete_category', methods=['POST'])
def delete_category():
    # TODO get username
    # TODO test this
    category = json.loads(request.data)['category']
    newCategory = 1
    mail = db.smembers("mail:exxonvaldeez:%s" % category)
    for emailID in mail:
        # Move email in Redis
        db.smove("mail:exxonvaldeez:%s" % category, "mail:exxonvaldeez:%s" % newCategory, emailID)
        # Change category in object
        emailObj = db.zrevrangebyscore("mail:exxonvaldeez:inbox", emailID, emailID)
        pMail = json.loads(emailObj[0])
        pMail['category'] = newCategory
        emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
        db.zremrangebyscore("mail:exxonvaldeez:inbox", emailID, emailID)
        db.zadd("mail:exxonvaldeez:inbox", emailJSON, emailID)

# main
if __name__ == '__main__':
    app.run()
