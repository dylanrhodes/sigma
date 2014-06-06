import networkx as nx
import re

import model_retriever
from preprocess import preprocess, extract_body_text, strip

from string import punctuation

import nltk.data
from sklearn.feature_extraction.text import TfidfVectorizer
 
def rank_sentences(sentences):
    simple_sent = [preprocess(s) for s in sentences]

    sim_mat = TfidfVectorizer().fit_transform(simple_sent)
    nx_graph = nx.from_scipy_sparse_matrix(sim_mat * sim_mat.T)
    scores = nx.pagerank(nx_graph)

    results = ((scores[i], i, s) for i,s in enumerate(sentences))

    results = sorted(results, key=lambda result: result[1])
    results = sorted(results, key=lambda result: result[0], reverse=True)

    return results

def segment(msg):
	text = strip(msg['plain_body'])
	text = '\n'.join([l for l in text.split('\n') if len(l) > 0 and l[0] != '>'])

	tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

	sentences = tokenizer.tokenize(text, realign_boundaries=True)

	if len(sentences) > 2:
		sentences = sentences[0:len(sentences)-1]

	reply_pattern = "On [A-Z][a-z]+, [A-Z][a-z]+(.)? [0-9]+, [0-9]+( at [0-9]+:[0-9]+ [AMP]+)?, [A-Za-z\s]+ <[^@]+@[^@]+\.[^@]+>.?wrote:"
	output = [msg['subject']]

	for sentence in sentences:
		match = re.search(reply_pattern, sentence)

		if match != None:
			sentence = sentence[:match.start()]

		if len(sentence) > 300:
			for new_sent in sentence.split('\r\n\r\n'):
				output.append(new_sent)
		else:
			output.append(sentence)

	return [sentence for sentence in output if is_valid_sentence(sentence)]

def shorten(msg, MAX_CHARS = 300):
	sentences = segment(msg)

	if sum([len(s) for s in sentences]) + len(sentences) < MAX_CHARS:
		if len(sentences) != 0:
			return ' '.join(sentences)
		else:
			if len(msg['subject']) > 0:
				return msg['subject']
			else:
				return strip(msg['plain_body'])

	ranks = rank_sentences(sentences)

	summary, sentence_index = '', 0

	while len(summary) < MAX_CHARS and sentence_index < len(ranks):
		sentence = ranks[sentence_index][2]

		#Segment sentence into clauses and remove spurious ones
		summary = summary + ' ' + sentence

		sentence_index += 1

	summary = ' '.join(summary.split())

	if len(summary) > MAX_CHARS:
		return summary[0:MAX_CHARS]

	return summary

def is_valid_sentence(sentence):
	if len(sentence) < 10:
		return False

	if "Forwarded" in sentence or "Original" in sentence:
		if "----" in sentence:
			return False

	punc_count = sum([1 for char in sentence if char in punctuation])

	if punc_count > 0.2 * len(sentence):
		return False

	return True