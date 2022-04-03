import requests
import json
from bs4 import BeautifulSoup
from flask_restful import reqparse
from flask import Blueprint, send_from_directory
from requests.utils import requote_uri
from config import ApiPath, UPLOAD_FOLDER
from utils.lru_cache import timed_lru_cache
from utils.messages import messages
from settings import headers
from utils.plyr import PlyrSource

ModuleTitle = "Anilibria"
Moduleid = 'anilibria'
ModulePath = Moduleid+'/'
ModuleSiteLink = 'https://anilibria.tv'
ModuleApiLink = 'https://api.anilibria.tv/'
hentai = True
Module = Blueprint(ModulePath, __name__)
@Module.route(ApiPath+ModulePath,  methods = ['post'])
def Page():
	parser = reqparse.RequestParser()
	parser.add_argument("page")
	params = parser.parse_args()
	data = GetPage(params.get('page'))
	if data.get('status')!=200:
		return data, data.get('status')
	return json.dumps(data), data.get('status')
@timed_lru_cache(60*10)
def GetPage(page):
	if page and not page.isdigit():
		return {
			'status': 400,
			'message': messages.get('error_page_number'),
		}
	return GetTitles(ModuleSiteLink+(f'/page/{page}' if page else ''))
def GetTitles(page):
	return

def AnilibriaApiPost(method, payload={}):
	respond = requests.post(AnimevostApiLink+method,data=payload)
	if respond:
		return respond.json()