from operator import le
from turtle import title
from urllib import response
import requests
import json
from bs4 import BeautifulSoup
from lxml import etree
from flask_restful import reqparse
from flask import Blueprint
from requests.utils import requote_uri
from config import ApiPath
from functools import lru_cache, wraps
from datetime import datetime, timedelta
from shikimori_api import Shikimori
import re

shikimori_session = Shikimori()
shikimori_api = shikimori_session.get_api()
ShikimoriLink = 'https://shikimori.one/'
AnimeVostPath = 'animevost/'
AnimevostLink = "https://v2.vost.pw/"
AnimevostMirrorLink = {}
AnimevostApiLink = "https://api.animevost.org/v1/"
headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'uk,en-US;q=0.9,en;q=0.8,ru;q=0.7',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
	'Content-Type': 'text/html; charset=utf-8',
}
messages = {
	'error_page_number' : 'Не корректный номер страницы',
	'error_id' : 'Не корректный id',
	404 : 'На сайте нет информации по данному запросу',
	'not_response': "Сайт не ответил на запрос",
}
genres__ = {}
Animevost = Blueprint(AnimeVostPath, __name__)
def timed_lru_cache(seconds: int, maxsize: int = 128):
	def wrapper_cache(func):
		func = lru_cache(maxsize=maxsize)(func)
		func.lifetime = timedelta(seconds=seconds)
		func.expiration = datetime.utcnow() + func.lifetime
		@wraps(func)
		def wrapped_func(*args, **kwargs):
			if datetime.utcnow() >= func.expiration:
				func.cache_clear()
				func.expiration = datetime.utcnow() + func.lifetime
			return func(*args, **kwargs)
		return wrapped_func
	return wrapper_cache
def IdFromLink(url):
	return int(url.split('/')[-1].split('-')[0])
def GetTitle(fullTitle):
	return ' '.join(fullTitle.split('/',  maxsplit=1)[0].split())
def GetOriginalTitle(fullTitle):
	return ' '.join(fullTitle.split('/',  maxsplit=1)[1].split('[')[0].split())
def FindGenre(name):
	if isinstance(name, str):
		name_lower = name.lower()
		genres = GetGenres()
		for key, value  in genres.items():
			for j in value.get('links'):
				if j[0]==name_lower:
					return [name, j[1]]
@timed_lru_cache(60*60*6)
def GetMirror():
	if AnimevostMirrorLink:
		return AnimevostMirrorLink.get('url')
	response = requests.get(AnimevostLink)
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		block = soup.select('#moduleLeft-1 > .interDub > a')
		if block:
			AnimevostMirrorLink['url'] = block[0].get('href')
			return AnimevostMirrorLink['url']
def Sorting(item):
	name = item.get('name')
	numbers = re.findall('[0-9]+', name)
	if numbers:
		return int(numbers[0])
	return -1
def SortPlaylist(playlist):
	series = list()
	other = list()
	for i in playlist:
		if 'серия' in i.get('name').lower():
			series.append(i)
		else:
			other.append(i)
	if series:
		series = sorted(series, key=Sorting)
	other = sorted(other, key=lambda _: _.get('name'))
	return series+other
def AnimevostApiGet(method, payload={}):
	respond = requests.get(AnimevostApiLink+method,params=payload)
	if respond:
		respond_json = respond.json()
		if respond_json['state']['status'] == 'ok':
			return respond_json
def AnimevostApiPost(method, payload={}):
	respond = requests.post(AnimevostApiLink+method,data=payload)
	if respond:
		return respond.json()
def SearchOnShikimori(name, kind):
	response = requests.get(f'https://shikimori.one/animes/autocomplete/v2?search={requote_uri(name)}', headers=headers)
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		titles = soup.find_all('div', class_='b-db_entry-variant-list_item')
		if titles:
			for title in titles:
				if not kind:
					return title.get('data-id')
				tags = title.select('.b-tag.linkeable')
				if tags:
					if tags[0].get('data-href') == ShikimoriLink+'animes/kind/'+kind:
						return title.get('data-id')
			return titles[0].get('data-id')
