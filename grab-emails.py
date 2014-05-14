# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
#import getpass
import argparse
import redis
import json

from imapclient import IMAPClient
from email.parser import HeaderParser

parser = argparse.ArgumentParser()
parser.add_argument("-u", "--username", help="The username for the desired account")
parser.add_argument("-p", "--password", help="The password for the desired account")

args = parser.parse_args()

UNAME_DEFAULT = 'exxonvaldeez@gmail.com'
HOST = 'imap.gmail.com'
USERNAME = UNAME_DEFAULT
#if args.username:
#    USERNAME = args.username
#if len(USERNAME) <= 0:
#   USERNAME = raw_input("Please enter the username for your Gmail account: ");
PASSWORD = 'caOfdFiU0nzzsjx9LBnt'
#if args.password:
#    PASSWORD = args.password
#else:
#    PASSWORD = getpass.getpass("Please enter the password for the account {}@gmail.com: ".format(USERNAME));
ssl = True

server = IMAPClient(HOST, use_uid=True, ssl=ssl)
server.login(USERNAME, PASSWORD)

select_info = server.select_folder('INBOX', readonly=True)
messages = server.search(['NOT DELETED','SINCE 1-Apr-2014' ])

rServer = redis.Redis("localhost")
parser = HeaderParser()
response = server.fetch(messages, ['RFC822'])
for msgid, data in response.iteritems():
    emailUTF8 = data['RFC822'].encode('utf-8')
    msg = parser.parsestr(emailUTF8)
    email = {'id': msgid, 'from': msg['From'], 'to': msg['To'], 'subject': msg['Subject'],
             'date': msg['Date'], 'cc': msg['CC'], 'category': 0, 'read': False}
             #'message': msg.get_payload()}
    emailJSON = json.dumps(email, sort_keys=True, indent=4, separators=(',', ': '))
    category = 0
    rServer.zadd("mail:exxonvaldeez:inbox", emailJSON, msgid)
    rServer.sadd("mail:exxonvaldeez:%s" % str(category), msgid)
    #print msg.keys()
    #print msg['From']
    #print msg['To']
    #print msg['Subject']
    #print msg.get_payload() # Print message body

