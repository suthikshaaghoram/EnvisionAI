import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from fastembed import TextEmbedding
import uuid
from datetime import datetime

class VectorService:
    def __init__(self):
        # Initialize Qdrant Client (Local mode by default)
        # If QDRANT_URL is set in .env, use it (e.g., Cloud)
        qdrant_url = os.getenv("QDRANT_URL")
        qdrant_api_key = os.getenv("QDRANT_API_KEY")
        
        if qdrant_url:
            self.client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
        else:
            # Use local memory or disk storage
            path = "qdrant_storage"
            self.client = QdrantClient(path=path) 

        self.collection_name = "manifestations"
        self.embedding_model = TextEmbedding() # Default: BAAI/bge-small-en-v1.5
        
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """Checks if collection exists, creates it if not."""
        collections = self.client.get_collections()
        collection_names = [c.name for c in collections.collections]
        
        if self.collection_name not in collection_names:
            print(f"Creating collection '{self.collection_name}'...")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=384, # Dimensions for BAAI/bge-small-en-v1.5
                    distance=models.Distance.COSINE
                )
            )

    def store_manifestation(self, text: str, metadata: dict) -> str:
        """
        Embeds and stores the manifestation text in Qdrant.
        Returns the Point ID.
        """
        # Generate embedding
        # fastembed returns a generator, so we take the first item
        embeddings = list(self.embedding_model.embed([text]))
        vector = embeddings[0] # Numpy array or list

        point_id = str(uuid.uuid4())
        
        # Prepare metadata (clean up any non-serializable types if necessary)
        # Adding timestamp
        metadata["timestamp"] = datetime.now().isoformat()
        metadata["text"] = text # Store original text in payload

        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=vector.tolist(),
                    payload=metadata
                )
            ]
        )
        
        return point_id

    def search_manifestations(self, query_text: str, limit: int = 3):
        """
        Semantic search for manifestations.
        """
        embeddings = list(self.embedding_model.embed([query_text]))
        query_vector = embeddings[0]

        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector.tolist(),
            limit=limit
        )
        return results

if __name__ == "__main__":
    # Test
    svc = VectorService()
    pid = svc.store_manifestation("I am confident and successful.", {"user": "test"})
    print(f"Stored point: {pid}")
    results = svc.search_manifestations("confidence")
    print("Search results:", results)
