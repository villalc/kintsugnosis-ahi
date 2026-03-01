import torch
import torch.nn as nn
import torch.nn.functional as F

class GaugeLayer(nn.Module):
    """
    A gauge-regularized layer as described in the paper:
    h = W x + b
    h_tilde = h * (1 + 0.1 * tanh(phi))
    
    Where phi is the 'gauge connection' field.
    """
    def __init__(self, in_features, out_features, gauge_dim=None):
        super().__init__()
        self.linear = nn.Linear(in_features, out_features)
        
        # If gauge_dim is not specified, assume it matches out_features (element-wise gauge)
        # or it could be a separate field. The paper says "phi in R^d is a vector of gauge connections"
        # and "elementwise product". We'll assume a local gauge field matching the output dimension.
        g_dim = gauge_dim if gauge_dim is not None else out_features
        self.phi = nn.Parameter(torch.randn(g_dim) * 0.1)
        
        # Learnable 'structural memory' psi per layer
        self.psi = nn.Parameter(torch.tensor(0.5))

    def forward(self, x):
        h = self.linear(x)
        # Apply ReLU as per paper "Nonlinearities are standard ReLU activations"
        # Note: The formula 'h_tilde = ...' acts on the pre-activation or post-activation?
        # The paper says: "h = W x + b, \tilde{h} = h \odot (1 + ...). Nonlinearities are ReLU."
        # Usually h is pre-activation. But let's check if the gauge implies an active transformation before nonlinearity.
        # "Two such layers are stacked..." suggests the structure is: Input -> GaugeTrans -> ReLU -> ...
        
        # Apply Gauge Transformation
        gauge_factor = 1.0 + 0.1 * torch.tanh(self.phi)
        h_tilde = h * gauge_factor
        
        # Apply Nonlinearity
        output = F.relu(h_tilde)
        
        return output

class SintergicGaugeNet(nn.Module):
    """
    The full 'Sintergic' network architecture.
    Input: Flat vector of size L = 5^3 = 125.
    Structure: GaugeLayer -> GaugeLayer -> Dense -> Output.
    """
    def __init__(self):
        super().__init__()
        self.input_size = 125
        self.hidden1 = 128 # The paper doesn't specify exact width, assuming 128
        self.hidden2 = 64
        self.hidden_final = 32
        self.num_classes = 2 # Binary classification
        
        self.layer1 = GaugeLayer(self.input_size, self.hidden1)
        self.layer2 = GaugeLayer(self.hidden1, self.hidden2)
        
        # "followed by a smaller hidden layer and a linear classifier"
        # We can treat the third layer as a standard layer or another gauge layer?
        # Paper says "Two such layers are stacked, followed by a smaller hidden layer..."
        # Implies the 3rd is standard.
        self.layer3 = nn.Linear(self.hidden2, self.hidden_final)
        self.classifier = nn.Linear(self.hidden_final, self.num_classes)
        
        # Global Psi
        self.global_psi = nn.Parameter(torch.tensor(0.5))

    def forward(self, x):
        x = self.layer1(x)
        x = self.layer2(x)
        
        # Third layer (standard)
        x = F.relu(self.layer3(x))
        
        # Classifier
        logits = self.classifier(x)
        return logits, self.global_psi

def get_psi_loss(model):
    """
    Regularize psi to stay in [0.3, 0.9].
    """
    loss = 0.0
    # Collect all psi parameters
    psis = [model.global_psi, model.layer1.psi, model.layer2.psi]
    
    for p in psis:
        # Soft barrier penalty
        # If p < 0.3, penalty (0.3 - p)^2
        # If p > 0.9, penalty (p - 0.9)^2
        dist_lower = F.relu(0.3 - p)
        dist_upper = F.relu(p - 0.9)
        loss += dist_lower**2 + dist_upper**2
        
    return loss
