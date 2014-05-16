import cPickle as pickle
import numpy
import redis
import json

'''
Retrieves stored classification data for a given user
'''

def retrieve_models(username):
	path = "./"+username+"/models/"

	body_vec = retrieve_object(path+"body_vec.pk1")
	body_model = retrieve_object(path+"body_model.pk1")
	head_vec = retrieve_object(path+"head_vec.pk1")
	head_model = retrieve_object(path+"head_model.pk1")

	return body_vec, body_model, head_vec, head_model

# TODO username MUST be only first part of email address <name> not
# <name>@<host>
def retrieve_data_db(username):
    rServer = redis.Redis("localhost")
    mail = rServer.zrevrangebyscore('mail:%s:inbox' % username, "+inf", "-inf")
    # TODO do these need to be numpy arrays?
    train_x = []
    train_y = []
    for email in mail:
        pMail = json.loads(email)
        pMail['precedence'] = "None"
        if pMail['categorized']:
            train_x.append(pMail)
            train_y.append(pMail['category'])

    body_x = []
    body_y = []
    body_y = numpy.array(body_y)

    head_x = []
    head_y = []
    head_y = numpy.array(head_y)

    return train_x, train_y, body_x, body_y, head_x, head_y

def retrieve_data(username):
	path = "./"+username+"/data/"

	train_x = retrieve_object(path+"train_x.pk1")
	train_y = retrieve_object(path+"train_y.pk1")
	body_x = retrieve_object(path+"body_x.pk1")
	body_y = retrieve_object(path+"body_y.pk1")
	head_x = retrieve_object(path+"head_x.pk1")
	head_y = retrieve_object(path+"head_y.pk1")

	if body_y == []:
		body_y = numpy.array(body_y)
	if head_y == []:
		head_y = numpy.array(head_y)

	return train_x, train_y, body_x, body_y, head_x, head_y

def retrieve_object(filename):
	try:
		curr_file = open(filename)
		contents = pickle.load(curr_file)
		curr_file.close()

		return contents
	except IOError:
		return []
