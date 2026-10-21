import os
import subprocess

def run_git_automation():
    print("--- 🚀 STARTING ONE-CLICK GITHUB AUTO-PUSH ---")
    if not os.path.exists(".git"):
        subprocess.run(["git", "init"], check=True)
        print("📁 Initialized empty Git repository.")
    subprocess.run(["git", "config", "core.fileMode", "false"], capture_output=True)
    subprocess.run(["git", "add", "."], check=True)
    print("➕ Added all project files successfully.")
    
    commit_res = subprocess.run(["git", "commit", "-m", "Auto-push: World-Class Cyber AI & Consultant Live Sync"], capture_output=True, text=True)
    print(f"📦 Commit status: {commit_res.stdout.strip() or commit_res.stderr.strip()}")
    
    push_res = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True)
    if push_res.returncode == 0:
        print("🎉 SUCCESS! Code pushed to GitHub.")
    else:
        push_master = subprocess.run(["git", "push", "origin", "master"], capture_output=True, text=True)
        if push_master.returncode == 0:
            print("🎉 SUCCESS! Code pushed to master branch.")
        else:
            print(f"⚠️ Push notice: {push_res.stderr.strip()}")

if __name__ == "__main__":
    run_git_automation()