def FormatingAnimevostResponse(response_item):
	text = response_item.get('title')
	title = text.replace('\\"', '"')
	data = {
		'ru_title': GetTitle(title),
		'en_title': GetOriginalTitle(title),
		'poster' : response_item.get('urlImagePreview'),
		'timer' : response_item.get('timer'),
		'id': response_item.get('id'),
		'rating': round(response_item.get('rating')/response_item.get('votes')*2, 1),
		'year' : response_item.get('year'),
		'genre' : response_item.get('genre').split(', '),
		'announce': response_item.get('series')=='',
	}
	# series = text.split(" /")
	# if len(series)>1:
	# 	series = series[1].split("] [")
	# 	if len(series)==1:
	# 		series = series[0].split(' [')
	# 		if len(series)>1:
	# 			data['series'] = series[1][:-1]
	# 	else:
	# 		series[0] = series[0][1:]
	# 		if len(series)>1:
	# 			series[1] = series[1][:-1]
	# 		data['series'] = series
	return data
	
@timed_lru_cache(60*10)
def GetPage(page=None):
	size = 20
	if not page:
		page=1
	elif not page.isdigit():
		return messages['error_page_number']
	respond = AnimevostApiGet('last',{
		'page' : page,
		'quantity' : size,
	})
	if not respond:
		return 'Апи animevost не отвечает'
	data = list()
	for i in respond.get('data'):
		data.append(FormatingAnimevostResponse(i))
	return {
		'pages': respond.get('state').get('count')//size,
		'data': data,
	}
def GenerateTitleResponse(response):
	data = response.get('data')[0]
	data['description']=' '.join(data.get('description').replace('\\', '').split()).replace('<br /> <br />', '\n')
	data['title'] = data.get('title').replace('\\', '')
	data['ru_title'] = GetTitle(data.get('title'))
	data['en_title'] = GetOriginalTitle(data.get('title'))
	data['rating']=round(data.get('rating')/data.pop('votes')*2, 1)
	data['poster'] = data.pop('urlImagePreview')
	genre = data.get('genre')
	if genre:
		out_genre = list()			
		for i in genre.lower().split(', '):
			gen=FindGenre(i)
			if gen:
				out_genre.append(gen)
			else:
				out_genre.append([i])
		data['genre'] = out_genre
	year = FindGenre(data.get('year'))
	if year:
		data['year'] = year
	else:
		data['year'] = [data.get('year')]
	series = AnimevostApiPost('playlist', {'id': data.get('id')})
	if series:
		data['series']={
			'info': re.findall('\[(.*?)\]', data.get('title')),
			'data':SortPlaylist(series),
		}
	else:
		data['series'] = None
	title_types = {
		"ТВ" : 'tv',
		"OVA": 'ova',
		"ONA": 'ona',
		"ТВ-спэшл": 'special',
		"полнометражный фильм": 'movie'
	}
	shikimori_id = SearchOnShikimori(data['en_title'], title_types.get(data.get('type')))
	title_type = FindGenre(data.get('type'))
	if title_type:
		data['type'] = title_type
	else:
		data['type'] = [data.get('type')]
	if shikimori_id:
		shikimori_req = shikimori_api.animes(shikimori_id)
		shikimori_data = shikimori_req.GET()
		data['shikimori'] = shikimori_data
		if shikimori_data.get('screenshots'):
			screenshots = [ ]
			for i in  shikimori_req.screenshots.GET():
				item = {}
				for j in i:
					item[j] = ShikimoriLink+i[j]
				screenshots.append(item)
			data['shikimori']['screenshots'] = screenshots
		score = shikimori_data.get('score')
		if score:
			data['shikimori']['score']=float(score)
		data['shikimori']['url'] = ShikimoriLink+shikimori_data.get('url')
		image = shikimori_data.get('image')
		if image:
			for i in image:
				image[i] = ShikimoriLink+image[i]
			data['shikimori']['image'] = image
	else:
		data['shikimori'] = None
	return data
