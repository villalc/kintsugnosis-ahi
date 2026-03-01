import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

class ComplexGaugeLayer(nn.Module):
    """
    U(1) Gauge Layer operating on Complex Numbers.
    h' = h * e^(i * phi)
    This corresponds to a phase rotation (local symmetry) rather than scaling.
    This allows for INTERFERENCE effects (destructive/constructive).
    """
    def __init__(self, in_features, out_features):
        super().__init__()
        # Weights are complex: W = A + iB
        self.fc_real = nn.Linear(in_features, out_features)
        self.fc_imag = nn.Linear(in_features, out_features)
        
        # Gauge Field phi (Real scalar per node, acting as phase)
        self.phi = nn.Parameter(torch.randn(out_features) * 0.1)

    def forward(self, x_real, x_imag):
        # 1. Complex Linear Transformation
        # (a+bi)(c+di) = (ac-bd) + i(ad+bc)
        out_real = self.fc_real(x_real) - self.fc_imag(x_imag)
        out_imag = self.fc_real(x_imag) + self.fc_imag(x_real)
        
        # 2. U(1) Gauge Rotation (Superposition/Phase Shift)
        # e^(i*phi) = cos(phi) + i*sin(phi)
        cos_phi = torch.cos(self.phi)
        sin_phi = torch.sin(self.phi)
        
        # Multiply (out_real + i*out_imag) * (cos + i*sin)
        rotated_real = out_real * cos_phi - out_imag * sin_phi
        rotated_imag = out_real * sin_phi + out_imag * cos_phi
        
        # 3. Complex Non-linearity (CReLU or ModReLU)
        # Simple choice: ReLU on Magnitude, keep Phase?
        # Or split ReLU (paper usually uses Split ReLU for simplicity)
        res_real = F.relu(rotated_real)
        res_imag = F.relu(rotated_imag)
        
        return res_real, res_imag

class QuantumGaugeNet(nn.Module):
    """
    A network that processes information as a 'Wavefunction' (Complex Amplitudes).
    Input: Real vector mapped to Complex plane.
    Output: Magnitude of the final complex state.
    """
    def __init__(self):
        super().__init__()
        self.input_size = 125
        self.hidden1 = 128
        self.hidden2 = 64
        self.num_classes = 2
        
        self.layer1 = ComplexGaugeLayer(self.input_size, self.hidden1)
        self.layer2 = ComplexGaugeLayer(self.hidden1, self.hidden2)
        
        # Readout: Magnitude -> Linear
        self.classifier = nn.Linear(self.hidden2, self.num_classes)

    def forward(self, x):
        # Input x is Real [B, 125]. Treat as Real part?
        # Or embed input data into phase?
        # Let's treat x as Magnitude with Phase 0.
        x_real = x
        x_imag = torch.zeros_like(x)
        
        xr, xi = self.layer1(x_real, x_imag)
        xr, xi = self.layer2(xr, xi)
        
        # Collapse Wavefunction: Magnitude |z| = sqrt(a^2 + b^2)
        magnitude = torch.sqrt(xr**2 + xi**2 + 1e-9)
        
        logits = self.classifier(magnitude)
        
        # Return logits and the internal wavefunction (last layer) for visualization
        return logits, (xr, xi)
