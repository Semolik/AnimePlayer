from email import message
import re
import requests
import json
from bs4 import BeautifulSoup
from lxml import etree
from flask_restful import reqparse
from flask import Blueprint
from requests.utils import requote_uri
from config import ApiPath
from utils.lru_cache import timed_lru_cache
from utils.messages import messages
from settings import headers
ModulePath = 'anidub/'
AnidubLink = 'https://online.anidub.club/'
AnidubMirrorLink = 'https://online.anidub.club/'
LinkSplitter = '~'

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
@Module.route(ApiPath+ModulePath+'genres',  methods = ['post', 'get'])
def GenresRequest():
	data = GetGenres()
	if data.get('message'):
		return {'message': data.get('message'), 'status': 404}, 404
	return json.dumps({'data': data, 'status': 200})
@Module.route(ApiPath+ModulePath+'genre',  methods = ['post'])
def GenreRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("genre")
	parser.add_argument("page")
	params = parser.parse_args()
	genre = params.get('genre')
	if not genre:
		return "Не передан параметр genre", 400
	genre = requote_uri(genre)
	genres = GetGenres()
	for key, val in genres.items():
		# print(val)
		for item in val['links']:
			if item[1]==genre:
				genre_data = GetGenre(val.get('prelink')+"/"+item[1], params.get('page'))
				return genre_data, genre_data.get('status')
	return {'message': 'Жанр не найден', 'status': 404}, 404

@timed_lru_cache(60*10)
def GetPage(page):
	if page and not page.isdigit():
		return {
			'status': 400,
			'message': messages.get('error_page_number'),
		}
	return GetTitles(AnidubLink+'anime'+(f'/page/{page}' if page else ''))

	
@timed_lru_cache(60*60*6)
def GetGenres():
	response = requests.get(AnidubLink, headers=headers)
	response.encoding = 'utf8'
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		data = soup.select('header > .header-in > .header-menu > .submenu')
		genres = [i for i in data[0].select('.hm-right > li > a')]
		category = [i for i in data[0].select('.hm-left > ul:first-child > li > a')]
		return {
			# 'status': response.status_code,
			'genre': {
				'name': 'Жанр',
				'prelink': genres[0].get('href').split('/')[1],
				'links': FormatLinkList(genres)
			},
			'category': {
				'name': 'Тип',
				'prelink': category[0].get('href').split('/')[1],
				'links': FormatLinkList(category)
			}
				# 'pages': 'int(pages[-1].text)',
		}
	else:
		return {
			'status': response.status_code,
			'message': messages.get('not_response'),
		}
@timed_lru_cache(60*10)
def GetGenre(GenreUrl, page=None):
	Url = AnidubLink+GenreUrl
	if page is not None:
		if not page.isdigit():
			return {"message": messages['error_page_number'], 'status': 400}
		Url+=f'/page/{page}/'
	return GetTitles(Url)
def GetTitles(Url):
	response = requests.get(Url, headers=headers)
	response.encoding = 'utf8'
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		data = soup.select('.sect-content.sect-items > #dle-content')
		if not data:
			return 'Ошибка', 500
		data = data[0]
		outdata = list()
		titles = data.select('.th-item')
		if not titles:
			return {
				'status': 404,
				'message': messages.get(404),
		}
		for title in titles:
			th_in = title.select('.th-in')
			poster = th_in[0].select('.th-img > img')[0].get('data-src')
			title_info = {
				'poster': (poster if 'http' in poster else AnidubMirrorLink+poster),
				'id': LinkSplitter.join(th_in[0].get('href').split('/')[3:]).split('.')[0],#на конце кажой ссылки есть .html
			}
			ru_title = th_in[1].select('.th-title')
			if ru_title:
				ru_title_content = ru_title[0].text.split('[')
				if len(ru_title_content)>1:
					title_info['series'] = ru_title_content[-1][:-1]
				title_info['ru_title'] = ' '.join(ru_title_content[0].split())
			en_title = th_in[1].select('.th-subtitle')
			if en_title:
				title_info['en_title'] = ' '.join(en_title[0].text.split())
			outdata.append(title_info)
		pages = data.select('.navigation a')
		# if not pages:
		# 	return {
		# 		'status': 404,
		# 		'message': messages[404]
		# 	}
		return {
			'status': response.status_code,
			'data': {
				'data': outdata,
				'pages': int(pages[-1].text) if pages else 1,
			},
		}
	else:
		return {
			'status': response.status_code,
			'message': messages.get('not_response'),
		}
def FormatLinkList(a_tags):
	return [[i.text.lower(), i.get('href').split('/')[-1]] for i in a_tags]