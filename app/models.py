import re
from db import db

class User:
    def __init__(self, username):
        addr = re.split('@', "exxonvaldeez@gmail.com")
        user = db.get("user:%s:login" % addr[0])
        print addr
        print user
        if not user == username:
            print "Returning none"
            return None
        self.username = username
        self.user = addr[0]

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.username)

    def __repr__(self):
        return '<User %r>' % (self.username)
