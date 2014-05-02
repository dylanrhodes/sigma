import feature_extractor
import model_retriever
from sklearn.svm import LinearSVC

'''
Classifies a given message for a given user into one or
more of the user's categories
'''

def classify(msg, username):
	body_feat = extract_body_features(msg, username)
	head_feat = extract_header_features(msg, username)

	#load SVMs from SVM holding class
	models = retrieve_models(username)

	output = []

	for model in models:
		#if msg is a member of the class (according to one? both? SVMs)
			output.append(class_id)

	return output