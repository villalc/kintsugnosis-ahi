import networkx as nx
from core.geometry.physics.lattice import SquareLattice

def test_lattice_edge_index_correctness():
    size = 10
    lattice = SquareLattice(size)

    # Compute expected edge_index using the old method (nx based)
    # We construct it manually here to verify against the optimized one
    G = nx.grid_2d_graph(size, size, periodic=True)
    nodes_list = sorted(list(G.nodes()))
    node_to_idx = {node: i for i, node in enumerate(nodes_list)}

    expected_edges = set()
    for u, v in G.edges():
        u_idx = node_to_idx[u]
        v_idx = node_to_idx[v]
        expected_edges.add((u_idx, v_idx))
        expected_edges.add((v_idx, u_idx))

    # Get actual edges from lattice.edge_index
    actual_edges = set()
    edge_index = lattice.edge_index
    for i in range(edge_index.shape[1]):
        u = edge_index[0, i].item()
        v = edge_index[1, i].item()
        actual_edges.add((u, v))

    assert actual_edges == expected_edges
    assert len(actual_edges) == 2 * size * size * 2 # 2*N^2 edges (undirected) -> 4*N^2 directed edges

def test_lattice_lazy_loading():
    size = 5
    lattice = SquareLattice(size)

    # Check that private attributes are None initially
    assert lattice._graph is None
    assert lattice._edges is None
    assert lattice._nodes_list is None
    assert lattice._node_to_idx is None

    # Access graph, should trigger load
    assert lattice.graph is not None
    assert lattice._graph is not None

    # Access edges, should trigger load
    assert len(lattice.edges) > 0
    assert lattice._edges is not None

    # Access nodes_list
    assert len(lattice.nodes_list) == size * size

    # Access node_to_idx
    assert len(lattice.node_to_idx) == size * size

def test_get_neighbors():
    size = 5
    lattice = SquareLattice(size)

    # Test for a few random nodes
    # (0,0) -> index 0
    # Neighbors: (0,1), (0,4), (1,0), (4,0)
    # Indices: 1, 4, 5, 20

    idx = 0
    neighbors = set(lattice.get_neighbors(idx))
    expected = {1, 4, 5, 20}
    assert neighbors == expected

    # Test for (2,2) -> index 2*5 + 2 = 12
    # Neighbors: (2,3), (2,1), (3,2), (1,2)
    # Indices: 13, 11, 17, 7
    idx = 12
    neighbors = set(lattice.get_neighbors(idx))
    expected = {13, 11, 17, 7}
    assert neighbors == expected

def test_get_neighbors_matches_graph():
    size = 6
    lattice = SquareLattice(size)
    # Force graph load
    _ = lattice.graph

    for i in range(size * size):
        neighbors_arithmetic = set(lattice.get_neighbors(i))

        # Get neighbors from graph
        node = lattice.nodes_list[i]
        neighbors_graph = set([lattice.node_to_idx[n] for n in lattice.graph.neighbors(node)])

        assert neighbors_arithmetic == neighbors_graph
