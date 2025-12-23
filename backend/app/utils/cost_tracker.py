class CostTracker:
    # Estimate costs (e.g., $0.50 per 1M tokens for some models)
    COST_PER_1K_TOKENS = 0.0005 

    @staticmethod
    def calculate_cost(tokens: int) -> float:
        return (tokens / 1000) * CostTracker.COST_PER_1K_TOKENS

    @staticmethod
    def estimate_tokens(text: str) -> int:
        # Rough estimation: 1 word ~ 1.3 tokens
        return int(len(text.split()) * 1.3)
