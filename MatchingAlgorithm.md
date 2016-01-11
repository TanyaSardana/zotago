The Zotago Matching Algorithm
=============================

Computes the match data between two sets of tags. This data can in turn be
used to compute a raw score suitable for ranking searches, or a normalized
score suitable for deciding whether to send notifications.

The algorithm works by counting the following quantities:
    q_alpha: the tags in p1 that are in p2
    q_beta: the tags in p1 that are in M(p2)
    q_gamma: the tags in M(p1) that are in p2
    q_delta: the tags in M(p1) that are in M(p2)

where
    p1: the source set of tags
    p2: the target set of tags
    M(P): denotes the union of the sets of metatags for each tag in P.

Multiplying each count by exponentially decreasing weights and summing gives
the total raw match score.

These weights are presently called "alpha", "beta", "gamma", and "delta".

This score should be normalized somehow according to |p1| and |p2|. A
normalization scheme is currently implemented, although it probably isn't
very good. We simply divide the raw match score by the total count of
matched tags.
