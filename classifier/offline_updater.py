import mailbox
import preprocess
from feature_extractor import extract_body_features, extract_header_features
import model_retriever
import cPickle as pickle
import os
import numpy

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import DictVectorizer
from sklearn.svm import LinearSVC

'''
This file controls the offline batch jobs run periodically
to update each users' classifiers, vocabularies, and contacts
'''

def batch_update(username, filename):
	#retrieve existing vocabulary and contacts lists

	vocab = model_retriever.retrieve_vocabulary(username)
	contacts = model_retriever.retrieve_contacts(username)

	#retrieve emails since last offline update

	mbox = mailbox.mbox(filename)
	new_mail = []

	for msg in mbox:
		new_mail.append(msg)

	update_vocabulary(username, vocab, new_mail)
	update_contacts(username, contacts, new_mail)

	retrain_models(username)

def retrain_models(username):
	train_x, train_y, body_x, body_y, head_x, head_y = model_retriever.retrieve_data_db(username)

	b_train_x = []
	b_train_y = numpy.concatenate([body_y, train_y])

	for msg in (body_x + train_x):
		b_train_x.append(extract_body_features(msg))

	body_vec = TfidfVectorizer(norm="l2")
	b_train_x = body_vec.fit_transform(b_train_x)

	h_train_x = []
	h_train_y = numpy.concatenate([head_y, train_y])

	for msg in (head_x + train_x):
		h_train_x.append(extract_header_features(msg))
	
	head_vec = DictVectorizer()
	h_train_x = head_vec.fit_transform(h_train_x)

	body_model, head_model = LinearSVC(), LinearSVC()

	body_model.fit(b_train_x, b_train_y)
	head_model.fit(h_train_x, h_train_y)

        print("Finished training models for "+username+"...")

	store_models(username, body_vec, body_model, head_vec, head_model)

#vocab format: [word : (id, # docs word appears in)]
def update_vocabulary(username, vocab, new_mail):
	num_msg = vocab['TOTAL_NUM_MESSAGES']
	num_words = vocab['TOTAL_NUM_WORDS']

	if num_msg == None:
		num_msg = 0
	if num_words == None:
		num_words = 0

	for msg in new_mail:
		text = preprocess.extract_body_text(msg)
		words = set(preprocess.preprocess(text))

		num_msg += 1

		for word in words:
			try:
				entry = vocab[word]
			except KeyError:
				num_words += 1
				entry = (num_words, 1)
			else:
				entry = (entry[0], entry[1]+1)

			vocab[word] = entry

	vocab['TOTAL_NUM_MESSAGES'] = num_msg
	vocab['TOTAL_NUM_WORDS'] = num_words

	print(vocab)

	filename = './'+username+'/vocab.pk1'

	store_object(vocab, filename)

#contact format: [contact : id]
def update_contacts(username, contacts, new_mail):
	num_contacts = contacts['TOTAL_NUM_CONTACTS']

	if num_contacts == None:
		num_contacts = 0

	for msg in new_mail:
		sender = msg['from'].lower()

		try:
			id = contacts[sender]
		except KeyError:
			num_contacts += 1
			contacts[sender] = num_contacts

	contacts['TOTAL_NUM_CONTACTS'] = num_contacts

	print(contacts)

	filename = './'+username+'/contacts.pk1'

	store_object(contacts, filename)

def store_object(object, filename):
	folder = os.path.dirname(filename)

	if not os.path.exists(folder):
		os.makedirs(folder)

	with open(filename, 'wb') as output:
		pickle.dump(object, output, pickle.HIGHEST_PROTOCOL)

def store_models(username, body_vec, body_model, head_vec, head_model):
	path = "./"+username+"/models/"

	store_object(body_vec, path+"body_vec.pk1")
	store_object(body_model, path+"body_model.pk1")
	store_object(head_vec, path+"head_vec.pk1")
	store_object(head_model, path+"head_model.pk1")

	
