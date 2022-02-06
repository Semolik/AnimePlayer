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
	# elif isinstance(data, str):
	# 	return {'message': data, 'status': 404}, 404
	return json.dumps({'data': data, 'status': 200})

@timed_lru_cache(60*10)
def GetPage(page):
    if page and not page.isdigit():
        return {
            'status': 400,
            'message': messages.get('error_page_number'),
        }
    response = requests.get(AnidubLink+'anime')
    response.encoding = 'utf8'
    if response:
        soup = BeautifulSoup(response.text, 'lxml')
        data = soup.select('.sect-content.sect-items > #dle-content')
        if not data:
            return 'Ошибка', 500
        data = data[0]
        outdata = list()
        for title in data.select('.th-item'):
            th_in = title.select('.th-in')
            title_info = {
                'poster': AnidubMirrorLink+th_in[0].select('.th-img > img')[0].get('data-src'),
                'id': LinkSplitter.join(th_in[0].get('href').split('/')[3:]),
            }
            
            # th_in2 = title.select('.th-in')
            # print(th_in2)
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
            # break
            
        pages = data.select('.navigation a')
        if not pages:
            return
        # file = open('1.html', 'w')
        # file.write(str(pages))
        # file.close()
        return {
            'status': response.status_code,
            'data': {
                'data': outdata,
                'pages': int(pages[-1].text),
            },
        }
    else:
        return {
            'status': response.status_code,
            'message': messages.get('not_response'),
        }