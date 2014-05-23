import redis

db = redis.Redis("localhost")
mail = db.smembers("mail:exxonvaldeez:2")
for member in mail:
    db.srem("mail:exxonvaldeez:2", member)

mail = db.smembers("mail:exxonvaldeez:3")
for member in mail:
    db.srem("mail:exxonvaldeez:3", member)
