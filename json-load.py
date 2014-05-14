import json, redis

rServer = redis.Redis("localhost")
mail = rServer.zrevrangebyscore("mail:exxonvaldeez:inbox", "+inf", "-inf", 0, 10)
parsedMail = {}

for email in mail:
    print json.loads(email)
