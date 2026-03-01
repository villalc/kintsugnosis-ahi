import torch
import numpy as np

def generate_grinberg_lattice(size=80, n_scales=5, a=0.7, alpha=1.0):
    """
    Generates a fractal lattice structure based on Grinberg's Syntergic Theory.
    
    Formula:
    L(x, y) = Sum_{i=0}^{n} a^i * cos(alpha * pi * 2^i * x) * cos(alpha * pi * 2^i * y)
    
    Args:
        size (int): Grid size (size x size).
        n_scales (int): Number of fractal scales to superimpose.
        a (float): Decay factor for higher frequencies (default 0.7 from paper).
        alpha (float): Frequency scaler.
        
    Returns:
        torch.Tensor: Flattened lattice tensor of shape [size*size].
    """
    x = torch.linspace(0, 1, size)
    y = torch.linspace(0, 1, size)
    X, Y = torch.meshgrid(x, y, indexing='ij')
    
    lattice = torch.zeros_like(X)
    for i in range(n_scales):
        scale = 2 ** i
        # The paper mentions L(x, y) = Sum ...
        # We assume the interaction is additive across scales.
        lattice += (a ** i) * torch.cos(alpha * np.pi * scale * X) * \
                              torch.cos(alpha * np.pi * scale * Y)
    
    return lattice.flatten()
