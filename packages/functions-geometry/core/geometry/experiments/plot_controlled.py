import json
import matplotlib.pyplot as plt

def plot_control():
    try:
        with open("controlled_experiment_logs.json", "r") as f:
            data = json.load(f)
    except:
        return

    steps = [d["step"] for d in data]
    curv = [d["curvature"] for d in data]
    acc = [d["val_acc"] for d in data]

    fig, ax1 = plt.subplots(figsize=(8, 6))

    color = 'tab:green'
    ax1.set_xlabel('Step')
    ax1.set_ylabel('Curvature (Kappa)', color=color)
    ax1.plot(steps, curv, color=color, marker='o', label='Curvature (Psi~0.9)')
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.axhline(0, color='gray', linestyle='--')

    ax2 = ax1.twinx()  
    color = 'tab:blue'
    ax2.set_ylabel('Validation Accuracy', color=color)  
    ax2.plot(steps, acc, color=color, linestyle='--', marker='x', label='Val Accuracy')
    ax2.tick_params(axis='y', labelcolor=color)

    plt.title("Impact of High Structural Memory (Psi -> 0.9)")
    fig.tight_layout()  
    plt.savefig("controlled_results.png")

if __name__ == "__main__":
    plot_control()