@timed_lru_cache(60*60)
def GetTitleById(title_id):
	if not title_id.isdigit():
		return {"message": messages['error_id'],'status': 404}
	response = AnimevostApiPost('info', {'id': int(title_id)})
	if response:
		return {
			'data': GenerateTitleResponse(response),
			'status':200,
		}
	else:
		return {"message": messages[404],'status': 404}
def FormatLinkList(a_tags):
	return [[i.text.lower(), i.attrib.get('href').split('/')[-2]] for i in a_tags]
def get_genre_data(tree, xpath, end_path):
	a = tree.xpath(xpath+'/a')[0]
	return {
		'name': a.text,
		'prelink' : a.attrib.get('href').replace('/', ''),
		'links' : FormatLinkList(tree.xpath(xpath+end_path)),
	}
@timed_lru_cache(60*60*6)
def GetGenres(html=None):
	if genres__:
		return genres__
	if not html:
		response = requests.get(AnimevostLink, headers=headers)
		if not response:
			return
		html = response.text
	tree = etree.HTML(html)
	genre_xpath = '/html/body/div/div[2]/div[1]/ul/li[2]'
	category_xpath = '/html/body/div/div[2]/div[1]/ul/li[3]'
	year_xpath = '/html/body/div/div[2]/div[1]/ul/li[4]'
	year =  get_genre_data(tree,year_xpath,'/span/span/a')
	year['links'] = year['links'][::-1]
	data = {
		'genre': get_genre_data(tree,genre_xpath,'/div/span/a'),
		'category': get_genre_data(tree,category_xpath,'/span/span/a'),
		'year':	year,
		# 'ongoing': '/ongoing/',
		# 'preview': '/preview/'
	}
	for key, value in data.items():
		genres__[key] = value
	return genres__
@timed_lru_cache(60*10)
def GetTitles(Url):
	response = requests.get(Url)
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		titles = soup.find_all('div', class_='shortstory')
		if not titles:
			return {"message":messages[404]}
		output = list()
		for i in titles:
			a = i.select(".shortstoryHead > h2 > a")[0]
			text = a.text
			title = {
				'ru_title': GetTitle(text),
				'en_title': GetOriginalTitle(text),
				'id': IdFromLink(a.get('href')),
				'poster' : GetMirror()+i.select(".shortstoryContent > table > tr > td > div > a > img")[0].get('src'),
			}

			count = text.split('/', maxsplit=1)[1].split(']')[0].split()[-1]
			if count.startswith('['):
				count = count[1:]
			else:
				current = text.split('/', maxsplit=1)[1].split('[')[1].split('-')
				if len(current)>1:
					current = current[1].split()[0]
				else:
					current = current[0].split()[0]
				if current!=count.replace('+', ''):
					title['current'] = current
			title['count'] = count
			output.append(title)
		NavBar = soup.find(class_='block_4')
		page = int([i for i in NavBar.select('span') if i.text.isdigit()][0].text)
		pages = int(NavBar.select('a')[-1].text)
		return {
			'data': output,
			'page': page,
			'pages': pages if pages>=page else page,
		}
	else:
		return {"message":messages['not_response']}
def GetGenre(GenreUrl, page=None):
	Url = AnimevostLink+GenreUrl
	if page is not None:
		if not page.isdigit():
			return {"message":messages['error_page_number']}
		Url+=f'/page/{page}/'
	return GetTitles(Url)
