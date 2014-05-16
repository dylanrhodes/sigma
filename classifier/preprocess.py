import sys
import mailbox
import email
from nltk import stem
from nltk.corpus import stopwords
import re
from HTMLParser import HTMLParser

'''
Reads in emails from an mbox file and preprocesses the body
text by stripping html, sending to lowercase, tokenizing, 
removing stop words, and stemming all remaining words.

TODO: extract_body_text does not handle multipart messages well
TODO: additional preprocessing (see preprocess method)

Command line usage:
python preprocess.py filename.mbox
'''

filter_words = stopwords.words('english')

def read_mbox(filename):
	mbox = mailbox.mbox(filename)
	
	for i in range(1,10):
		text = extract_body_text(mbox[i])
		print(preprocess(text))

def extract_body_text(msg):
	body = ''
	charset = None

	if msg.is_multipart():
		for part in msg.walk():
			if part.is_multipart():
				for subpart in part.walk():
					if subpart.get_content_type() == 'text/plain':
						text = subpart.get_payload(decode=True)
						charset = get_charset(subpart)
						body = body + text.decode(charset)
			elif part.get_content_type() == 'text/plain':
				text = part.get_payload(decode=True)
				charset = get_charset(part)
				body = body + text.decode(charset)
	else:
		body = msg.get_payload(decode=True)
		charset = get_charset(msg)
		body = body.decode(charset)

	return re.sub(r'(?m)^\*.*\n?', '', body)

def get_charset(msg, default="ascii"):
	if msg.get_content_charset():
		return msg.get_content_charset()
	elif msg.get_charset():
		return msg.get_charset()

	return default

def remove_non_alpha(text):
	stripper = MLStripper()
	stripper.feed(text)
	text = stripper.get_data()

	text = re.sub('[^a-zA-Z0-9\s]','',text)
	
	return text

class MLStripper(HTMLParser):
	def __init__(self):
		self.reset()
		self.fed = []

	def clear():
		self.reset()
		self.fed = []

	def handle_data(self, d):
		self.fed.append(d)

	def get_data(self):
		return ''.join(self.fed)

def preprocess(text):
	text = remove_non_alpha(text)
	
	text = text.lower()
	text = text.split()

	#TODO: perform spellchecking

	for word in text:
		if len(word) > 15 or len(word) < 3:
			text.remove(word)

	text = remove_stop_words(text)
	text = stem_words(text)

	return ' '.join(text)

def stem_words(text):
	stemmer = stem.porter.PorterStemmer()

	stems = []

	for word in text:
		stems.append(stemmer.stem(word))

	return stems

def remove_stop_words(text):
	return [w for w in text if not w in filter_words]