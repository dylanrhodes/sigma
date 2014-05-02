import preprocess
from collections import Counter

'''
Provides functions to extract feature vectors from emails
for both body and header classifiers
'''

def extract_body_features(msg, user_dict):
	text = extract_body_text(msg)
	words = preprocess(text)

	counts = Counter(words)

	N = user_dict['total_user_mail']

	output = {}

	for word, count in counts:
		output[user_dict[word][1]] = count * log(N / user_dict[word][2])

	return output

def extract_header_features(msg, user_contacts):
	text = msg['subject']
	words = preprocess(text)

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
