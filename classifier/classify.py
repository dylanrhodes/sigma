import feature_extractor
import model_retriever
from sklearn.svm import LinearSVC

'''
Classifies a given message for a given user into one or
more of the user's categories
'''

def classify(msg, username):
	body_feat = extract_body_features(msg, retrieve_vocabulary(username))
	head_feat = extract_header_features(msg, retrieve_contacts(username))

	models = retrieve_models(username)

	output = []

	for name, body_model, head_model in models:
		if body_model.predict(body_feat) == 1 && 
			head_model.predict(head_feat) == 1:
			output.append(name)

	if len(output) == 0:
		output.append('Misc')

	return output