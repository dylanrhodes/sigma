# Copyright (c) 2013, Menno Smits
# Released subject to the New BSD License
# Please see http://en.wikipedia.org/wiki/BSD_licenses

# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
import argparse, getpass, gzip

# Default values for testing purposes
UNAME_DEFAULT = ''
# password should NOT be stored in this file

from imapclient import IMAPClient

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
print('%d messages in INBOX' % select_info['EXISTS'])

messages = server.search(['NOT DELETED','SINCE 1-Apr-2014' ])
print("%d messages that aren't deleted since April 1" % len(messages))

print()
print("Messages:")
response = server.fetch(messages, ['RFC822'])
for msgid, data in response.iteritems():
    print('   ID %d:\nContents:\n %s\n' % (msgid,
                                            data['RFC822']))

print()
print("Saving to disk...")

# repr is more specific than string: http://satyajit.ranjeev.in/2012/03/14/python-repr-str.html
file_contents = repr(response)

# compression level 5 seems to be the most efficient for email: (http://soc.sty.nu/2013/10/best-zfs-compression-algorithm-for-email-3/)
f = gzip.open('example_archive.txt.gz', 'wb', 5)
f.write(file_contents)
f.close()

print("Finished saving to disk. Total size: 0")
