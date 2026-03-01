import torch
import networkx as nx

class SquareLattice:
    def __init__(self, size: int):
        """
        Initializes a 2D square lattice of size x size.
        
        Args:
            size (int): The side length of the lattice.
        """
        self.size = size
        self.num_nodes = size * size
        
        # Lazy initialization
        self._graph = None
        self._edges = None
        self._nodes_list = None
        self._node_to_idx = None
        
        # Optimized edge_index construction using arithmetic
        # Generate grid coordinates
        device = torch.device('cpu')

        # 0, 1, ..., N^2 - 1
        nodes = torch.arange(self.num_nodes, dtype=torch.long, device=device)

        # Calculate x and y coordinates (row-major order matching sorted(nx.nodes))
        x = nodes // size
        y = nodes % size

        # Right neighbors: (x, (y+1)%size)
        y_right = (y + 1) % size
        right_neighbors = x * size + y_right

        # Down neighbors: ((x+1)%size, y)
        x_down = (x + 1) % size
        down_neighbors = x_down * size + y

        # Construct edge_index with bidirectional edges
        # We have edges: nodes -> right_neighbors
        #                nodes -> down_neighbors
        # And since it's bidirectional:
        #                right_neighbors -> nodes
        #                down_neighbors -> nodes

        src = torch.cat([nodes, nodes, right_neighbors, down_neighbors])
        dst = torch.cat([right_neighbors, down_neighbors, nodes, nodes])

        self.edge_index = torch.stack([src, dst], dim=0)

        # Construct edge_vectors matching the order of edge_index:
        # 1. nodes -> right_neighbors: (0, 1)
        # 2. nodes -> down_neighbors: (1, 0)
        # 3. right_neighbors -> nodes: (0, -1)
        # 4. down_neighbors -> nodes: (-1, 0)

        vec_right = torch.tensor([[0, 1]], dtype=torch.long, device=device).repeat(self.num_nodes, 1)
        vec_down = torch.tensor([[1, 0]], dtype=torch.long, device=device).repeat(self.num_nodes, 1)
        vec_left = torch.tensor([[0, -1]], dtype=torch.long, device=device).repeat(self.num_nodes, 1)
        vec_up = torch.tensor([[-1, 0]], dtype=torch.long, device=device).repeat(self.num_nodes, 1)

        self.edge_vectors = torch.cat([vec_right, vec_down, vec_left, vec_up], dim=0)
    
    @property
    def graph(self):
        if self._graph is None:
            self._graph = nx.grid_2d_graph(self.size, self.size, periodic=True)
        return self._graph

    @property
    def edges(self):
        if self._edges is None:
            self._edges = list(self.graph.edges())
        return self._edges

    @property
    def nodes_list(self):
        if self._nodes_list is None:
            self._nodes_list = sorted(list(self.graph.nodes()))
        return self._nodes_list

    @property
    def node_to_idx(self):
        if self._node_to_idx is None:
            self._node_to_idx = {node: i for i, node in enumerate(self.nodes_list)}
        return self._node_to_idx

    def get_neighbors(self, idx):
        # Arithmetic neighbor calculation avoiding graph lookup
        size = self.size
        # Row-major index to (x, y)
        x = idx // size
        y = idx % size

        neighbors = []
        # Right: (x, (y+1)%size)
        neighbors.append(x * size + (y + 1) % size)
        # Left: (x, (y-1)%size)
        neighbors.append(x * size + (y - 1) % size)
        # Down: ((x+1)%size, y)
        neighbors.append(((x + 1) % size) * size + y)
        # Up: ((x-1)%size, y)
        neighbors.append(((x - 1) % size) * size + y)

        return neighbors
