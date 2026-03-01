import torch
from core.geometry.physics.lattice import SquareLattice

def test_lattice_edge_vectors_shape():
    size = 4
    lattice = SquareLattice(size)

    # Total edges = 4 * N^2 (Right, Down, Left, Up for each node)
    expected_num_edges = 4 * size * size

    assert isinstance(lattice.edge_vectors, torch.Tensor)
    assert lattice.edge_vectors.shape == (expected_num_edges, 2)

def test_lattice_edge_vectors_values():
    size = 3
    lattice = SquareLattice(size)
    num_nodes = size * size

    # Current implementation constructs edge_index by concatenating 4 blocks:
    # 1. Right neighbors
    # 2. Down neighbors
    # 3. Left neighbors (inverse of 1)
    # 4. Up neighbors (inverse of 2)

    # We expect edge_vectors to follow the same order

    # Block 1: Right -> (0, 1)
    block1 = lattice.edge_vectors[:num_nodes]
    expected_block1 = torch.tensor([[0, 1]], dtype=torch.long).repeat(num_nodes, 1)
    assert torch.all(block1 == expected_block1)

    # Block 2: Down -> (1, 0)
    block2 = lattice.edge_vectors[num_nodes:2*num_nodes]
    expected_block2 = torch.tensor([[1, 0]], dtype=torch.long).repeat(num_nodes, 1)
    assert torch.all(block2 == expected_block2)

    # Block 3: Left -> (0, -1)
    block3 = lattice.edge_vectors[2*num_nodes:3*num_nodes]
    expected_block3 = torch.tensor([[0, -1]], dtype=torch.long).repeat(num_nodes, 1)
    assert torch.all(block3 == expected_block3)

    # Block 4: Up -> (-1, 0)
    block4 = lattice.edge_vectors[3*num_nodes:]
    expected_block4 = torch.tensor([[-1, 0]], dtype=torch.long).repeat(num_nodes, 1)
    assert torch.all(block4 == expected_block4)

def test_lattice_edge_vectors_consistency():
    # Verify that edge_vectors match the geometric difference of edge_index for non-periodic edges
    # For periodic edges, the difference will be large, so we skip those or handle modulo
    size = 5
    lattice = SquareLattice(size)
    edge_index = lattice.edge_index
    edge_vectors = lattice.edge_vectors

    for i in range(edge_index.shape[1]):
        u = edge_index[0, i].item()
        v = edge_index[1, i].item()

        u_pos = torch.tensor([u // size, u % size])
        v_pos = torch.tensor([v // size, v % size])

        vec = edge_vectors[i]

        # Calculate expected diff
        diff = v_pos - u_pos

        # Check periodic wrap-around
        # If diff is > size/2, it means it wrapped around, so actual geometric distance is diff - size
        # If diff is < -size/2, it means it wrapped around, so actual geometric distance is diff + size

        # However, our edge_vectors are simple unit vectors (0,1), (1,0), etc.
        # So we should match the unit vector direction.

        # If u=(0,0) and v=(0,4) [left neighbor wrapping], u_pos=(0,0), v_pos=(0,4)
        # diff = (0, 4).
        # We expect vec = (0, -1).

        # Let's adjust diff for periodicity
        if diff[0] > size // 2: diff[0] -= size
        elif diff[0] < -size // 2: diff[0] += size

        if diff[1] > size // 2: diff[1] -= size
        elif diff[1] < -size // 2: diff[1] += size

        assert torch.equal(vec, diff), f"Mismatch at edge {u}->{v}: expected {diff}, got {vec}"
