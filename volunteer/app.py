from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('temp.html')

@app.route("/sitemap.txt")
def sitemap():
    return render_template('sitemap.txt')

if __name__ == "__main__":
    app.run(debug = False,port=8000)