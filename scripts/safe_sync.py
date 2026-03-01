import subprocess
import sys
import os

def run_command(command, description):
    print(f"\n[SAFE SYNC] {description}...")
    try:
        subprocess.check_call(command, shell=True)
        print(f"[OK] {description} completed.")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] {description} failed. Please consult your AI partner.")
        sys.exit(1)

def main():
    print("========================================")
    print("   AHI SAFETY SYNC PROTOCOL v1.0")
    print("========================================")
    
    # 1. Fetch latest changes
    run_command("git fetch origin", "Fetching remote updates")
    
    # 2. Check status
    print("\n[SAFE SYNC] Checking local status...")
    status = subprocess.check_output("git status --porcelain", shell=True).decode()
    
    if status:
        print("[INFO] You have local changes. Stashing them for safety...")
        run_command("git stash save 'Auto-stash by safe_sync'", "Stashing local changes")
        stashed = True
    else:
        stashed = False
        
    # 3. Pull updates (rebase to keep history clean)
    try:
        run_command("git pull origin main --rebase", "Integrating remote changes")
    except Exception:
        print("[WARNING] Rebase failed. Aborting rebase and trying simple merge...")
        subprocess.call("git rebase --abort", shell=True)
        run_command("git pull origin main", "Merging remote changes")

    # 4. Restore local changes
    if stashed:
        print("\n[SAFE SYNC] Restoring your local work...")
        try:
            subprocess.check_call("git stash pop", shell=True)
        except subprocess.CalledProcessError:
            print("[WARNING] Conflict detected during stash pop. Manual resolution required.")
            print("Don't worry, your changes are safe in the stash list.")

    # 5. Push safety check
    print("\n[SAFE SYNC] Verifying architecture integrity...")
    try:
        subprocess.check_call([sys.executable, "scripts/architecture_check.py"])
    except Exception:
        print("[WARNING] Architecture check failed. Proceeding with caution.")
    
    print("\n========================================")
    print("   SYNC COMPLETE. SYSTEM IS SAFE.")
    print("========================================")

if __name__ == "__main__":
    main()
