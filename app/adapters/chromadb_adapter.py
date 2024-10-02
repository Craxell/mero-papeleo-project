import chromadb
class chromaDBAdapter():
    def __init__(self):
        self.chromadb = chromadb

    client = chromadb.Client()
    collection = client.create_collection(name="test_collection")
    
    try:
        collection.add(
            documents=[
                "Fruits are an amazing part of nature's bounty, offering a vibrant and delicious array of flavors and health benefits. From the juicy sweetness of a ripe mango to the tangy freshness of a lemon, there's a fruit for every taste and occasion.", 
                "Take the humble apple, for instance. This iconic fruit is not only a popular snack but also a symbol of health and wellness. With its crisp texture and slightly sweet taste, it's a favorite among many. And let's not forget the nutritional value; apples are packed with vitamins, fiber, and antioxidants, making them a true superfood.",
                "Then there's the tropical paradise of fruits like pineapple and papaya. Pineapple, with its spiky exterior and vibrant yellow flesh, is a tropical treat. It's not just about the taste, though; pineapple is also known for its anti-inflammatory properties and digestive benefits. Papaya, on the other hand, is a gentle giant with its soft, buttery texture and subtle sweetness. It's a great source of vitamins A and C, and its enzymes are said to aid in digestion.",
                "The world of fruits is truly diverse, offering a rainbow of colors and a symphony of flavors. Whether you prefer the classic apple, the exotic pineapple, or the many other fruits in between, there's always a new taste adventure waiting to be discovered."
            ],
            ids=["id1", "id2","id3","id4"]
    )
    except Exception as e:
        print(e)

    def get_collection(self):
        return self.collection