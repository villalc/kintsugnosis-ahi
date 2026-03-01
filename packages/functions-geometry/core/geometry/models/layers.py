import torch
import torch.nn as nn
from e3nn import o3
from e3nn.nn import BatchNorm

class GaugeLatticeLayer(nn.Module):
    def __init__(self, irreps_in, irreps_out, edge_attr_irreps='1x1o'):
        """
        Gauge Equivariant Lattice Layer.
        
        Args:
            irreps_in (str): Irreps of input features (node state).
            irreps_out (str): Irreps of output features.
            edge_attr_irreps (str): Irreps of edge attributes (relative positions).
                                    '1x1o' corresponds to 3D vectors.
        """
        super().__init__()
        self.irreps_in = o3.Irreps(irreps_in)
        self.irreps_out = o3.Irreps(irreps_out)
        self.irreps_edge = o3.Irreps(edge_attr_irreps)
        
        # Self-interaction (Linear)
        self.self_linear = o3.Linear(self.irreps_in, self.irreps_out)
        
        # Tensor Product for message passing: Input x Edge -> Output
        # This combines the neighbor's state with the relative position vector
        self.tp = o3.FullyConnectedTensorProduct(
            self.irreps_in,
            self.irreps_edge,
            self.irreps_out,
            internal_weights=True
        )
        
        self.norm = BatchNorm(self.irreps_out)
        # Gated non-linearity could be added here for better expressivity
        
    def forward(self, x, edge_index, edge_attr):
        """
        Args:
            x: [num_nodes, dim_in] Node features
            edge_index: [2, num_edges] Connectivity
            edge_attr: [num_edges, dim_edge] Relative position vectors encoded
        """
        # 1. Self-interaction
        out_self = self.self_linear(x)
        
        # 2. Neighbor interaction
        # Gather source node features
        src, dst = edge_index
        x_src = x[src]
        
        # Tensor Product: transport feature from src to dst via edge
        # eq: x_j \otimes r_ij -> update for i
        # here we assume global frame for simplicity or trivial connection
        # For a "Gauge" NN, usually one includes U_ij (parallel transporter).
        # In e3nn, if we rotate the whole system, vectors rotate.
        msg = self.tp(x_src, edge_attr)
        
        # Aggregate messages (scatter addition)
        # Using a simple loop or scatter_add provided by torch_scatter if available,
        # otherwise manual index_add_.
        out_neigh = torch.zeros(x.shape[0], self.irreps_out.dim, device=x.device)
        out_neigh.index_add_(0, dst, msg)
        
        # Combine
        total = out_self + out_neigh
        return self.norm(total)

class GLNN(nn.Module):
    def __init__(self, lattice_size, irreps_hidden, num_layers=3):
        super().__init__()
        self.lattice_size = lattice_size
        self.irreps_hidden = o3.Irreps(irreps_hidden)
        
        # Input embedding: Assuming initialization with random scalars or vectors
        # If input is random noise as in user code:
        # User had: self.state = torch.randn(dim_hidden) => scalars?
        # Let's assume input is some simple representation, e.g., 5 scalars
        self.irreps_in = o3.Irreps("5x0e") 
        self.input_embed = o3.Linear(self.irreps_in, self.irreps_hidden)
        
        self.layers = nn.ModuleList([
            GaugeLatticeLayer(self.irreps_hidden, self.irreps_hidden)
            for _ in range(num_layers)
        ])
        
        # Readout: Invariant part (scalars)
        self.readout_linear = o3.Linear(self.irreps_hidden, "1x0e") # To scalar score
        
    def forward(self, x, edge_index, edge_attr):
        x = self.input_embed(x)
        for layer in self.layers:
            x = layer(x, edge_index, edge_attr)
        
        # Global pooling
        x_pool = x.mean(dim=0, keepdim=True)
        return self.readout_linear(x_pool)
