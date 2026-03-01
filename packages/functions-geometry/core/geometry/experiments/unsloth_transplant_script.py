
# !pip -q install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
# !pip -q install --no-deps "xformers" "trl<0.9.0" peft accelerate bitsandbytes
# !pip -q install rich datasets

import torch, gc
from rich.console import Console
from unsloth import FastLanguageModel
from peft import PeftModel
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments
import json

console = Console()

def reset_forge():
    if 'model' in globals(): del globals()['model']
    if 'tokenizer' in globals(): del globals()['tokenizer']
    if 'trainer' in globals(): del globals()['trainer']
    gc.collect()
    torch.cuda.empty_cache()
    torch.cuda.synchronize()
    console.print("[bold yellow]🧹 VRAM Liberada. Hardware listo.[/bold yellow]")

# reset_forge()

MODEL_9B = "unsloth/gemma-2-9b-it-bnb-4bit"

print(f"Loading {MODEL_9B}...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = MODEL_9B,
    max_seq_length = 2048,
    load_in_4bit = True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    lora_alpha = 32,
    lora_dropout = 0.05,
    target_modules = [
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ]
)

print("✅ Gemma 9B cargada + LoRA listo.")

# Assuming dataset_schema_lock.jsonl exists in current dir
print("Loading Dataset...")

def formatting_prompts_func(examples):
    instrs = examples["instruction"]
    inputs = [json.dumps(i, ensure_ascii=False) for i in examples["input"]]
    outs   = examples["output"]
    texts = []
    for instr, inp, out in zip(instrs, inputs, outs):
        texts.append(f"### Telemetry:\n{inp}\n\n### Instruction:\n{instr}\n\n### Response:\n{out}{tokenizer.eos_token}")
    return {"text": texts}

ds = load_dataset("json", data_files="dataset_schema_lock.jsonl", split="train")
ds = ds.map(formatting_prompts_func, batched=True)

print("Starting Training...")
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=ds,
    dataset_text_field="text",
    max_seq_length=2048,
    args=TrainingArguments(
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        warmup_steps=0,
        max_steps=35,
        learning_rate=6e-6,
        logging_steps=1,
        optim="adamw_8bit",
        output_dir="outputs_schema_lock",
    ),
)

trainer.train()
print("✅ schema lock listo")
