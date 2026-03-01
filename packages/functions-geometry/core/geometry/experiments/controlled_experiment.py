import torch
import torch.nn as nn
import torch.optim as optim
import json
from gauge_lattice import SintergicGaugeNet, get_psi_loss
from curvature import synthetic_ricci_curvature
from gauge_experiment import compute_mass_gap

def run_controlled_experiment():
    STEPS = 500
    BATCH_SIZE = 16
    LR = 1e-4
    DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Running Curvature-Controlled Experiment on {DEVICE}")
    
    model = SintergicGaugeNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=LR)
    criterion = nn.CrossEntropyLoss()
    
    torch.manual_seed(42)
    inputs = torch.randn(BATCH_SIZE, 125).to(DEVICE)
    targets = torch.randint(0, 2, (BATCH_SIZE,)).to(DEVICE)
    
    # Validation Set (to check generalization improvement)
    val_inputs = torch.randn(100, 125).to(DEVICE)
    val_targets = torch.randint(0, 2, (100,)).to(DEVICE)
    
    logs = []
    
    print("Step | Loss   | Curv   | Val Acc")
    print("-" * 35)
    
    for step in range(STEPS + 1):
        optimizer.zero_grad()
        
        # 1. Curvature Calculation
        kappa = synthetic_ricci_curvature(model, inputs)
        if isinstance(kappa, torch.Tensor): kappa = kappa.item()
        
        # 2. Forward
        logits, _ = model(inputs)
        task_loss = criterion(logits, targets)
        psi_loss = get_psi_loss(model)
        
        # 3. Curvature Control Penalty
        # Force kappa > 0.05 (Arbitrary positive target)
        # We need a differentiable penalty? 
        # Since 'synthetic_ricci_curvature' is likely NOT differentiable in this implementation
        # (due to 'no_grad' in perturbations), we can't backprop through it.
        # However, for this experiment, let's assumes we implemented a Differentiable version
        # OR we use a "Proxy" regularizer: 
        # The paper mentions Psi is a "Structural Memory". Maybe forcing Psi higher/lower correlates?
        # Actually, let's just log it and see if standard regularization keeps it better?
        # WAIT. I can't "Force" it if I can't backprop.
        # BUT: I can use the existing "Psi" to try to influence it.
        # Let's try to correlate Psi with Curvature.
        # HYPOTHESIS: High Psi -> Rigid -> Positive Curvature?
        # Let's change the Psi regularizer target from [0.3, 0.9] to [0.8, 0.95] (High Rigidity).
        
        psi_target_loss = 0.0
        psis = [model.global_psi, model.layer1.psi, model.layer2.psi]
        for p in psis:
            psi_target_loss += (p - 0.9)**2 # Push towards 0.9
            
        loss = task_loss + 1.0 * psi_target_loss # Strong structural bias
        
        loss.backward()
        optimizer.step()
        
        if step % 50 == 0:
            # Check Val Acc
            val_logits, _ = model(val_inputs)
            val_preds = val_logits.argmax(dim=1)
            val_acc = (val_preds == val_targets).float().mean().item()
            
            print(f"{step:4d} | {task_loss.item():.4f} | {kappa:.4f} | {val_acc:.2f}")
            
            logs.append({"step": step, "curvature": kappa, "val_acc": val_acc})
            
    # Save logs
    with open("controlled_experiment_logs.json", "w") as f:
        json.dump(logs, f, indent=2)
        
    print("Controlled Experiment Complete.")

if __name__ == "__main__":
    run_controlled_experiment()
