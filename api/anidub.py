import re
import requests
import json
from bs4 import BeautifulSoup
from lxml import etree
from flask_restful import reqparse
from flask import Blueprint
from requests.utils import requote_uri
from soupsieve import select
from config import ApiPath
from utils.lru_cache import timed_lru_cache
from utils.messages import messages
from settings import headers
ModulePath = 'anidub/'
AnidubLink = 'https://online.anidub.club/'
LinkSplitter = '~'
info_texts = {
	'Жанр:': {'key':'genre', 'tag': 'a', 'list': True},
	'Количество серий:' : {'key': 'series_coutnt'},
	# 'Режиссер:': {'key': 'director','tag': '*', 'only_text': True},
	# 'Режиссер:': {'key': 'sound','tag': 'a', 'only_text': True},
}


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
@Module.route(ApiPath+ModulePath+'title',  methods = ['post'])
def TitleRequest():
	parser = reqparse.RequestParser()
	parser.add_argument("id")
	params = parser.parse_args()
	id = params.get('id')
	if not id:
		return {"message":messages['no_param'].format('id'),'status': 400}
	title = GetTitleById(id)
	return title, title.get('status')
@Module.route(ApiPath+'/'+ModulePath+'sibnet/<sibnetid>')
def GetSibnetLink(sibnetid):
	return SibnetLink(sibnetid)

def PlyrSource(url,poster):
	return {
		'type': "video",
		'sources': [
			{
				'src': url,
				'size': 720,
			},
		],
		'poster': poster,
		# 'name': source['name'],
	}

@timed_lru_cache(60*5)
def SibnetLink(sibnetid):
	s = requests.Session()
	page_url = f'https://video.sibnet.ru/video{sibnetid}'
	r = s.get(page_url)
	# with open('3.html', "w", encoding="utf-8") as f:
	# 	f.write(r.text)
	# 	f.close()
	if not r:
		return {
			'status': r.status_code,
			'message': 'Ответ сервера не получен'
		}
	p = next(re.finditer(r"\/v\/.+\d+.mp4", r.text), None)
	
	poster = next(re.finditer(r"'\/upload\/cover\/.+\d+.(jpg|png)'", r.text), None)
	if poster:
		poster = "https://video.sibnet.ru"+poster.group(0)[1:-1]
	if not p:
		return {
			'status': 404,
			'message': 'Ошибка получения ссылки',
		}
	file_url = 'https://video.sibnet.ru' + p.group(0)
	r = s.head(file_url, headers={'Referer': page_url})
	if r.status_code == 200:
		return {
			'status': r.status_code,
			'data': PlyrSource(r.text,poster),
		}
	elif r.status_code == 302:
		url = r.headers.get('Location')
		if url.startswith('//'):
			return {
				'status': 200,
				'data': PlyrSource('http:' + url,poster),
			}
	return {
		'status': r.status_code,
		'message': 'Ошибка получения ссылки',
	}
def AnidubMirrorLink():
	return 'https://online.anidub.club/'
@timed_lru_cache(60*60)
def GetTitleById(title_id):
	response = requests.get(AnidubLink+'/'.join(title_id.split(LinkSplitter))+'.html', headers=headers)
	response.encoding = 'utf8'
	# with open('2.html', "w", encoding="utf-8") as f:
	# 	f.write(response.text)
	# 	f.close()
	if response:		
		soup = BeautifulSoup(response.text, 'lxml')
		dle_content = soup.select('#dle-content')
		if not dle_content:
			return {
				'status': 500,
				'message': messages.get('error_parce')
			}
		out = {}
		title = dle_content[0].select('.fright.fx-1 > h1')
		if title:
			title = title[0].text.split(' / ')
			out['ru_title'] = title[0]
			out['en_title'] = title[1].split(' [')[0]
		poster = dle_content[0].select('.fleft > .fposter > img')
		if poster:
			out['poster'] = AnidubMirrorLink()+poster[0].get('data-src')
		series = dle_content[0].select('.fplayer.tabs-box > .tabs-b > .tabs-box > .tabs-sel')
		if series:
			out['series'] = {}
			# out['series']['data'] = 
			sibnet_links = list()
			for link in [i for i in series[1].select('span')]:
				sibnet_links.append({
					'link':'/'+ModulePath+'sibnet/'+link.get('data').split('=')[-1],
					'name': link.text,
					})
				# response = requests.get(link.get('data'))
				# if response:
				# 	url = re.search(r'\/v\/.*\.mp4',response.text)
				# 	if url:
				# 		sibnet_links.append('https://video.sibnet.ru'+url.group(0))
			first_sibnet = SibnetLink(sibnet_links[0]['link'].split('/')[-1])
			name = sibnet_links[0]['name']
			sibnet_links[0] = first_sibnet.get('data')
			sibnet_links[0]['name'] = name
			out['series']['data'] = sibnet_links
			out['series']['direct_link']=False
			if title:
				series_count = title[1].split(' [')[1].split(']')[0]
				out['series']['info'] = [series_count[1:] if series_count[0]=='0' else series_count]
		short_info = dle_content[0].select('ul.flist > li.short-info')
		for info_item in short_info:
			span = info_item.find('span')
			if span:
				span_text = span.text
				if span_text=='Жанр:':
					data = info_item.select('a')
					out['genre'] = FormatLinkList(data, Split=[-2,-1])
				if span_text=='Количество серий:':
					out['series_coutnt'] = span.next_sibling
				if span_text=='Режиссер:':
					out['director'] = ', '.join([i.text for i in info_item.select('*')[1:]])
				if span_text=='Автор оригинала:':
					out['original_author'] = ', '.join([i.text for i in info_item.select('*')[1:]])
				if span_text=='Озвучивание:':
					out['sound'] = [i.text for i in info_item.select('*')[1:]]
				# key = info_texts.get(span.text)
				# if key:
				# 	tag = key.get('tag')
				# 	if tag:
				# 		data = info_item.select(tag)
				# 		if key.get('only_text'):
				# 			out[key.get('key')] = [i.text for i in data]
				# 		else:
				# 			out[key.get('key')] = (FormatLinkList(data, Split=[-2,-1]) if key.get('list') else [data[0].text.split('/')])
				# 	else:
				# 		if key.get('next'):
				# 			out[key.get('key')] = span.next.text
				# 		else:
				# 			out[key.get('key')]span.next_sibling
		return {
			'status':200,
			'data': out,
		}
	else:
		return {
			'status': response.status_code,
			'message': messages.get('not_response'),
		}


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
				'prelink': genres[0].get('href').split('/')[1]+'/genre',
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
				'poster': (poster if 'http' in poster else AnidubMirrorLink()+poster),
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
def FormatLinkList(a_tags, Split=None):
	array = [[i.text.lower(), i.get('href').split('/')] for i in a_tags]
	if Split:
		return [[i[0],i[1][Split[0]:Split[1]]] for i in array]
	return [[i[0], i[1][-1]] for i in array]