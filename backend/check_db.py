from django.db import connection

cursor = connection.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("✓ Tables in database:")
for table in tables:
    print(f"  - {table[0]}")

if len(tables) == 0:
    print("✗ No tables found - database may not be initialized")
