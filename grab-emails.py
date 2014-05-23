# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
import json

from imapclient import IMAPClient
from email.parser import Parser
from classifier.classify import classify
from utils.sanitize import extract_body
from app.db import db

HOST = 'imap.gmail.com'

server = IMAPClient(HOST, use_uid=True, ssl=True)

parser = Parser()
switchCategory = 0

users = db.smembers("user:users")
for user in users:
    username = db.get("user:%s:login" % user)
    password = db.get("user:%s:password" % user)
    server.login(username, password)
    select_info = server.select_folder('INBOX', readonly=True)
    messages = server.search(['NOT DELETED','SINCE 1-Apr-2014' ])
    response = server.fetch(messages, ['RFC822'])
    for msgid, data in response.iteritems():
        emailUTF8 = data['RFC822'].encode('utf-8')
        msg = parser.parsestr(emailUTF8)
        body = extract_body(msg)
        msg['message'] = body
        msg['Subject'] = ('NoSubj' if (msg['Subject']==None)  else msg['Subject'])
        email = {'id': msgid, 'from': msg['From'], 'to': msg['To'], 'subject': msg['Subject'],
                'date': msg['Date'], 'cc': msg['CC'], 'read': False,
                'message': body, 'predicted': True, 'categorized': True} # TODO update this to False
        # TODO fix this
        email['category'] = classify(msg, 'exxonvaldeez')
        #print "subject: "+msg['Subject']
        print "category: "+str(email['category'])
        emailJSON = json.dumps(email, sort_keys=True, indent=4, separators=(',', ': '))
        db.zadd("mail:%s:inbox" % user, emailJSON, msgid)
        db.sadd("mail:%s:%s" % (user, email['category']), msgid)

