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

def extract_body_text(msg):
	rich_body, body = '', ''
	charset = None

	if msg.is_multipart():
		for part in msg.walk():
			if part.get_content_type() == 'text/plain' and not part.is_multipart():
				text = part.get_payload(decode=True)
				charset = get_charset(part)
				body = body + text.decode(charset)
			elif part.get_content_type() == 'text/html' and not part.is_multipart():
				text = part.get_payload(decode=True)
				charset = get_charset(part)
				rich_body = rich_body + text.decode(charset)
	else:
		body = msg.get_payload(decode=True)
		charset = get_charset(msg)
		body = body.decode(charset)

	return body

def get_charset(msg, default="ascii"):
	if msg.get_content_charset():
		return msg.get_content_charset()
	elif msg.get_charset():
		return msg.get_charset()

	return default

def remove_non_alpha(text):
	text = re.sub("[^a-zA-Z0-9'\s]","",text)
	
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
		return ' '.join(self.fed)

def preprocess(text):
	text = remove_non_alpha(text)
	
	text = text.split(' ')

	text = remove_stop_words(text)

	remove_words = []

	for word in text:
		if len(word) > 15 or len(word) < 3 or word.startswith('http'):
			remove_words.append(word)

	for word in remove_words:
		text.remove(word)

	return ' '.join(text)

def strip(text):
	stripper = MLStripper()
	stripper.feed(text)
	text = stripper.get_data()
	return text

def stem_words(text):
	stemmer = stem.porter.PorterStemmer()

	stems = []

	for word in text:
		stems.append(stemmer.stem(word))

	return stems

def remove_stop_words(text):
	return [w for w in text if not w in filter_words]