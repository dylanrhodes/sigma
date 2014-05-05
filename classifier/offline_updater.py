import mailbox
import preprocess
import model_retriever
import cPickle as pickle
import os

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

	for i in range(1,25):
		new_mail.append(mbox[i])

	update_vocabulary(username, vocab, new_mail)
	update_contacts(username, contacts, new_mail)

	#retrieve labelled set L and likely sets A,B

	#retrain_classifiers(username)

def retrain_classifiers(username, train, likely_body, likely_head):
	return None
	#dataset spec: [(msg, (tags)), (msg, (tags)), ..., (msg, (tags))]
	#tags = (0,1,1,0) if msg in sets 2 and 3

	#write new SVM models to file username_body.pk1, username_header.pk1

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

	