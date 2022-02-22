import re
import requests
import json
from bs4 import BeautifulSoup
from flask_restful import reqparse
from flask import Blueprint
from requests.utils import requote_uri
from config import ApiPath
from utils.lru_cache import timed_lru_cache
from utils.messages import messages
from settings import headers
from utils.plyr import PlyrSource

ModulePath = 'hentaiz/'
HentaizLink = 'https://hentaiz.org/'

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
	if not data:
		return {
			'status': 404,
			'message': messages.get('not_response'),
		}
	return json.dumps({'data': data, 'status': 200})
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
@Module.route(ApiPath+ModulePath+'video/<prelink>/<videoid>')
def GetVideo(videoid,prelink):
	data = GetVideoById(videoid,prelink)
	out = {
		'status': data.get('status'),
	}
	if data.get('status')==200:
		out['data'] = data.get('data')
	else:
		out['message'] = data.get('message')
	return out, data.get('status')
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
					genre_data['data']['genre_name']=item[0]
				return genre_data, genre_data.get('status')
	if genre.isdigit() and len(genre)==4:
		genre_data = GetGenre("xfsearch/"+genre+"+год", params.get('page'))
		if genre_data.get('status')!=200:
			genre_data['message'] = 'Жанр не найден'
		if genre_data.get('data'):
			genre_data['data']['genre_name']=genre
		return genre_data, genre_data.get('status')
	return {'message': 'Жанр не найден', 'status': 404}, 404


@timed_lru_cache(60*5)
def GetVideoById(videoid, prelink):
	session = requests.Session()
	player_url = f'https://hentaiz.xyz/hub/{prelink}/list{prelink[0]}.php?id='+videoid
	response = session.get(player_url)
	with open('video.html', "w", encoding="utf-8") as f:
		f.write(response.text)
		f.close()
	if not response:
		return {
			'status': response.status_code,
			'message': 'Ответ сервера не получен'
		}
	response = session.get(f'https://hentaiz.xyz/hub/{prelink}/fembed.php?id='+videoid, headers={'Referer': player_url})
	if response:
		p = next(re.finditer(r"playerInstance\.setup\([\s\S]*?file: '(.*?)'[\s\S]*?image: '(.*?)'", response.text), None)
		if not p:
			return {
				'status': 404,
				'message': 'Ошибка получения ссылки',
			}
		return {
			'status': 200,
			'data': PlyrSource(p.group(1),p.group(2))
		}
	else:
		return {
			'status': 404,
			'message': messages.get('not_response'),
		}
@timed_lru_cache(60*10)
def GetGenre(GenreUrl, page=None):
	Url = HentaizLink+GenreUrl
	if page is not None:
		if not page.isdigit():
			return {"message": messages['error_page_number'], 'status': 400}
		Url+=f'/page/{page}/'
	return GetTitles(Url)
@timed_lru_cache(60*60*6)
def GetGenres():
	genres = requests.get(HentaizLink+'tags/', headers=headers)
	years = requests.get(HentaizLink+'years.html', headers=headers)
	genres.encoding = 'utf8'
	years.encoding = 'utf8'
	# print(years.status_code)
	# print(genres.status_code)
	if years and years:
		# with open('genres.html', "w", encoding="utf-8") as f:
		# 	f.write(genres.text)
		# 	f.close()
		# with open('years.html', "w", encoding="utf-8") as f:
		# 	f.write(years.text)
		# 	f.close()
		soup_genres = BeautifulSoup(genres.text, 'lxml')
		soup_years = BeautifulSoup(years.text, 'lxml')
		data_genres = soup_genres.select('#dle-content')
		if not data_genres or not soup_years:
			return {
				'status': 500,
				'message': 'Ошибка'
			}
		tags = data_genres[0].select('.clearfix.cloud-tags > span > a')
		years = soup_years.select('.static-year-content > ul > a')
		category = soup_genres.select('.m-menu.to-mob.clearfix > li > a')
		if not tags or not years:
			return 
		return {
			'category': {
				'links': [[i.text,i.get('href').split('/')[1]] for i in category if not i.get('class')][1:-1],
				'prelink': '',
				'name': 'Категория',
			},
			'genres': {
				'links': [[i.text, i.get('href').split('/')[-2]] for i in tags],
				'prelink': 'tags',
				'name': 'Жанр',
			},
			'years': {
				'links': [[i.text, i.get('href').split('/')[1]] for i in years],
				'prelink': '',
				'name': 'Год',
			},
		}

