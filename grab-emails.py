# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
#from utils import sanitize
import getpass
import argparse
import redis
import json

from imapclient import IMAPClient
from email.parser import Parser
from classifier.offline_updater import retrain_models
from classifier.classify import classify

def extract_body(msg):
    body = ''
    charset = None
    for part in msg.walk():
        #if part.is_multipart():
        #    for subpart in part.walk():
        #        if subpart.get_content_type() == 'text/plain':
        #            continue
        if part.get_content_type() == 'text/plain' and not part.is_multipart():
            text = part.get_payload(decode=True)
            charset = get_charset(part)
            body += text.decode(charset, 'ignore')
    return body

def get_charset(msg, default="ascii"):
    if msg.get_content_charset():
        return msg.get_content_charset()
    elif msg.get_charset():
        return msg.get_charset()

    return default

#retrain_models('fdylanrhodesgmailcom')

parser = argparse.ArgumentParser()
parser.add_argument("-u", "--username", help="The username for the desired account")
parser.add_argument("-p", "--password", help="The password for the desired account")

args = parser.parse_args()

UNAME_DEFAULT = 'nbreitweiser@gmail.com'
HOST = 'imap.gmail.com'
USERNAME = UNAME_DEFAULT

if args.password:
    PASSWORD = args.password
else:
    PASSWORD = getpass.getpass("Please enter the password for the account {}@gmail.com: ".format(USERNAME));

ssl = True

server = IMAPClient(HOST, use_uid=True, ssl=ssl)
server.login(USERNAME, PASSWORD)

select_info = server.select_folder('INBOX', readonly=True)
messages = server.search(['NOT DELETED','SINCE 1-Apr-2014' ])

rServer = redis.Redis("localhost")
parser = Parser()
response = server.fetch(messages, ['RFC822'])
switchCategory = 0
for msgid, data in response.iteritems():
    emailUTF8 = data['RFC822'].encode('utf-8')
    msg = parser.parsestr(emailUTF8)
    #msg = sanitize.sanitize(msg)
    category = 3
    if switchCategory > 5:
        category = 2
    body = extract_body(msg)
    msg['message'] = body
    msg['Subject'] = ('NoSubj' if (msg['Subject']==None)  else msg['Subject'])
    email = {'id': msgid, 'from': msg['From'], 'to': msg['To'], 'subject': msg['Subject'],
             'date': msg['Date'], 'cc': msg['CC'], 'category': category, 'read': False,
             'message': body, 'predicted': False, 'categorized': True} # TODO update this to False
    #print "message: "+msg['message']
    print "subject: "+msg['Subject']
    email['category'] = classify(msg, 'fdylanrhodesgmailcom')
    print "category: "+str(email['category'])
    emailJSON = json.dumps(email, sort_keys=True, indent=4, separators=(',', ': '))
    rServer.zadd("mail:exxonvaldeez:inbox", emailJSON, msgid)
    rServer.sadd("mail:exxonvaldeez:%s" % str(category), msgid)

    switchCategory += 1
    #print msg.keys()

