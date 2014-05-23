from feature_extractor import extract_body_features, extract_header_features
from model_retriever import retrieve_models
from sklearn.svm import LinearSVC

'''
Classifies a given message for a given user into one or
more of the user's categories
'''

def classify(msg, username):
	body_vec, body_model, head_vec, head_model = retrieve_models(username)

	body_feat = extract_body_features(msg)
	body_feat = body_vec.transform(body_feat)

	head_feat = extract_header_features(msg)
	head_feat = head_vec.transform(head_feat)

	body_pred = body_model.predict(body_feat)
	head_pred = head_model.predict(head_feat)

	if body_pred[0] == head_pred[0]:
		return body_pred[0]
	else:
		return head_pred[0]
