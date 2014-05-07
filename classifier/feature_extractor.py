from preprocess import extract_body_text, preprocess
from collections import Counter
from math import log

'''
Provides functions to extract feature vectors from emails
for both body and header classifiers
'''

def extract_body_features_dep(msg, user_dict):
	text = preprocess.extract_body_text(msg)

	words = preprocess.preprocess(text)

	counts = Counter(words)

	N = user_dict['TOTAL_NUM_MESSAGES']

	output = {}

	for word in counts:
		count = counts[word]

		try:
			entry = user_dict[word]
			output[entry[0]] = count * log((N*1.0) / entry[1])
		except KeyError:
			pass	

	return output

def extract_body_features(msg):
	return preprocess(extract_body_text(msg))

def extract_header_features(msg):
	text = msg['subject']
	words = preprocess(text)

	features = {}

	for word in words:
		features[word] = 1

	features['SENDER'] = msg['from'].lower()

	return features

	#Features:
	#-words from subject
	#-sender's address
	#-additional recipients
	#-hasAttachment, attachmentType

