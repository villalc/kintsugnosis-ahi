import json
import matplotlib.pyplot as plt
import numpy as np

def plot_results():
    try:
        with open("gauge_experiment_logs.json", "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Log file not found.")
        return

    steps = [d["step"] for d in data]
    loss = [d["loss"] for d in data]
    curvature = [d["curvature"] for d in data]
    psi = [d["psi"] for d in data]
    
    # Mass Gap is sparse (None in some entries)
    gap_steps = [d["step"] for d in data if d["mass_gap"] is not None]
    gap_vals = [d["mass_gap"] for d in data if d["mass_gap"] is not None]

    fig, axs = plt.subplots(3, 1, figsize=(10, 12), sharex=True)
    
    # Plot Loss
    axs[0].plot(steps, loss, label="Task Loss", color="blue")
    axs[0].set_ylabel("Cross Entropy Loss")
    axs[0].set_title("Training Dynamics")
    axs[0].legend()
    axs[0].grid(True, alpha=0.3)

    # Plot Curvature
    axs[1].plot(steps, curvature, label="Synthetic Ricci Curvature", color="green")
    axs[1].axhline(0, color='gray', linestyle='--')
    axs[1].set_ylabel("Curvature (Kappa)")
    axs[1].legend()
    axs[1].grid(True, alpha=0.3)
    
    # Plot Gap
    axs[2].plot(gap_steps, gap_vals, label="Physical Mass Gap", color="red", marker='o', markersize=4)
    axs[2].set_ylabel("Mass Gap (Delta)")
    axs[2].set_xlabel("Step")
    axs[2].legend()
    axs[2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig("gauge_experiment_results.png")
    print("Plot saved to gauge_experiment_results.png")

if __name__ == "__main__":
    plot_results()
