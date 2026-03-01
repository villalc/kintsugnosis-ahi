import torch
import json
import os

class OmegaLatticeLoader:
    def __init__(self, file_path, lattice_size=28, max_samples=1000):
        """
        Loads Omega JSONL data and maps text to a 2D lattice.
        
        Args:
            file_path: Path to .jsonl file.
            lattice_size: Size of the square lattice (e.g., 28 -> 784 chars).
            max_samples: Limit number of samples for prototype speed.
        """
        self.file_path = file_path
        self.lattice_size = lattice_size
        self.max_len = lattice_size * lattice_size
        self.max_samples = max_samples
        self.data = []
        self.labels = []
        
        self.label_map = {
            "NOMINAL": 0, 
            "ELEVATED": 1, "CRITICAL": 1, "HIGH": 1, 
            "CRÍTICO": 1, "ALTO": 1, "ELEVADO": 1
        } # Binaraize for now
        
        self._load()
        
    def _load(self):
        count = 0
        with open(self.file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if count >= self.max_samples:
                    break
                try:
                    entry = json.loads(line)
                    # Schema Lock Dataset format:
                    # {"system":..., "instruction":..., "input": {...}, "output":...}
                    # We combine instruction and input for the signal.
                    
                    instr = entry.get("instruction", "")
                    inp = entry.get("input", "")
                    
                    if isinstance(inp, dict):
                        inp_str = json.dumps(inp)
                    else:
                        inp_str = str(inp)
                        
                    text = f"Instruction: {instr} Input: {inp_str}"
                    
                    # Label? Schema Lock is "nomimal" generation.
                    # Let's check intent tags or metadata if available.
                    # This dataset has no risk metadata, it's synthetic benign.
                    # So label is 0.
                    label = 0
                    
                    self.data.append(self._text_to_lattice(text))
                    self.labels.append(label)
                    count += 1
                except Exception as e:
                    continue
                    
    def _text_to_lattice(self, text):
        # Convert to bytes
        b = text.encode('utf-8')
        # Pad or Truncate
        if len(b) > self.max_len:
            b = b[:self.max_len]
        else:
            b = b + b'\x00' * (self.max_len - len(b))
            
        # Convert to tensor [0, 255] -> [-1, 1]
        nums = torch.tensor(list(b), dtype=torch.float32)
        norm = (nums / 127.5) - 1.0
        
        # Reshape? The model expects flattened [N] or [H, W]
        # GLNN takes flattened [N, Lattice^2]
        return norm

    def get_dataset(self):
        if not self.data:
            return torch.tensor([]), torch.tensor([])
        
        X = torch.stack(self.data)
        y = torch.tensor(self.labels, dtype=torch.long)
        return X, y
