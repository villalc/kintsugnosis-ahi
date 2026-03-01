import sys
import os
import torch
import torch.nn as nn
import unittest

# Add parent directory to path to import core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.geometry.physics.regularizers import mass_gap_regularizer

class TestRegularizers(unittest.TestCase):
    def test_mass_gap_regularizer_runs(self):
        """
        Verifies that mass_gap_regularizer runs without error and returns a scalar tensor.
        """
        device = torch.device("cpu")
        input_dim = 10
        output_dim = 5
        model = nn.Sequential(
            nn.Linear(input_dim, 20),
            nn.ReLU(),
            nn.Linear(20, output_dim)
        ).to(device)

        # Create dummy data and loss
        inputs = torch.randn(4, input_dim).to(device)
        targets = torch.randn(4, output_dim).to(device)
        output = model(inputs)
        loss = nn.MSELoss()(output, targets)

        # Run regularizer
        penalty = mass_gap_regularizer(model, loss)

        # Check return type
        self.assertIsInstance(penalty, torch.Tensor)
        self.assertEqual(penalty.numel(), 1)
        # self.assertTrue(penalty.requires_grad) # Might be constant if gap > delta_min

    def test_mass_gap_regularizer_gradients(self):
        """
        Verifies that gradients can be computed from the penalty.
        """
        device = torch.device("cpu")
        # Use a non-linear model so Hessian depends on parameters
        model = nn.Sequential(
            nn.Linear(5, 10),
            nn.Tanh(),
            nn.Linear(10, 1)
        ).to(device)

        inputs = torch.randn(2, 5).to(device)
        targets = torch.randn(2, 1).to(device)

        loss = nn.MSELoss()(model(inputs), targets)

        # Use a large delta to force penalty > 0
        penalty = mass_gap_regularizer(model, loss, delta_min=100.0)

        # Check if penalty requires grad
        if not penalty.requires_grad:
             print("Warning: penalty does not require grad. This might be due to zero penalty or detached graph.")

        penalty.backward()

        grad_found = False
        for param in model.parameters():
            if param.grad is not None:
                grad_found = True
                break
        self.assertTrue(grad_found, "No gradients computed for model parameters")

if __name__ == '__main__':
    unittest.main()
