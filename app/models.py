import re
from db import db

class User:
    def __init__(self, username="", password=""):
        addr = re.split('@', "exxonvaldeez@gmail.com")
        user = db.get("user:%s:login" % addr[0])
        if not user == username:
            return None
        self.username = username
        self.user = addr[0]
        self.password = password

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.username)

    def is_valid_login(self):
        pwd = db.get("user:%s:password" % self.user)
        if pwd == self.password:
            return True
        return False

    def __repr__(self):
        return '<User %r>' % (self.username)
