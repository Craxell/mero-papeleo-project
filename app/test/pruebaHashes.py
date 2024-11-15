from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


hash1 = pwd_context.hash("Carlos1234")
hash2 = pwd_context.hash("Carlos1234")


print(hash1)
print(hash2)
