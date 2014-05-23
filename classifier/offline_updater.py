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
from sklearn.linear_model import RidgeClassifier

'''
This file controls the offline batch jobs run periodically
to update each users' classifiers, vocabularies, and contacts
'''

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

	body_model = LinearSVC(loss='l2', penalty="l2", dual=False, tol=1e-3)
	head_model = RidgeClassifier(tol=1e-2, solver="lsqr")

	body_model.fit(b_train_x, b_train_y)
	head_model.fit(h_train_x, h_train_y)

        print("Finished training models for "+username+"...")

	store_models(username, body_vec, body_model, head_vec, head_model)

def store_object(object, filename):
	folder = os.path.dirname(filename)

	if not os.path.exists(folder):
		os.makedirs(folder)

	with open(filename, 'wb') as output:
		pickle.dump(object, output, pickle.HIGHEST_PROTOCOL)

def store_models(username, body_vec, body_model, head_vec, head_model):
	path = "/home/jmvldz/sigma/classifier/"+username+"/models/"

	store_object(body_vec, path+"body_vec.pk1")
	store_object(body_model, path+"body_model.pk1")
	store_object(head_vec, path+"head_vec.pk1")
	store_object(head_model, path+"head_model.pk1")
