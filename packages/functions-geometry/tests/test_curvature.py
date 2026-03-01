import sys
import os
import torch
import pytest

# Add parent directory to path to import core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.geometry.models.syntergic_model import SintergicGaugeNet
from core.geometry.physics.curvature import (
    synthetic_ricci_curvature,
    ricci_curvature_regularizer,
    weighted_wasserstein_1d,
)

def test_synthetic_ricci_curvature_runs():
    """
    Verifies that synthetic_ricci_curvature runs without error and returns a float.
    Also checks that model parameters are restored.
    """
    device = torch.device("cpu")
    lattice_size = 10 # Small size for test
    model = SintergicGaugeNet(lattice_size=lattice_size, hidden_dim=16, n_scales=2, num_classes=5).to(device)

    # Capture initial parameters
    initial_params = [p.clone() for p in model.parameters()]

    # Create dummy data
    input_dim = lattice_size * lattice_size
    data_batch = torch.randn(4, input_dim).to(device)

    # Run curvature calculation
    ricci_val = synthetic_ricci_curvature(model, data_batch)

    # Check return type
    assert isinstance(ricci_val, float) or isinstance(ricci_val, torch.Tensor)
    if isinstance(ricci_val, torch.Tensor):
        assert ricci_val.numel() == 1

    # Check parameter restoration
    final_params = [p for p in model.parameters()]
    for p_init, p_final in zip(initial_params, final_params):
        assert torch.allclose(p_init, p_final), "Model parameters were not restored correctly!"

def test_ricci_curvature_regularizer_runs():
    """
    Verifies that ricci_curvature_regularizer runs and returns penalty.
    """
    device = torch.device("cpu")
    lattice_size = 10
    model = SintergicGaugeNet(lattice_size=lattice_size, hidden_dim=16, n_scales=2, num_classes=5).to(device)
    data_batch = torch.randn(4, lattice_size * lattice_size).to(device)

    penalty, ricci = ricci_curvature_regularizer(model, data_batch)

    assert isinstance(penalty, torch.Tensor)
    assert penalty.ndim == 0 or penalty.numel() == 1
    assert isinstance(ricci, float) or isinstance(ricci, torch.Tensor)


# ---------------------------------------------------------------------------
# weighted_wasserstein_1d tests
# ---------------------------------------------------------------------------

def _uniform_weights(n):
    return torch.ones(n) / n


def test_weighted_wasserstein_1d_identical_distributions():
    """W1 distance between identical distributions should be 0."""
    vals = torch.tensor([0.0, 0.5, 1.0])
    w = _uniform_weights(3)
    result = weighted_wasserstein_1d(vals, w, vals, w)
    assert result.item() == pytest.approx(0.0, abs=1e-6)


def test_weighted_wasserstein_1d_known_value():
    """W1 between uniform[0,1] and uniform[1,2] (unit mass shift) should equal 1."""
    # Approximate with many points
    n = 100
    x = torch.linspace(0.0, 1.0, n)
    y = torch.linspace(1.0, 2.0, n)
    wx = _uniform_weights(n)
    wy = _uniform_weights(n)
    result = weighted_wasserstein_1d(x, wx, y, wy)
    assert result.item() == pytest.approx(1.0, abs=0.02)


def test_weighted_wasserstein_1d_symmetry():
    """W1(X, Y) should equal W1(Y, X)."""
    x = torch.tensor([0.0, 1.0, 3.0])
    y = torch.tensor([0.5, 2.0, 4.0])
    wx = torch.tensor([0.2, 0.5, 0.3])
    wy = torch.tensor([0.4, 0.4, 0.2])
    d_xy = weighted_wasserstein_1d(x, wx, y, wy)
    d_yx = weighted_wasserstein_1d(y, wy, x, wx)
    assert d_xy.item() == pytest.approx(d_yx.item(), abs=1e-6)


def test_weighted_wasserstein_1d_triangle_inequality():
    """W1 should satisfy W1(X, Z) <= W1(X, Y) + W1(Y, Z)."""
    x = torch.tensor([0.0, 1.0])
    y = torch.tensor([0.5, 1.5])
    z = torch.tensor([1.0, 2.0])
    w = _uniform_weights(2)
    d_xz = weighted_wasserstein_1d(x, w, z, w)
    d_xy = weighted_wasserstein_1d(x, w, y, w)
    d_yz = weighted_wasserstein_1d(y, w, z, w)
    assert d_xz.item() <= d_xy.item() + d_yz.item() + 1e-6


def test_weighted_wasserstein_1d_single_point():
    """W1 between two single-point distributions equals |x - y|."""
    x = torch.tensor([2.0])
    y = torch.tensor([5.0])
    w = torch.tensor([1.0])
    result = weighted_wasserstein_1d(x, w, y, w)
    assert result.item() == pytest.approx(3.0, abs=1e-6)


def test_weighted_wasserstein_1d_non_uniform_weights():
    """Weighted distribution shifts the effective mass center."""
    # x is bimodal: most mass at 0, little at 10
    # y is bimodal: most mass at 10, little at 0
    x = torch.tensor([0.0, 10.0])
    y = torch.tensor([0.0, 10.0])
    wx = torch.tensor([0.9, 0.1])
    wy = torch.tensor([0.1, 0.9])
    result = weighted_wasserstein_1d(x, wx, y, wy)
    # W1 = integral |F_x^-1(t) - F_y^-1(t)| dt
    # F_x^-1: 0 for t in [0,0.9), 10 for t in [0.9,1]
    # F_y^-1: 0 for t in [0,0.1), 10 for t in [0.1,1]
    # Expected = |0-10| * 0.8 = 8.0
    assert result.item() == pytest.approx(8.0, abs=0.1)


def test_weighted_wasserstein_1d_zero_weights_raises():
    """Should raise ValueError when weight sum is too close to zero."""
    x = torch.tensor([1.0, 2.0])
    y = torch.tensor([1.0, 2.0])
    zero_w = torch.tensor([0.0, 0.0])
    normal_w = _uniform_weights(2)
    with pytest.raises(ValueError):
        weighted_wasserstein_1d(x, zero_w, y, normal_w)
    with pytest.raises(ValueError):
        weighted_wasserstein_1d(x, normal_w, y, zero_w)
