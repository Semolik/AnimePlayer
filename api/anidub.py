import re
import requests
import json
from bs4 import BeautifulSoup
from flask_restful import reqparse
from flask import Blueprint,send_from_directory
from requests.utils import requote_uri
from config import ApiPath,ShikimoriLink
from utils.lru_cache import timed_lru_cache
from utils.messages import messages
from utils.plyr import PlyrSource
from config import ApiPath, UPLOAD_FOLDER,shikimori_api
from settings import headers
from utils.shikimori import SearchOnShikimori

Moduleid = 'anidub'
ModulePath = Moduleid+'/'
AnidubLink = 'https://anidub.life/'
LinkSplitter = '~'
ModuleTitle = "Anidub"
hentai = False


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
		for item in val['links']:
			if item[1]==genre:
				genre_data = GetGenre(val.get('prelink')+"/"+item[1], params.get('page'))
				if genre_data.get('data'):
					genre_data['data']['genre_name']=item[0].title()
				return genre_data, genre_data.get('status')
	if genre.isdigit() and len(genre)==4:
		genre_data = GetGenre("xfsearch/year/"+genre, params.get('page'))
		if genre_data.get('status')!=200:
			genre_data['message'] = 'Жанр не найден'
		if genre_data.get('data'):
			genre_data['data']['genre_name']=genre
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
@Module.route(ApiPath+ModulePath+'search',  methods = ['post'])
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
@Module.route(ApiPath+ModulePath+'icon')
def icon():
	return send_from_directory(UPLOAD_FOLDER, 'anidub.png')

@timed_lru_cache(60*60)
def search(name, page):
	response = requests.post(AnidubLink+'index.php?do=search',params={'story':name, 'result_from': 1, 'full_search': 0, 'search_start': page or 1, 'subaction':'search', 'do': 'search'}, headers=headers)
	if response:
		return GetTitles('', response.text)
	# 	data = list()
	# 	for i in response.get('data'):
	# 		data.append(FormatingAnimevostResponse(i))
	# 	data =  list(func_chunks_generators(data, 20))
	# 	if not page:
	# 		page = 1
	# 	else:
	# 		page = int(page)
	# 	return {
	# 		'data': {
	# 			'data': data[page-1],
	# 			'pages': len(data),
	# 		},
	# 		'status': 200,
	# 	}
	else:
		return {
			'message':messages[404],
			'status': 404
			}
@timed_lru_cache(60*5)
def GetPlaylist(page_url,videourl):
	session = requests.Session()
	print(page_url)
	response = session.get(AnidubLink+videourl, headers={'Referer': page_url})
	if not response:
		return
	response = session.get(response.url, headers={'Referer': response.url.replace('index.php', 'video.php')})
	if not response:
		return
	referer = next(re.finditer(r'refer = "(http.*?)"', response.text), None)
	if not referer:
		return
	soup = BeautifulSoup(response.text, 'lxml')
	player = soup.select('#hls-video')
	if not player:
		return
	source = player[0].select('source')
	response = session.get(AnidubLink+'player/'+source[0].get('src'), headers={'Referer': referer.group(1)})
	if not response:
		return
	print(response.text)
	for i in response.text.split('RESOLUTION='):
		splited = i.split('\n')
		if len(splited)>=2 and '.m3u8' in splited[1]:
			data = splited[:2]
			print(data[0].split('x')[1], data[1])
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
	return AnidubLink[:-1]
