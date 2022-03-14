# from operator import le
# from turtle import title
# from urllib import response
import requests
import json
from bs4 import BeautifulSoup
from lxml import etree
from flask_restful import reqparse
from flask import Blueprint, send_from_directory
from config import ApiPath, UPLOAD_FOLDER,ShikimoriLink,shikimori_api
from utils.lru_cache import timed_lru_cache
from utils.messages import messages
from utils.shikimori import SearchOnShikimori
import re
from settings import headers
# import math


hentai = False
Moduleid = 'animevost'
ModulePath = Moduleid+'/'
AnimevostLink = "https://v2.vost.pw/"
AnimevostMirrorLink = {}
# AnimevostApiLink = "https://api.animevost.org/v1/"
AnimevostApiLink = "https://api.animetop.info/v1/"
ModuleTitle = "Animevost"

genres__ = {}
Animevost = Blueprint(ModulePath, __name__)

def func_chunks_generators(lst, n):
	for i in range(0, len(lst), n):
		yield lst[i : i + n]
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
def PlyrSource(source):
	return {
		'type': "video",
		'sources': [
			{
				'src': source['hd'],
				'size': 720,
			},
			{
				'src': source['std'],
				'size': 480,
			}
		],
		'poster': source['preview'],
		'name': source['name'],
	}
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
	return [PlyrSource(i) for i in series+other]
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
	# if response_item.get('series'):
	# 	print(response_item.get('series'))
	# 	series = json.loads(response_item.get('series').replace("\'", "\""))
	# 	if len(series)>1:
	# 		keys = list(series.keys())
	# 		print(keys)
	# 		data['series'] = f'{keys[0]} - {keys[-1]}'
	series = text.split(" /")
	if len(series)>1:
		series = series[1].split("] [")
		if len(series)==1:
			series = series[0].split(' [')
			if len(series)>1:
				data['series'] = series[1][:-1]
		elif series:
			series = series[0].split(' [')
			if len(series)>1:
				data['series'] = series[1]
	return data
	
@timed_lru_cache(60*10)
def GetPageData(page=None):
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
		'service_title': ModuleTitle,
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
			'direct_link': True,
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
	data['service_title'] = ModuleTitle
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
		NavBar = soup.find_all(class_='block_4')
		page = int([i for i in NavBar.select('span') if i.text.isdigit()][0].text) if NavBar else 1
		pages = int(NavBar.select('a')[-1].text) if NavBar else 1
		return {
			'data': output,
			# 'page': page,
			'horny': hentai,
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
# @timed_lru_cache(60*60*6)
# def GetSchedule():
# 	response = requests.get(AnimevostLink)
# 	if response:
# 		tree = etree.HTML(response.text)
# 		output = list()
# 		for i in tree.xpath("//div[contains(@class, 'raspis')]"):
# 			titles = list()
# 			for j in i.findall('a'):
# 				text = j.text.split(' ~ ')
# 				titles.append({
# 					'id': IdFromLink(j.attrib.get('href')),
# 					'name': text[0],
# 					'time': text[1][1:-1],
# 				})
# 			output.append({
# 				'name': i.getprevious().text,
# 				'titles': titles
# 			})
# 		return {
# 			'data': output,
# 			'status':200,
# 		}
# 	else:
# 		return {"message":messages['not_response'],'status':response.status_code}
# @timed_lru_cache(60*60)
def search(name, page):
	response = AnimevostApiPost('search', {'name': name})
	if response:
		data = list()
		for i in response.get('data'):
			data.append(FormatingAnimevostResponse(i))
		data =  list(func_chunks_generators(data, 20))
		if not page:
			page = 1
		else:
			page = int(page)
		return {
			'data': {
				'data': data[page-1],
				'pages': len(data),
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
@Animevost.route(ApiPath+ModulePath,  methods = ['post'])
def GetPage(page=None):
	parser = reqparse.RequestParser()
	parser.add_argument("page")
	params = parser.parse_args()
	data = GetPageData(params.get('page'))
	if not data:
		return {'message': 'Ошибка', 'status': 404}, 404
	elif isinstance(data, str):
		return {'message': data, 'status': 404}, 404
	return {'data': data, 'status': 200}
@Animevost.route(ApiPath+ModulePath+'title', methods = ['post'])
def TitleRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("id")
	params = parser.parse_args()
	id = params.get('id')
	if not id:
		return {"message":"Не передан параметр genre",'status': 400}
	return GetTitleById(id)
@Animevost.route(ApiPath+ModulePath+'genres',  methods = ['post', 'get'])
def GenresRequest():
	data = GetGenres()
	if data.get('message'):
		return {'message': data.get('message'), 'status': 404}, 404
	return json.dumps({'data': data, 'status': 200})
@Animevost.route(ApiPath+ModulePath+'genre', methods = ['post'])
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
					genre_data['genre_name'] = item[0].title()
					return json.dumps({'data': genre_data, 'status': 200})
	return {'message': 'Жанр не найден', 'status': 404}, 404
# @Animevost.route(ApiPath+ModulePath+'schedule',  methods = ['post', 'get'])
# def ScheduleRequest():
# 	return GetSchedule()
@Animevost.route(ApiPath+ModulePath+'search',  methods = ['post'])
def SearchRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("name")
	parser.add_argument("page")
	params = parser.parse_args()
	name = params.get('name')
	page = params.get('page')
	if page and not page.isdigit():
		return "Некорректная страница", 404
	if not name:
		return "Не передан параметр name", 400
	return search(name, page)
@Animevost.route(ApiPath+ModulePath+'icon')
def icon():
	return send_from_directory(UPLOAD_FOLDER, 'animevost.png')
# @Animevost.route(ApiPath+ModulePath+'random',  methods = ['post', 'get'])
# def RandomTitleRequest():
# 	return GetRandomPost()