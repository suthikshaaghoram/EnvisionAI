import os
import uuid
from datetime import datetime
from qdrant_client import QdrantClient
from qdrant_client.http import models
from fastembed import TextEmbedding
from app.core.config import settings

class VectorStore:
    def __init__(self):
        # Initialize Qdrant Client
        path = settings.QDRANT_PATH
        self.client = QdrantClient(path=path) 
        
        self.collection_name = "manifestations"
        self.embedding_model = TextEmbedding() 
        
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """Checks if collection exists, creates it if not."""
        collections = self.client.get_collections()
        collection_names = [c.name for c in collections.collections]
        
        if self.collection_name not in collection_names:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=384, 
                    distance=models.Distance.COSINE
                )
            )

    def store_manifestation(self, text: str, metadata: dict) -> str:
        """
        Embeds and stores the manifestation text in Qdrant.
        """
        embeddings = list(self.embedding_model.embed([text]))
        vector = embeddings[0] 

        point_id = str(uuid.uuid4())
        
        metadata["timestamp"] = datetime.now().isoformat()
        metadata["text"] = text 

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
