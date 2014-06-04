from preprocess import extract_body_text, preprocess

'''
Provides functions to extract feature vectors from emails
for both body and header classifiers
'''

def extract_body_features(msg):
	return preprocess(msg['message'])

def extract_header_features(msg):
	text = msg['Subject']
	words = preprocess(text)

	features = {}

	for word in words:
		features[word] = 1

	features['SENDER'] = msg['From'].lower()
	features['RECIPIENT'] = msg['To'].lower()

	if msg['cc'] != None:
		features['ADDL_RECIPIENTS'] = msg['CC'].lower()
	else:
		features['ADDL_RECIPIENTS'] = 'none'

	if msg['precedence'] != None:
		features['PRECEDENCE'] = msg['Precedence'].lower()
	else:
		features['PRECEDENCE'] = 'none'

	return features

	#Features:
	#-words from subject
	#-sender's address
	#-additional recipients
	#-hasAttachment, attachmentType

