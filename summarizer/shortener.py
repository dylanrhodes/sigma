import networkx as nx
import numpy as np

import model_retriever
from preprocess import preprocess, extract_body_text, strip

from string import punctuation

import nltk.data
from sklearn.feature_extraction.text import TfidfVectorizer

'''
Basic semantic text shortener using textrank algorithm and
rule based filtering
'''
 
def rank_sentences(text):
    sentence_tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    sentences = sentence_tokenizer.tokenize(text, realign_boundaries=True)

    simple_sent = []

    for sentence in sentences:
    	simple_sent.append(preprocess(sentence))

    '''
    all_sent, simple_sent = [], []

    for i in range(0,len(sentences)):
    	sentence = sentences[i]

    	if len(sentence) > 300 and i < len(sentences) - 1:
    		for line in sentence.split('\r\n'):
    			if len(line) > 5:
    				all_sent.append(line)
    				simple_sent.append(preprocess(line))
    	else:
    		all_sent.append(sentence)
    		simple_sent.append(preprocess(sentence))
    '''

    sim_mat = TfidfVectorizer().fit_transform(simple_sent)
    sim_graph = nx.from_scipy_sparse_matrix(sim_mat * sim_mat.T)
    scores = nx.pagerank(sim_graph)

    results = ((scores[i], i, s) for i,s in enumerate(sentences))

    results = sorted(results, key=lambda result: result[1])
    results = sorted(results, key=lambda result: result[0], reverse=True)

    return results

def shorten(msg, MAX_CHARS = 140):
	text = strip(extract_body_text(msg))

	valid_lines = []

	for line in text.split('\n'):
		if len(line) > 0 and line[0] != '>':
			valid_lines.append(line)

	text = '\n'.join(valid_lines)

	ranks = rank_sentences(text)

	summary, best_sent = '', 0

	while len(summary) < MAX_CHARS and best_sent < len(ranks):
		sentence_tuple = ranks[best_sent]

		if is_valid_summary(ranks, sentence_tuple):
			#Segment sentence into clauses and remove spurious ones
			summary = summary + ' ' + sentence_tuple[2]

		best_sent += 1

	#if len(summary) > MAX_CHARS:
	#	return summary[0:MAX_CHARS]

	return summary

def is_valid_summary(ranks, sentence_tuple):
	if sentence_tuple[1] == len(ranks) - 1 and len(ranks) > 3:
		return False

	if "Forwarded" in sentence_tuple[2] or "Original" in sentence_tuple[2]:
		if "----" in sentence_tuple[2]:
			return False

	punc_count = 0

	for character in sentence_tuple[2]:
		if character in punctuation:
			punc_count += 1

	if punc_count > 0.2 * len(sentence_tuple[2]):
		return False

	return True
