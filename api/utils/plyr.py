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
	}