import cPickle as pickle

'''
Retrieves stored classification data for a given user
'''

#Dummy implementation; should store and retrieve from files,
#caching some commonly used ones (how large are models in memory?)
def retrieve_models(username):
	return None

def retrieve_vocabulary(username):
	try:
		vocab_file = open('./'+username+'/vocab.pk1')
		vocab = pickle.load(vocab_file)
		vocab_file.close()
	except IOError:
		vocab = {'TOTAL_NUM_MESSAGES' : 0,
					'TOTAL_NUM_WORDS' : 0}

	return vocab

def retrieve_contacts(username):
	try:
		contact_file = open('./'+username+'/contacts.pk1')
		contacts = pickle.load(contact_file)
		contact_file.close()
	except IOError:
		contacts = {'TOTAL_NUM_CONTACTS' : 0}

	return contacts