# Adopted by Nicholas Breitweiser (nbreit@stanford.edu)
# for the Smart Email Client project
# CS194, Spring 2014 - Stanford University

from __future__ import unicode_literals
#from utils import sanitize
import getpass
import argparse
import redis
import json
import csv
import re


parser = argparse.ArgumentParser()
parser.add_argument("-f", "--filename", help="The name of the contacts file")

args = parser.parse_args()

FNAME_DEFAULT = 'google.csv'
fname = ''

if args.filename:
    fname = args.filname
elif not (FNAME_DEFAULT == ''):
    fname = FNAME_DEFAULT
else:
    fname = raw_input("Please enter the filename of the desired contacts list: ");

try:
    f = open(fname)
    reader = csv.reader(f)
    rownum = 0
    contact_list = []
    for row in reader:
        # Save header row.
        if rownum == 0:
            header = row
        else:
            colnum = 0
            found = {}
            for col in row:
                #print '%-8s: %s' % (header[colnum], col)
                matchObj = re.match(r'E-mail 1 - Value', header[colnum], re.M|re.I)
                if(header[colnum] == 'Name' or matchObj):
                    if(not (col == '')):
                        found[unicode('E-mail' if (header[colnum] == 'E-mail 1 - Value') else header[colnum])] = unicode(col)
                colnum += 1
            if (len(found)) >= 2:
                #print found
                contact_list.append(found)
        rownum += 1
    f.close()
    print contact_list
except Exception:
    print "Error opening file"


