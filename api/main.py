
from re import M
from flask import Flask,send_from_directory
import animevost
import anidub
import hentaiz
import anihide
import os
from utils import messages
from config import ApiPath
from flask_restful import reqparse
app = Flask(__name__, static_url_path="/app",static_folder='../build')
# app = Flask(__name__, static_url_path="/app", static_folder='app')
from flask_cors import CORS
CORS(app)

modules = [animevost, anidub, hentaiz,anihide]
for module in modules:
	app.register_blueprint(module.Module)
@app.route(ApiPath+'services')
def servises():
	out = {}
	for module in modules:
		try:
			out[module.Moduleid] = {
				'title': module.ModuleTitle,
				'genres': module.GetGenres(),
				'horny': module.hentai
			}
		except:
			pass
	return out
@app.route(ApiPath+'home', methods=['POST'])
def index():
	parser = reqparse.RequestParser()
	parser.add_argument("horny")
	params = parser.parse_args()
	horny = params.get('horny') == 'True'
	data = list()
	for module in modules:
		if module.hentai!=horny:
			continue
		module_data = module.GetPage(None)
		if module_data.get('status')==200:
			module_data = module_data.get('data')
			module_data['title'] = module.ModuleTitle
			module_data['id'] = module.ModulePath.replace('/', '')
			module_data['icon'] = "/"+module.ModulePath.split('/')[0]+'/icon'
			data.append(module_data)
	return {'data' :data}
@app.route(ApiPath+'search', methods=['POST'])
def search():
	parser = reqparse.RequestParser()
	parser.add_argument("horny")
	parser.add_argument("text")
	params = parser.parse_args()
	horny = params.get('horny') == 'True'
	text = params.get('text')
	if not text:
		return messages['no_text'].format('text'),400
	data = list()
	for module in modules:
		if module.hentai!=horny:
			continue
		module_data = module.search(text, 1)
		if module_data.get('status')==200:
			module_data = module_data.get('data')
			module_data['title'] = module.ModuleTitle
			module_data['id'] = module.ModulePath.replace('/', '')
			data.append(module_data)
	return {'data' :data}
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
	if path != "" and os.path.exists(app.static_folder + '/' + path):
		return send_from_directory(app.static_folder, path)
	else:
		return send_from_directory(app.static_folder, 'index.html')
if __name__ == "__main__":
	app.run(host='0.0.0.0',port=80,debug=True)
