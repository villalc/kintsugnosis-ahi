import torch
import numpy as np

def compute_syntergy(activations):
    """
    Computes Syntergy = Coherence * Density_Info * Frequency
    
    Args:
        activations (torch.Tensor): Output or hidden state [Batch, Features] or [Features]
    """
    # Ensure 2D [Batch, Feature] for corrcoef
    if activations.ndim == 1:
        activations = activations.unsqueeze(0)
    
    # Coherence: Average absolute correlation between features/neurons
    # If batch size is 1, correlation is NaN/1. We need multiple samples or spatial dimensions.
    # Assuming activations: [Batch, HiddenDim]
    if activations.shape[0] > 1:
        coherence = torch.corrcoef(activations.T).abs().mean()
    else:
        # Fallback if single sample: Coherence of internal scalar structure? 
        # Or Just 1.0/0.0? Let's assume coherence requires variance over batch.
        coherence = torch.tensor(0.5) 

    # Density Informacional (Entropy)
    # entropy = - sum p log p
    probs = torch.softmax(activations, dim=-1)
    entropy = -(probs * torch.log(probs + 1e-9)).sum(dim=-1).mean()
    
    # Frequency: Rate of change. 
    # In a static feedforward, "frequency" might be spatial gradient strength.
    # From user prompt: "torch.gradient(activations)[0].abs().mean()"
    # This implies gradient across the batch or feature dimension. Let's assume feature dim.
    frequency = torch.gradient(activations, dim=-1)[0].abs().mean()
    
    return coherence * entropy * frequency

def iphy_i_evaluation(model, test_loader, shock_intensity=0.5):
    """
    IPHY-I Protocol for Resilience Testing.
    1. Measure Baseline Accuracy.
    2. Apply Gaussian Shock (Adversarial/Noise).
    3. Measure Integrity Loss = (Base - Shock) / Base.
    4. Recovery (optional dynamic check, here we return metrics).
    """
    results = []
    
    for batch in test_loader:
        data, targets = batch
        
        # Baseline
        with torch.no_grad():
            baseline_output, _ = model(data)
            pred = baseline_output.argmax(-1)
            baseline_acc = (pred == targets).float().mean()
        
        # Shock
        shocked_data = data + shock_intensity * torch.randn_like(data)
        
        with torch.no_grad():
            shocked_output, _ = model(shocked_data)
            pred_shock = shocked_output.argmax(-1)
            shocked_acc = (pred_shock == targets).float().mean()
        
        integrity_loss = (baseline_acc - shocked_acc) / (baseline_acc + 1e-9)
        
        results.append({
            'integrity_loss': integrity_loss.item(),
            'baseline_acc': baseline_acc.item(),
            'shocked_acc': shocked_acc.item()
        })
    
    avg_integrity_loss = np.mean([r['integrity_loss'] for r in results])
    # Stable if loss < 0.3 (30%)
    stable = avg_integrity_loss <= 0.3
    
    return {
        'avg_integrity_loss': avg_integrity_loss,
        'stable': stable,
        'results': results
    }
