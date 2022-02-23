from re import M
from flask import Flask,send_from_directory
import animevost
import anidub
import hentaiz
from config import ApiPath
app = Flask(__name__, static_folder='app', static_url_path="/app")
from flask_cors import CORS
CORS(app)
modules = [animevost, anidub, hentaiz]
app.register_blueprint(animevost.Animevost)
app.register_blueprint(anidub.Module)
app.register_blueprint(hentaiz.Module)
@app.route(ApiPath+'services')
def servises():
    return {
        'animevost': {
            'title': 'Animevost',
            'genres': animevost.GetGenres(),
        },
        'anidub': {
            'title': 'Anidub',
            'genres': anidub.GetGenres(),
        },
        'hentaiz': {
            'title': 'HentaiZ',
            'genres': hentaiz.GetGenres(),
        }
    }
@app.route(ApiPath+'home')
def index():
    data = list()
    for module in modules:
        module_data = module.GetPage(None)
        module_data['title'] = module.ModuleTitle
        data.append(module_data)
    return {'data' :data}
app.run(host='0.0.0.0',port=80,debug=True)
