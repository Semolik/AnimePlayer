import requests
from bs4 import BeautifulSoup
from config import ShikimoriLink
from requests.utils import requote_uri
from settings import headers
def SearchOnShikimori(name, kind=None):
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
					if tags[0].get('data-href') == ShikimoriLink+'animes/kind/'+kind or not kind:
						return title.get('data-id')
			return titles[0].get('data-id')