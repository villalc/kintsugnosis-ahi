import json
import matplotlib.pyplot as plt
import numpy as np

def plot_comparison():
    try:
        with open("gauge_experiment_logs.json", "r") as f:
            gauge_data = json.load(f)
        with open("baseline_experiment_logs.json", "r") as f:
            baseline_data = json.load(f)
    except FileNotFoundError:
        print("Log files not found.")
        return

    # Extract Data
    steps = [d["step"] for d in gauge_data]
    
    g_loss = [d["loss"] for d in gauge_data]
    b_loss = [d["loss"] for d in baseline_data]
    
    # Gap (sparse)
    g_gap_data = [(d["step"], d["mass_gap"]) for d in gauge_data if d["mass_gap"] is not None]
    b_gap_data = [(d["step"], d["mass_gap"]) for d in baseline_data if d["mass_gap"] is not None]
    
    g_gap_steps, g_gap_vals = zip(*g_gap_data)
    b_gap_steps, b_gap_vals = zip(*b_gap_data)

    fig, axs = plt.subplots(2, 1, figsize=(10, 10), sharex=True)
    
    # Plot Loss Comparison
    axs[0].plot(steps, g_loss, label="Sintergic Gauge Net", color="green", linewidth=2)
    axs[0].plot(steps, b_loss, label="Baseline MLP", color="gray", linestyle="--")
    axs[0].set_ylabel("Cross Entropy Loss")
    axs[0].set_title("Optimization Dynamics: Gauge vs Baseline")
    axs[0].set_yscale('log')
    axs[0].legend()
    axs[0].grid(True, alpha=0.3)

    # Plot Gap Comparison
    axs[1].plot(g_gap_steps, g_gap_vals, label="Gauge Mass Gap", color="green", marker='o')
    axs[1].plot(b_gap_steps, b_gap_vals, label="Baseline Mass Gap", color="gray", marker='x', linestyle="--")
    axs[1].set_ylabel("Physical Mass Gap (Delta)")
    axs[1].set_xlabel("Step")
    axs[1].set_title("Landscape Rigidity")
    axs[1].legend()
    axs[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig("comparison_results.png")
    print("Plot saved to comparison_results.png")

if __name__ == "__main__":
    plot_comparison()
