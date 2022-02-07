from flask import Flask
import animevost
import anidub
from config import ApiPath
app = Flask(__name__, static_folder='app', static_url_path="/app")
from flask_cors import CORS
CORS(app)
app.register_blueprint(animevost.Animevost)
app.register_blueprint(anidub.Module)
@app.route(ApiPath+'services')
def servises():
    return {
        'animevost': {
            # 'title': 'Animevost',
            'genres': animevost.GetGenres(),
            }
        ,
        'anidub': {
            'genres': anidub.GetGenres(),
        }
    }
app.run(host='0.0.0.0',port=80,debug=True)
