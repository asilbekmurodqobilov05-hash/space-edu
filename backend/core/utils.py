import math


def calculate_level(xp: int) -> int:
    return math.floor(math.sqrt(xp / 100)) + 1


def xp_for_level(level: int) -> int:
    return (level - 1) ** 2 * 100
