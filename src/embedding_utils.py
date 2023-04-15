import numpy as np
import openai
from typing import List, Tuple, Any


def get_embedding(text: str) -> np.ndarray:
    text = text.replace("\n", " ")
    emb__D = np.array(
        openai.Embedding.create(
            input=[text],
            model="text-embedding-ada-002"
        )['data'][0]['embedding'],
        dtype=float
    )
    return emb__D


def cosine_similarity(x: np.ndarray, y: np.ndarray) -> float:
    return (x @ y.T) / (np.linalg.norm(x) * np.linalg.norm(y))


def get_embedding_scores(
    data_and_emb: List[Tuple[Any, np.ndarray]],
    query: str,
    decay: float = 1.0,
    lb_decay: float = 0.5
) -> List[Tuple[float, Any]]:
    query_embedding = get_embedding(query)

    decay_factor = 1.0
    candidate_facts = []
    for fact_data, fact_emb in data_and_emb:
        similarity = cosine_similarity(
            fact_emb, query_embedding
        )
        fact_score = max(decay_factor, lb_decay) * similarity
        candidate_facts.append((fact_score, fact_data))
        decay_factor *= decay

    return candidate_facts


def build_context(
    facts: List[Tuple[str, np.ndarray]],
    query: str,
    max_tokens: int,
    decay: float = 1.0,
    lb_decay: float = 0.5
) -> str:
    context_parts = []
    context_tokens = 0
    candidate_facts = sorted(
        get_embedding_scores(
            facts, query, decay=decay, lb_decay=lb_decay
        )
    )
    while candidate_facts and context_tokens < max_tokens:
        _, fact_str = candidate_facts.pop()
        # + 5 for separators
        fact_tokens = len(fact_str) // 4 + 5
        if context_tokens + fact_tokens <= max_tokens:
            context_parts.append(fact_str)
            context_tokens += fact_tokens

    return "\n#### FACT: ###\n".join(context_parts)
