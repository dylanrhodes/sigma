# jmvldz.py - main flask file for jmvldz.com
# written by Josh Valdez

# imports
from flask import Flask, render_template
#from flask import request

# config - TODO
COMPANY = {'name': 'Joshua Miles Valdez'}

# application
app = Flask(__name__)
app.config.from_pyfile('config/sigma.cfg')

# routes
@app.route('/')
def show_index():
    return render_template('portfolio/index.html')

@app.route('/american-mind')
def show_vis():
    return render_template('portfolio/retweet_network.html')

# main
if __name__ == '__main__':
    app.run()
