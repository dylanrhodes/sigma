# sigma.py - main flask file for sigma.jmvldz.com # written by Josh Valdez

# imports
import json
from functools import wraps

from flask import Flask, render_template, jsonify, url_for, redirect
from flask import request, current_app, make_response
from flask.ext.login import LoginManager, login_user, current_user, login_required, logout_user

from app.db import db
from app.forms import LoginForm
from app.models import User
from classifier.offline_updater import retrain_models

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

# login manager
lm = LoginManager()
lm.init_app(app)
lm.login_view = 'landing'

@lm.user_loader
def load_user(userid):
    return User(username=userid, loader=True)

# routes
@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/mobile')
@login_required
def index_mobile():
    return render_template('mobile.html')

@app.route('/landing')
def landing():
    return render_template('landing.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user is not None and current_user.is_authenticated():
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User(username=form.email.data, password=form.password.data)
        if user.is_valid_login():
            login_user(user)
            return redirect(url_for('index'))
    return render_template("login.html", form=form, title="Sign In")

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user is not None and current_user.is_authenticated():
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User(username=form.email.data, password=form.password.data)
        if user.is_valid_login():
            login_user(user)
            return redirect(url_for('index'))
        elif form.new_account.data:
            login_user(user)
            # add login, add password
            db.getset("user:%s:login" % user.user, user.username)
            db.getset("user:%s:password" % user.user, user.password)
            # add to email list
            db.sadd("user:users", user.user)
            # add "untrained" to models
            db.getset("user:%s:trained" % user.user, "false")
            # add category
            category = {'id': 1, 'email': 3, 'split': 0, 'name': 'inbox'}
            categoryJSON = json.dumps(category, sort_keys=True, indent=4, separators=(',', ': '))
            db.getset("user:%s:categories" % user.user, categoryJSON)
            return redirect(url_for('index'))
    return render_template("signup.html", form=form, title="Sign In")

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/get_emails')
@jsonp
@login_required
def get_recent_email():
    # get emails from database
    #mail = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, "+inf", "-inf", 0, 10)
    mail = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, "+inf", "-inf")
    #print mail
    parsedMail = {}
    for email in mail:
        pMail = json.loads(email)
        parsedMail[pMail['id']] = pMail
    return jsonify(parsedMail)

@app.route('/get_category_unread')
@jsonp
@login_required
def get_category_unread():
    category = request.args.get('category')
    mail = db.smembers("mail:%s:%s" % (current_user.user, category))
    unread = 0
    for emailID in mail:
        emailObj = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, emailID, emailID)
        pMail = json.loads(emailObj[0])
        if not pMail['read']:
            unread += 1
    response = {'unread': unread, 'category': category}
    return jsonify(response)

@app.route('/categorize_email', methods=["POST"])
@login_required
def categorize_email():
    email = json.loads(request.data)
    mail = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, email['id'], email['id'])
    pMail = json.loads(mail[0])
    oldCategory = pMail['category']
    pMail['category'] = email['category']
    pMail['categorized'] = True
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    db.zremrangebyscore("mail:%s:inbox" % current_user.user, email['id'], email['id'])
    db.zadd("mail:%s:inbox" % current_user.user, emailJSON, email['id'])
    db.smove("mail:%s:%s" % (current_user.user, oldCategory), "mail:%s:%s" % (current_user.user, pMail['category']), email['id'])
    return "Success"

@app.route('/mark_as_read', methods=["POST"])
@login_required
def mark_email_read():
    email = json.loads(request.data)
    mail = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, email['id'], email['id'])
    pMail = json.loads(mail[0])
    pMail['read'] = True
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    db.zremrangebyscore("mail:%s:inbox" % current_user.user, email['id'], email['id'])
    db.zadd("mail:%s:inbox" % current_user.user, emailJSON, email['id'])
    return "Success"

@app.route('/mark_as_unread', methods=["POST"])
@login_required
def mark_email_unread():
    email = json.loads(request.data)
    mail = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, email['id'], email['id'])
    pMail = json.loads(mail[0])
    pMail['read'] = False
    emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
    db.zremrangebyscore("mail:%s:inbox" % current_user.user, email['id'], email['id'])
    db.zadd("mail:%s:inbox" % current_user.user, emailJSON, email['id'])
    return "Success"

@app.route('/get_categories')
@jsonp
@login_required
def get_categories():
    categoryString = db.get("user:%s:categories" % current_user.user)
    return make_response(categoryString)

@app.route('/add_categories', methods=['POST'])
@login_required
def add_categories():
    categories = json.loads(request.data)
    db.getset("user:%s:categories" % current_user.user, json.dumps(categories, sort_keys=True, indent=4, separators=(',', ': ')))
    return "Success"

@app.route('/delete_category', methods=['POST'])
@login_required
def delete_category():
    category = json.loads(request.data)['category']
    newCategory = 1
    mail = db.smembers("mail:%s:%s" % (current_user.user, category))
    for emailID in mail:
        # Move email in Redis
        db.smove("mail:%s:%s" % (current_user.user, category), "mail:%s:%s" % (current_user.user, newCategory), emailID)
        # Change category in object
        emailObj = db.zrevrangebyscore("mail:%s:inbox" % current_user.user, emailID, emailID)
        pMail = json.loads(emailObj[0])
        pMail['category'] = newCategory
        emailJSON = json.dumps(pMail, sort_keys=True, indent=4, separators=(',', ': '))
        db.zremrangebyscore("mail:%s:inbox" % current_user.user, emailID, emailID)
        db.zadd("mail:%s:inbox" % current_user.user, emailJSON, emailID)

@app.route('/train_models', methods=['POST'])
@login_required
def train_models():
    retrain_models(current_user.user)
    db.getset("user:%s:trained" % current_user.user, "true")
    return "Success"

# main
if __name__ == '__main__':
    app.run()
