import torch
import torch.nn as nn
import torch.optim as optim
import json
from gauge_experiment import compute_mass_gap

# Standard MLP Baseline (No Gauge, No Psi)
class BaselineNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.input_size = 125
        self.hidden1 = 128
        self.hidden2 = 64
        self.hidden_final = 32
        self.num_classes = 2
        
        self.net = nn.Sequential(
            nn.Linear(self.input_size, self.hidden1),
            nn.ReLU(),
            nn.Linear(self.hidden1, self.hidden2),
            nn.ReLU(),
            nn.Linear(self.hidden2, self.hidden_final),
            nn.ReLU(),
            nn.Linear(self.hidden_final, self.num_classes)
        )

    def forward(self, x):
        return self.net(x), None # Second return is for API compatibility (no psi)

def run_baseline():
    STEPS = 500
    BATCH_SIZE = 16
    LR = 1e-4
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Running Baseline on {DEVICE}")
    
    model = BaselineNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=LR)
    criterion = nn.CrossEntropyLoss()
    
    # Same Seed for Fairness
    torch.manual_seed(42)
    inputs = torch.randn(BATCH_SIZE, 125).to(DEVICE)
    targets = torch.randint(0, 2, (BATCH_SIZE,)).to(DEVICE)
    
    logs = []
    
    print("Step | Loss   | Gap")
    print("-" * 25)
    
    for step in range(STEPS + 1):
        optimizer.zero_grad()
        
        logits, _ = model(inputs)
        loss = criterion(logits, targets)
        loss.backward()
        optimizer.step()
        
        metrics = {
            "step": step,
            "loss": loss.item()
        }
        
        # Compute Gap (Expensive, every 10 steps)
        if step % 10 == 0:
            gap = compute_mass_gap(model, criterion, inputs, targets)
            metrics["mass_gap"] = gap
            print(f"{step:4d} | {loss.item():.4f} | {gap:.4f}")
        else:
            metrics["mass_gap"] = None
            
        logs.append(metrics)
        
    with open("baseline_experiment_logs.json", "w") as f:
        json.dump(logs, f, indent=2)
    print("Baseline Complete.")

if __name__ == "__main__":
    run_baseline()
