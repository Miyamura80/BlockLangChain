from embedding_utils import build_context, get_embedding


class Memory:
    def __init__(self, memory_decay: float = 0.95, memory_lb_decay: float = 0.5):
        self.facts = []
        self.memory_decay = memory_decay
        self.memory_lb_decay = memory_lb_decay


    def generate_context(self, query: str, max_tokens: int = 1000) -> str:
        context_str = build_context(
            self.facts,
            query,
            max_tokens=max_tokens,
            decay=self.memory_decay,
            lb_decay=self.memory_lb_decay,
        )

        return context_str


    def update_memory(self, fact_str: str):
        emb__D = get_embedding(fact_str)
        self.facts.append((fact_str, emb__D))