@timed_lru_cache(60*60)
def GetTitleById(title_id):
	response = requests.get(AnidubLink+'/'.join(title_id.split(LinkSplitter))+'.html', headers=headers)
	response.encoding = 'utf8'
	# with open('title.html', "w", encoding="utf-8") as f:
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
			title = title[0].text.split('/')
			out['ru_title'] = title[0]
			if len(title)>1:
				out['en_title'] = title[1].split(' [')[0]
			shikimori_id = SearchOnShikimori(out.get('en_title') or out.get('ru_title'))
			if shikimori_id:
				shikimori_req = shikimori_api.animes(shikimori_id)
				shikimori_data = shikimori_req.GET()
				if shikimori_data:
					if shikimori_data.get('url'):
						shikimori_data['url'] = ShikimoriLink+shikimori_data.get('url')
					out['shikimori'] = shikimori_data
				# if shikimori_data.get('screenshots'):
		fleft = dle_content[0].select('.fleft')
		if fleft:
			poster = dle_content[0].select('.fposter > img')
			if poster:
				poster = poster[0].get('src')
				out['poster'] = (poster if 'http' in poster else AnidubMirrorLink()+poster)
			related_list = list()
			related = dle_content[0].select('.related > .th-item')
			if related:
				for i in related:
					related_data = {}
					th_in = i.select('a.th-in')
					href = th_in[0].get('href')
					if not th_in or '/anime/' not in href:
						continue
					related_poster = i.select('img')
					if related_poster:
						related_poster = related_poster[0].get('src').replace('/small/', '/')
						related_data['poster'] = (related_poster if 'http' in related_poster else AnidubMirrorLink()+related_poster)
					related_title = i.select('.th-title')
					if related_title:
						related_data['ru_title'] = related_title[0].text
					related_data['id'] = LinkSplitter.join(href.split('/')[3:]).split('.')[0]
					# related_subtitle = i.select('.th-subtitle > span')
					# if related_subtitle and related_subtitle[0].text:
					# 	related_subtitle = related_subtitle[0].text
					# 	related_subtitle_list = related_subtitle.split('[', maxsplit=1)
					# 	if len(related_subtitle_list)==2:
					# 		related_data['en_title'] = related_subtitle_list[0]
					# 	else:
					# 		related_data['en_title'] = related_subtitle
					related_list.append(related_data)
				if related_list:
					out['related'] = related_list
		series = dle_content[0].select('.fplayer.tabs-box > .tabs-b > .tabs-box > .tabs-sel')
		if series:
			out['series'] = {}
			if title:
				series_count = title[1].split(' [')[1].split(']')[0]
				out['series']['info'] = [series_count[1:] if series_count[0]=='0' else series_count]
		if len(series)>1:
			sibnet_links = list()
			for link in [i for i in series[1].select('span')]:
				sibnet_links.append({
					'link':'/'+ModulePath+'sibnet/'+link.get('data').split('=')[-1],
					'name': link.text,
				})
			first_sibnet = SibnetLink(sibnet_links[0]['link'].split('/')[-1])
			if first_sibnet.get('status')==200:
				name = sibnet_links[0]['name']
				sibnet_links[0] = first_sibnet.get('data')
				sibnet_links[0]['name'] = name
			out['series']['data'] = sibnet_links
			out['series']['direct_link']=False
		elif len(series)==1:
			links = list()
			for link in [i for i in series[0].select('span')]:
				links.append({
					'link': "/"+ModulePath+'playlist',
					'params': {
						'referer': response.url,
						'videourl': link.get('data'),
					},
					'name': link.text,

				})
			out['series']['data'] = links
			first_video = GetPlaylist(links[0]['params']['referer'], links[0]['params']['videourl'])
			if first_video:
				name = links[0]['name']
				links[0] = first_video.get('data')
				links[0]['name'] = name
				out['series']['data'] = links
				out['series']['direct_link']=False
		year = dle_content[0].select('.fmeta.fx-row.fx-start > span > a')
		if year:
			for a in year:
				href = a.get('href')
				if '/year/' in href:
					out['year'] = [a.text, href.split('/')[-2]]
		short_info = dle_content[0].select('ul.flist > li.short-info')
		# with open('3.html', "w", encoding="utf-8") as f:
		# 	f.write(str(short_info))
		# 	f.close()
		blocks = list()
		if short_info:
			for info_item in short_info:
				# print(info_item)
				if info_item:
					text = list(filter(None, [' '.join(i.text.split()) for i in info_item.children]))
					if not text or text[0] in ('Ссылка на трекер:', 'Количество серий:'):
						continue
					if 'Жанр:' == text[0]:
						data = info_item.select('a')
						out['genre'] = FormatLinkList(data, Split=[-2,-1])
						continue
					if 'День недели:' == text[0]:
						continue
					text[0] = text[0].replace(':', '')
					if len(text)>2:
						blocks.append([text.pop(0),', '.join([i for i in text if i !=','])])
					else:
						blocks.append(text)
		out['blocks'] = blocks
		description = dle_content[0].select('.fdesc.clr.full-text')
		if description:
			out['description'] = description[0].text
		out['service_title'] = ModuleTitle
		out['horny'] = hentai
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
	return GetTitles(AnidubLink[:-1]+(f'/page/{page}' if page else ''))
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
def GetTitles(Url, html=None):
	if not html:
		response = requests.get(Url, headers=headers)
		response.encoding = 'utf8'
	if html or response:
		soup = BeautifulSoup(response.text if not html else html, 'lxml')
		data = soup.select('#dle-content')
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
			poster = th_in[0].select('.th-img > img')[0].get('src').replace('thumbs/', '')
			title_info = {
				'poster': (poster if 'http' in poster else AnidubMirrorLink()+poster),
				'id': LinkSplitter.join(th_in[0].get('href').split('/')[3:]).split('.')[0],#на конце кажой ссылки есть .html
			}
			ru_title = th_in[0].select('.th-title')
			if ru_title:
				ru_title_content = ru_title[0].text.split('[')
				if len(ru_title_content)>1:
					title_info['series'] = ru_title_content[-1][:-1]
				title_info['ru_title'] = ' '.join(ru_title_content[0].split())
			en_title = th_in[0].select('.th-subtitle')
			if en_title:
				title_info['en_title'] = ' '.join(en_title[0].text.split())
			outdata.append(title_info)
		pages = data.select('.navigation *')
		return {
			'status': 200,
			'data': {
				'data': outdata,
				'pages': int(pages[-1].text) if pages else 1,
				'service_title': ModuleTitle,
				'horny': hentai,
			},
		}
	else:
		return {
			'status': response.status_code if not html else 404,
			'message': messages.get('not_response'),
		}
def FormatLinkList(a_tags, Split=None):
	array = [[i.text.lower(), i.get('href').split('/')] for i in a_tags]
	if Split:
		return [[i[0],i[1][Split[0]:Split[1]]] for i in array]
	return [[i[0], i[1][-1]] for i in array]
