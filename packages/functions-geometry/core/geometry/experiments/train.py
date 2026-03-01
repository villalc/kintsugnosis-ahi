import torch
import torch.nn as nn
import torch.optim as optim
from core.geometry.physics.lattice import SquareLattice
from core.geometry.models.layers import GLNN
from core.geometry.physics.regularizers import mass_gap_regularizer
from e3nn import o3

def main():
    # Settings
    LATTICE_SIZE = 4
    HIDDEN_IRREPS = "16x0e + 8x1o" # Skalar + Vector conceptual mix
    NUM_LAYERS = 2
    BATCH_SIZE = 2
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    print(f"Initializing GLNN on {DEVICE}...")
    
    # Data Setup
    # Create a lattice
    lattice = SquareLattice(LATTICE_SIZE)
    edge_index = lattice.edge_index.to(DEVICE)
    
    # Fake relative attributes: say all edges are length 1 in +x or +y
    # For a real case, we'd compute r_ij. 
    # Here we just init random edge attrs compatible with '1x1o' (3D vector)
    # The lattice has 4 neighbors.
    num_edges = edge_index.shape[1]
    edge_attr = torch.randn(num_edges, 3, device=DEVICE) 
    # (Usually this should be geometric, e.g. (1,0,0) etc)
    
    # Model
    model = GLNN(LATTICE_SIZE, HIDDEN_IRREPS, NUM_LAYERS).to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    
    print("Starting training loop...")
    
    for epoch in range(10):
        optimizer.zero_grad()
        
        # Synthetic Input: batch of random scalars on nodes
        # [Batch, Nodes, Features] -> Flatten batch for geometric?
        # Typically geometric graphs are one big graph or batched graphs.
        # Let's process one "lattice snapshot" per step for simplicity or a small batch.
        
        # Input: [NumNodes, 5] (5 scalars as defined in GLNN init)
        x = torch.randn(LATTICE_SIZE**2, 5, device=DEVICE)
        
        # Forward
        output = model(x, edge_index, edge_attr)
        
        # Synthetic Target
        target = torch.tensor([[1.0]], device=DEVICE) # Regression target
        
        # Task Loss
        loss_task = nn.MSELoss()(output, target)
        
        # Regularizer
        # Critical: we need the graph for HVP, so we must retain graph for loss_task 
        # OR re-compute forward pass logic inside regularizer?
        # The regularizer takes 'model' and 'inputs' usually, or 'model' and 'loss'.
        # Our signature matches: regularizer(model, loss_task...)
        # Note: autograd.grad(loss, inputs) works if input is param.
        # We need grad(loss, params).
        
        try:
            # We pass loss_task. The loop inside computes grad(loss_task, params).
            # Optimize: Run only every 5 steps and use fewer iterations
            if epoch % 5 == 0:
                loss_gap = mass_gap_regularizer(model, loss_task, lambda_reg=0.01, delta_min=0.5, max_iter=10)
            else:
                loss_gap = torch.tensor(0.0, device=DEVICE)
        except RuntimeError as e:
            print(f"Regularizer failed (likely graph retention): {e}")
            loss_gap = torch.tensor(0.0)

        total_loss = loss_task + loss_gap
        
        total_loss.backward()
        optimizer.step()
        
        print(f"Epoch {epoch}: Task Loss={loss_task.item():.4f}, Gap Loss={loss_gap.item():.4f}")

if __name__ == "__main__":
    main()
