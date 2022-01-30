from flask import Flask
import animevost
from config import ApiPath
app = Flask(__name__, static_folder='app', static_url_path="/app")
from flask_cors import CORS
CORS(app)
from flask import Flask, render_template, url_for
app.register_blueprint(animevost.Animevost)
@app.route(ApiPath+'services')
def servises():
    return {
        'animevost': {
            # 'title': 'Animevost',
            'genres': animevost.GetGenres(),
            }
        ,
        'anidub': {
            'genres': animevost.GetGenres(),
        }
    }
app.run(host='0.0.0.0',port=80,debug=True)
