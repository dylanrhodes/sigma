# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
import json, argparse, subprocess

from imapclient import IMAPClient
from email.parser import Parser
from classifier.classify import classify
from utils.sanitize import extract_body
from app.db import db

HOST = 'imap.gmail.com'

def get_email(user):
    server = IMAPClient(HOST, use_uid=True, ssl=True)
    username = db.get("user:%s:login" % user)
    password = db.get("user:%s:password" % user)
    server.login(username, password)
    server.select_folder('INBOX', readonly=True)
    messages = server.search(['NOT DELETED','SINCE 25-May-2014' ])
    response = server.fetch(messages, ['RFC822', 'FLAGS'])
    for msgid, data in response.iteritems():
        # check for duplicates
        #print data['FLAGS']
        duplicate = db.zrangebyscore("mail:%s:inbox" % user, msgid, msgid)
        if duplicate:
            continue
        emailUTF8 = data['RFC822'].encode('utf-8')
        msg = parser.parsestr(emailUTF8)
        body = extract_body(msg)
        msg['message'] = body
        msg['subject'] = ('NoSubj' if (msg['Subject']==None or msg['Subject'] == "")  else msg['Subject'])
        msg['to'] = ('NoTo' if (msg['To']==None) else msg['To'])
        # TODO set unread
        email = {'id': msgid, 'from': msg['From'], 'to': msg['To'], 'subject': msg['Subject'],
                'date': msg['Date'], 'cc': msg['CC'], 'read': False,
                'message': body, 'categorized': False}
        trained = db.get("user:%s:trained" % user)
        if trained == "true":
            email['category'] = int(classify(msg, user))
        else:
            email['category'] = 1
        emailJSON = json.dumps(email, sort_keys=True, indent=4, separators=(',', ': '))
        db.zadd("mail:%s:inbox" % user, emailJSON, msgid)
        db.sadd("mail:%s:%s" % (user, email['category']), msgid)
    server.logout()

parser = Parser()
argparser = argparse.ArgumentParser()
argparser.add_argument("-u", "--username", help="The username for the desired account")
args = argparser.parse_args()

if args.username:
    get_email(args.username)
else:
    users = db.smembers("user:users")
    for user in users:
        print user
        subprocess.Popen(["python", "grab-emails.py", "-u", user])