@timed_lru_cache(60*10)
def GetPage(page):
	if page and not page.isdigit():
		return {
			'status': 400,
			'message': messages.get('error_page_number'),
		}
	return GetTitles(HentaizLink+(f'page/{page}' if page else ''))
def GetTitles(Url):
	response = requests.get(Url, headers=headers)
	response.encoding = 'utf8'
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		data = soup.select('#dle-content')
		if not data:
			return {
				'status': 500,
				'message': 'Ошибка'
			}
		data = data[0]
		outdata = list()
		titles = data.select('article.short.clearfix')
		if not titles:
			return {
				'status': 404,
				'message': messages.get(404),
			}
		for title in titles:
			imgbox = title.select('a.short-poster.img-box')
			img = imgbox[0].select('img')[0].get('src')
			title_info = {
				'ru_title': title.select('.sh-title')[0].text,
				#en_title нет
				'id': title.select('.sh-desc > a')[0].get('href').split('/')[-1].split('.')[0],
				'poster': img if img.startswith('//') else HentaizLink+img,
				'announce': bool(imgbox[0].select('.announce .announce-new')),
				'ongoing': bool(imgbox[0].select('.announce .announce-ongoing')),
				'info_blocks': [i.text for i in imgbox[0].select('.short-meta.short-label') if i.text],
			}
			orgtitle = title.select('.sh-orgtitle')
			if orgtitle:
				year = orgtitle[0].text
				if year[0]=='(' and year[-1]==')':
					title_info['year'] = year[1:-1] # может быть несколько лет через тире по этому не int
				if len(orgtitle)>1:
					title_info['genre'] = [i.text for i in orgtitle[1].select('a')]
		# 	th_in = title.select('.th-in')
		# 	poster = th_in[0].select('.th-img > img')[0].get('data-src')
		# 	title_info = {
		# 		'poster': (poster if 'http' in poster else AnidubMirrorLink()+poster),
		# 		'id': LinkSplitter.join(th_in[0].get('href').split('/')[3:]).split('.')[0],#на конце кажой ссылки есть .html
		# 	}
		# 	ru_title = th_in[1].select('.th-title')
		# 	if ru_title:
		# 		ru_title_content = ru_title[0].text.split('[')
		# 		if len(ru_title_content)>1:
		# 			title_info['series'] = ru_title_content[-1][:-1]
		# 		title_info['ru_title'] = ' '.join(ru_title_content[0].split())
		# 	en_title = th_in[1].select('.th-subtitle')
		# 	if en_title:
		# 		title_info['en_title'] = ' '.join(en_title[0].text.split())
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
@timed_lru_cache(60*60)
def GetTitleById(title_id):
	response = requests.get(HentaizLink+title_id+'.html', headers=headers)
	response.encoding = 'utf8'
	if response:
		soup = BeautifulSoup(response.text, 'lxml')
		dle_content = soup.select('#dle-content')
		if not dle_content:
			return {
				'status': 500,
				'message': messages.get('error_parce')
			}
		out = {}
		title = dle_content[0].select('.fmain > .fheader > h1')
		if title:
			out['ru_title'] = title[0].text
		poster = dle_content[0].select('.fposter > img')
		if poster:
			out['poster'] = HentaizLink+poster[0].get('src').replace('\n', '')
		series = dle_content[0].select('.tab_content > .tabs > .series-btn > .s-link')
		if series:
			out['series'] = {}
			out_series = list()
			for i in series:
				if 'vip.php' not in i.get('data-src'):
					link = i.get('data-src').split('/')
					out_series.append({
						'link':("/"+ModulePath+'video/'+link[link.index('hub')+1]+"/"+i.get('data-src').split('id=')[1]),
						'name': i.text,
					})
			out['series']['data'] = out_series
			first_splited_link = out_series[0]['link'].split('/')
			first = GetVideoById(first_splited_link[-1],first_splited_link[-2])
			if first.get('status')==200:
				first = first.get('data')
				first['name'] = out_series[0]['name']
				out['series']['data'][0] = first
			out['series']['direct_link']=False
			out['series']['info'] = list()
		fmright = dle_content[0].select('.fmright')
		if fmright:
			tags_data = list()
			for items_container in fmright[0].select('.flist > .flist-col > .vis'):
				items = items_container.select('span')
				
				value = [items[0].text]
				if len(items)==1:
					value.append([items[0].next_sibling])
				else:
					text = list()
					for tag in items:
						a = tag.select('a')
						if a:
							value.append([a[0].text,a[0].get('href')])
						else:
							textintags = [i.text for i in tag.select('*')]
							# print(textintags)
							if text:
								value.append([' '.join(textintags)])
						# print(first_child)
					# 	if first_child and first_child.attri.get('href') is not None:
					# 		text.append([first_child.text,first_child.get('href')])
					# 	else:
					# 		text.append([first_child.text])
				tags_data.append(value)
				# print(tags_data)
			# if out.get('series'):
			# 	out['series']['info'] = ['']


	# 		# out['series']['data'] = 
	# 		sibnet_links = list()
	# 		for link in [i for i in series[1].select('span')]:
	# 			sibnet_links.append({
	# 				'link':'/'+ModulePath+'sibnet/'+link.get('data').split('=')[-1],
	# 				'name': link.text,
	# 				})
	# 			# response = requests.get(link.get('data'))
	# 			# if response:
	# 			# 	url = re.search(r'\/v\/.*\.mp4',response.text)
	# 			# 	if url:
	# 			# 		sibnet_links.append('https://video.sibnet.ru'+url.group(0))
	# 		first_sibnet = SibnetLink(sibnet_links[0]['link'].split('/')[-1])
	# 		name = sibnet_links[0]['name']
	# 		sibnet_links[0] = first_sibnet.get('data')
	# 		sibnet_links[0]['name'] = name
	# 		out['series']['data'] = sibnet_links
	# 		out['series']['direct_link']=False
	# 		if title:
	# 			series_count = title[1].split(' [')[1].split(']')[0]
	# 			out['series']['info'] = [series_count[1:] if series_count[0]=='0' else series_count]
	# 	year = dle_content[0].select('.fmeta.fx-row.fx-start > span > a')
	# 	for a in year:
	# 		href = a.get('href')
	# 		if '/year/' in href:
	# 			out['year'] = [a.text, href.split('/')[-2]]
	# 	short_info = dle_content[0].select('ul.flist > li.short-info')
	# 	for info_item in short_info:
	# 		span = info_item.find('span')
	# 		if span:
	# 			span_text = span.text
	# 			if span_text=='Жанр:':
	# 				data = info_item.select('a')
	# 				out['genre'] = FormatLinkList(data, Split=[-2,-1])
	# 			if span_text=='Количество серий:':
	# 				out['series_coutnt'] = span.next_sibling
	# 			if span_text=='Режиссер:':
	# 				out['director'] = ', '.join([i.text for i in info_item.select('*')[1:]])
	# 			if span_text=='Автор оригинала:':
	# 				out['original_author'] = ', '.join([i.text for i in info_item.select('*')[1:]])
	# 			if span_text=='Озвучивание:':
	# 				out['sound'] = [i.text for i in info_item.select('*')[1:]]
		return {
			'status':200,
			'data': out,
		}
	else:
		return {
			'status': response.status_code,
			'message': messages.get('not_response'),
		}