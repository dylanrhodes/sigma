from preprocess import extract_body_text, preprocess

'''
Provides functions to extract feature vectors from emails
for both body and header classifiers
'''

def extract_body_features(msg):
	body_features = preprocess(msg['message'])

	if body_features == '' or body_features == None:
		print('ERROR: Invalid body features for message')
		print(msg['message'])

		return 'EMPTY_BODY_TEXT'

def extract_header_features(msg):
	text = msg['subject']
	words = preprocess(text)

	features = {}

	for word in words:
		features[word] = 1

	features['SENDER'] = msg['from'].lower()
	features['RECIPIENT'] = msg['to'].lower()

	if msg['cc'] != None:
		features['ADDL_RECIPIENTS'] = msg['cc'].lower()
	else:
		features['ADDL_RECIPIENTS'] = 'none'

	if msg['precedence'] != None:
		features['PRECEDENCE'] = msg['precedence'].lower()
	else:
		features['PRECEDENCE'] = 'none'

	return features

	#Features:
	#-words from subject
	#-sender's address
	#-additional recipients
	#-hasAttachment, attachmentType

