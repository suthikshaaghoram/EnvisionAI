from pydantic import BaseModel

class UsageSummary(BaseModel):
    total_manifestations: int
    total_api_calls: int
    total_generation_time: float
    total_cost: float
