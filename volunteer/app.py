from flask import Flask
from flask import render_template
from pytrends.request import TrendReq
from googlesearch import search

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('temp.html')

pytrends = TrendReq(hl='en-US', tz=360)
list_topics = pytrends.trending_searches(pn='united_states').values.tolist()

def most_common(topic):
    for j in search(topic, tld="co.in", num=1, stop=1):
        return j

# for i in list_topics:
#     print(most_common(i[0]))

if __name__ == "__main__":
    app.run(debug = False,port=8000)