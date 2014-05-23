import redis

db = redis.Redis("localhost")
mail = db.smembers("mail:gregrgreiner:2.0")
for member in mail:
    db.smove("mail:gregrgreiner:2.0", "mail:gregrgreiner:2", member)

mail = db.smembers("mail:gregrgreiner:3.0")
for member in mail:
    db.smove("mail:gregrgreiner:3.0", "mail:gregrgreiner:3", member)
