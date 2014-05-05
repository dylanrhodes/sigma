import preprocess
from collections import Counter

'''
Provides functions to extract feature vectors from emails
for both body and header classifiers
'''

def extract_body_features(msg, user_dict):
	#text = preprocess.extract_body_text(msg)
	test = 'this is a test banana'

	words = preprocess.preprocess(text)

	counts = Counter(words)

	N = user_dict['total_user_mail']

	output = {}

	for word, count in counts:
		entry = user_dict[word]

		if entry != None:
			output[entry[1]] = count * log(N / entry[2])

	return output

def extract_header_features(msg, user_contacts):
	text = msg['subject']
	words = preprocesss.preprocess(text)

	output = {}

	for word in words:
		output[word] = 1

	address = msg['from']
	id = user_contacts[address]

	if id == None:
		id = -1

	output[address] = id

	#Features:
	#-words from subject
	#-sender's address
	#-additional recipients
	#-hasAttachment, attachmentType

