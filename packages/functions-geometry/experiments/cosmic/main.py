import argparse
import logging
import uuid

import numpy as np

from cosmic_engine import CosmicPhysicsEngine
from cosmic_persistence import UniverseStatePersistence

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)


def parse_args():
    p = argparse.ArgumentParser(description="CosmicPhysicsEngine-3D simulator")
    p.add_argument("--steps", type=int, default=500)
    p.add_argument("--size", type=int, default=32)
    p.add_argument("--out", type=str, default="cosmic_log.jsonl")
    p.add_argument("--seed", type=int, default=None)
    p.add_argument("--hubble", type=float, default=1e-4,
                   help="Parámetro de Hubble H (tasa de expansión lineal)")
    p.add_argument("--temp", type=float, default=0.1,
                   help="Temperatura inicial T_0 (se enfría como T_0/a(t))")
    return p.parse_args()


def main():
    args = parse_args()

    if args.seed is not None:
        np.random.seed(args.seed)

    # Propagar temperatura al engine
    CosmicPhysicsEngine.TEMPERATURE = args.temp

    run_id = str(uuid.uuid4())
    logger.info(f"Iniciando simulación cósmica (Run ID: {run_id})")
    logger.info(
        f"Configuración: Size={args.size}^3, Steps={args.steps}, "
        f"H={args.hubble}, T_0={args.temp}"
    )

    u = np.random.rand(args.size, args.size, args.size)
    metrics = {}

    for step in range(args.steps):
        estado, metrics = CosmicPhysicsEngine.evolucionar(
            u, step=step, H=args.hubble
        )

        if metrics["sueno"]:
            logger.info(
                f"🌙 Sueño activado en paso {step:04d} "
                f"| a(t)={metrics['expansion_factor']:.3f} "
                f"| Curvatura={metrics['mean_curvature']:.3f}"
            )

        if step % 10 == 0:
            logger.info(
                f"Step {step:04d} "
                f"| a(t)={metrics['expansion_factor']:.3f} "
                f"| F={metrics['free_energy']:.2f} "
                f"| R_mean={metrics['mean_curvature']:.3f}"
            )

        UniverseStatePersistence.save_to_jsonl(
            estado,
            args.out,
            run_id=run_id,
            step=step,
            metrics=metrics,
        )

        u = estado

    logger.info("Simulación finalizada.")
    logger.info(f"Run ID: {run_id}")
    logger.info(f"Última entropía: {metrics.get('entropy', 0):.5f}")
    logger.info(f"Energía libre: {metrics.get('free_energy', 0):.5f}")
    logger.info(f"Sueño final: {metrics.get('sueno', False)}")
    logger.info(f"Curvatura final: {metrics.get('mean_curvature', 0):.5f}")
    logger.info(f"Factor expansión: {metrics.get('expansion_factor', 1):.5f}")


if __name__ == "__main__":
    main()
