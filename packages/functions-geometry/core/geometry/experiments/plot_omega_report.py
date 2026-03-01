import json
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

def generate_plots():
    data_logs = []
    data_sep = []
    
    with open("omega_ricci_logs.jsonl", 'r') as f:
        for line in f:
            entry = json.loads(line)
            if entry.get("type") == "separation":
                data_sep.append(entry)
            else:
                data_logs.append(entry)
    
    df_logs = pd.DataFrame(data_logs)
    df_sep = pd.DataFrame(data_sep)
    
    # 1. Training Dynamics (Mean +/- Std)
    # Aggregate by step across seeds
    # Pivot? No, group by step.
    # Note: steps might not align perfectly if batch sizes vary, but here they are fixed.
    
    stats = df_logs.groupby("step").agg(['mean', 'std'])
    
    # Metrics to plot
    metrics = ['ricci', 'gap', 'psi']
    titles = ['Ricci Curvature (Geometric Rigidity)', 'Mass Gap (Spectral)', 'Structural Memory (Psi)']
    
    plt.figure(figsize=(15, 5))
    
    for i, metric in enumerate(metrics):
        plt.subplot(1, 3, i+1)
        mean_val = stats[metric]['mean']
        std_val = stats[metric]['std'].fillna(0)
        
        steps = stats.index
        
        plt.plot(steps, mean_val, label=f"Mean {metric}")
        plt.fill_between(steps, mean_val - std_val, mean_val + std_val, alpha=0.3)
        
        plt.title(titles[i])
        plt.xlabel("Training Steps")
        plt.grid(True, alpha=0.3)
        
    plt.tight_layout()
    plt.savefig("omega_training_dynamics.png")
    print("Generated omega_training_dynamics.png")
    
    # 2. Separation Analysis (Bar plot with CI)
    if not df_sep.empty:
        safe_mean = df_sep['ricci_safe'].mean()
        safe_std = df_sep['ricci_safe'].std()
        
        risk_mean = df_sep['ricci_risk'].mean()
        risk_std = df_sep['ricci_risk'].std()
        
        plt.figure(figsize=(6, 6))
        labels = ['Safe', 'Risk']
        means = [safe_mean, risk_mean]
        stds = [safe_std, risk_std]
        
        plt.bar(labels, means, yerr=stds, capsize=10, color=['green', 'red'], alpha=0.7)
        plt.title("Geometric Signature: Ricci Curvature Separation")
        plt.ylabel("Avg Ricci Curvature")
        plt.grid(axis='y', alpha=0.3)
        
        plt.savefig("omega_separation_analysis.png")
        print("Generated omega_separation_analysis.png")
        
        print("\n--- Separation Stats ---")
        print(f"Safe: {safe_mean:.4f} +/- {safe_std:.4f}")
        print(f"Risk: {risk_mean:.4f} +/- {risk_std:.4f}")
        delta = safe_mean - risk_mean
        print(f"Delta (Safe - Risk): {delta:.4f}")

if __name__ == "__main__":
    # Ensure pandas/matplotlib in case
    # pip install pandas matplotlib
    generate_plots()
