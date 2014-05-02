'''
This file controls the offline batch jobs run periodically
to update each users' classifiers, vocabularies, and contacts
'''

def batch_update(username):
	update_vocabulary(username)
	update_contacts(username)
	retrain_classifiers(username)

def retrain_classifiers(username):
	#retrieve labelled set L
	#retrieve likely sets A,B

	#retrain classifier A on L union B
	#retrain classifier B on L union A

	#write new SVM models to file username_body.pk1, username_header.pk1

def update_vocabulary(username):
	#vocab format: [word : (id, # docs word appears in)]

	#retrieve messages with timestamps greater than last update job
	#extract body text, preprocess
	#update frequency counts for each word

def update_contacts(username):
	#contact format: [contact : id]

	#similar to update_vocabulary, merge them?