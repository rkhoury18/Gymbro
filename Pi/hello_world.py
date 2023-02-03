import requests as rq

url = 'http://13.41.78.246:3000/hello_world'
hello_world = {'message': 'hello world'}

x = rq.post(url, json=hello_world)
y = x.json()
print(y["message"])