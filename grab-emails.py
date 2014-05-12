# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
import argparse, getpass

# Default values for testing purposes
UNAME_DEFAULT = ''
# password should NOT be stored in this file

from imapclient import IMAPClient
from email.parser import HeaderParser

parser = argparse.ArgumentParser()
parser.add_argument("-u", "--username", help="The username for the desired account")
parser.add_argument("-p", "--password", help="The password for the desired account")

args = parser.parse_args()

HOST = 'imap.gmail.com'
USERNAME = UNAME_DEFAULT
if args.username:
    USERNAME = args.username
if len(USERNAME) <= 0:
    USERNAME = raw_input("Please enter the username for your Gmail account: ");
PASSWORD = ''
if args.password:
    PASSWORD = args.password
else:
    PASSWORD = getpass.getpass("Please enter the password for the account {}@gmail.com: ".format(USERNAME));
ssl = True

server = IMAPClient(HOST, use_uid=True, ssl=ssl)
server.login(USERNAME, PASSWORD)

select_info = server.select_folder('INBOX')
messages = server.search(['NOT DELETED','SINCE 1-Apr-2014' ])

parser = HeaderParser()
print("Messages:")
response = server.fetch(messages, ['RFC822'])
for msgid, data in response.iteritems():
    msg = parser.parsestr(data['RFC822'].encode('utf-8'))
    print msg['From']
    print msg['To']
    print msg['Subject']
    #print msg.get_payload() # Print message body

