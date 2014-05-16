# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
#from utils import sanitize
import getpass
import argparse
#import redis
import json
import re

from imapclient import IMAPClient
from email.parser import Parser

def extract_body_text(msg):
    body = ''
    charset = None

    if msg.is_multipart():
        for part in msg.walk():
            if part.is_multipart():
                for subpart in part.walk():
                    if subpart.get_content_type() == 'text/plain':
                        text = subpart.get_payload(decode=True)
                        charset = get_charset(subpart)
                        body = body + text.decode(charset)
            elif part.get_content_type() == 'text/plain':
                text = part.get_payload(decode=True)
                charset = get_charset(part)
                body = body + text.decode(charset)
    else:
        body = msg.get_payload(decode=True)
        charset = get_charset(msg)
        body = body.decode(charset)

    return re.sub(r'(?m)^\*.*\n?', '', body)

def get_charset(msg, default="ascii"):
    if msg.get_content_charset():
        return msg.get_content_charset()
    elif msg.get_charset():
        return msg.get_charset()

    return default

parser = argparse.ArgumentParser()
parser.add_argument("-u", "--username", help="The username for the desired account")
parser.add_argument("-p", "--password", help="The password for the desired account")

args = parser.parse_args()

UNAME_DEFAULT = 'exxonvaldeez@gmail.com'
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
for msgid, data in response.iteritems():
    emailUTF8 = data['RFC822'].encode('utf-8')
    msg = parser.parsestr(emailUTF8)
    #msg = sanitize.sanitize(msg)
    category = 3
    body = extract_body_text(msg)
    email = {'id': msgid, 'from': msg['From'], 'to': msg['To'], 'subject': msg['Subject'],
             'date': msg['Date'], 'cc': msg['CC'], 'category': category, 'read': False,
             'message': body, 'predicted': False, 'categorized': True} # TODO update this to False
    emailJSON = json.dumps(email, sort_keys=True, indent=4, separators=(',', ': '))
    rServer.zadd("mail:exxonvaldeez:inbox", emailJSON, msgid)
    rServer.sadd("mail:exxonvaldeez:%s" % str(category), msgid)

    #print msg.keys()

