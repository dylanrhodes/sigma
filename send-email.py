import smtplib
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("-f", "--fromaddr", help="The email address the desired message is coming from (Including the domain name!)")
parser.add_argument("-t", "--toaddrs", help="The email address the desired message is going to")
parser.add_argument("-m", "--message", help="The body of the desired message")
parser.add_argument("-s", "--subject", help="The subject of the desired message")
parser.add_argument("-p", "--password", help="The password for the sending account")


args = parser.parse_args()
fromaddr = args.fromaddr
toaddrs  = args.toaddrs
msg = 'Subject: %s\n\n%s' % (args.subject, args.message)

# Credentials (if needed)
username = (args.fromaddr.split('@'))[0]
password = args.password

# The actual mail send
server = smtplib.SMTP('smtp.gmail.com:587')
server.starttls()
server.login(username,password)
server.sendmail(fromaddr, toaddrs, msg)
server.quit()
