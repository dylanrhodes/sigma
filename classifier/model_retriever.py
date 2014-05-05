import cPickle as pickle

'''
Retrieves stored classification data for a given user
'''

#Dummy implementation; should store and retrieve from files,
#caching some commonly used ones (how large are models in memory?)
def retrieve_models(username):
	if username == 'fdylanrhodes@gmail.com'
		return models

def retrieve_vocabulary(username):
	vocab_file = open('./'+username+'/vocab.pk1')
	vocab = cPickle.load(vocab_file)
	vocab_file.close()

	return vocab

def retrieve_contacts(username):
	contact_file = open('./'+username+'/contacts.pk1')
	contacts = cPickle.load(contact_file)
	contact_file.close()

	return contacts