@timed_lru_cache(60*60*6)
def GetSchedule():
	response = requests.get(AnimevostLink)
	if response:
		tree = etree.HTML(response.text)
		output = list()
		for i in tree.xpath("//div[contains(@class, 'raspis')]"):
			titles = list()
			for j in i.findall('a'):
				text = j.text.split(' ~ ')
				titles.append({
					'id': IdFromLink(j.attrib.get('href')),
					'name': text[0],
					'time': text[1][1:-1],
				})
			output.append({
				'name': i.getprevious().text,
				'titles': titles
			})
		return {
			'data': output,
			'status':200,
		}
	else:
		return {"message":messages['not_response'],'status':response.status_code}
@timed_lru_cache(60*60)
def search(name):
	response = AnimevostApiPost('search', {'name': name})
	if response:
		data = list()
		for i in response.get('data'):
			data.append(FormatingAnimevostResponse(i))
		return {
			'data': {
				'data': data,
				'pages': len(data)//20,
			},
			'status': 200,
		}
	else:
		return {
			'message':messages[404],
			'status': 404
			}
# @timed_lru_cache(60*5)
# def GetRandomPost():
# 	response = requests.get(AnimevostLink+'get_random_post.php')
# 	if response:
# 		tree = etree.HTML(response.text)
# 		a = tree.xpath('/html/body/div/a')[0]
# 		text = a.find('span').text
# 		return {
# 			'poster': tree.xpath('/html/body/div/img')[0].attrib.get('src'),
# 			'id': IdFromLink(a.attrib.get('href')),
# 			'ru_title': GetTitle(text),
# 			'en_title': GetOriginalTitle(text),
# 		}
# 	else:
# 		return {"message":messages['not_response'],'status':response.status_code}
@Animevost.route(ApiPath+AnimeVostPath,  methods = ['post'])
def Page():
	parser = reqparse.RequestParser()
	parser.add_argument("page")
	params = parser.parse_args()
	data = GetPage(params.get('page'))
	if not data:
		return {'message': 'Ошибка', 'status': 404}, 404
	elif isinstance(data, str):
		return {'message': data, 'status': 404}, 404
	return json.dumps({'data': data, 'status': 200})
@Animevost.route(ApiPath+AnimeVostPath+'title',  methods = ['post'])
def TitleRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("id")
	params = parser.parse_args()
	id = params.get('id')
	if not id:
		return {"message":"Не передан параметр genre",'status': 400}
	return GetTitleById(id)
@Animevost.route(ApiPath+AnimeVostPath+'genres',  methods = ['post', 'get'])
def GenresRequest():
	data = GetGenres()
	if data.get('message'):
		return {'message': data.get('message'), 'status': 404}, 404
	return json.dumps({'data': data, 'status': 200})
@Animevost.route(ApiPath+AnimeVostPath+'genre', methods = ['post'])
def GenreRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("genre")
	parser.add_argument("page")
	params = parser.parse_args()
	genre = params.get('genre')
	if not genre:
		return "Не передан параметр genre", 400
	genres = GetGenres()
	for key, val in genres.items():
		for item in val['links']:
			if item[1]==genre:
				genre_data = GetGenre(val.get('prelink')+"/"+item[1], params.get('page'))
				if genre_data.get('message'):
					return {'message':genre_data.get('message'), 'status': 404}, 404
				else:
					return json.dumps({'data': genre_data, 'status': 200})
	return {'message': 'Жанр не найден', 'status': 404}, 404
@Animevost.route(ApiPath+AnimeVostPath+'schedule',  methods = ['post', 'get'])
def ScheduleRequest():
	return GetSchedule()
@Animevost.route(ApiPath+AnimeVostPath+'search',  methods = ['post'])
def SearchRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("name")
	params = parser.parse_args()
	name = params.get('name')
	if not name:
		return "Не передан параметр name", 400
	return search(name)
# @Animevost.route(ApiPath+AnimeVostPath+'random',  methods = ['post', 'get'])
# def RandomTitleRequest():
# 	return GetRandomPost()