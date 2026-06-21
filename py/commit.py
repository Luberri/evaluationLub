import os
import time
import subprocess
import keyboard

# ============================================================
# CONFIGURATION
# ============================================================

# Mets ici le chemin de ton dépôt git
REPO_PATH = r"D:\evaluationLub"


# ============================================================
# ACTION : GIT ADD / COMMIT / PUSH (Ctrl + → + 0)
# ============================================================

def push_github():
    """Fait un git add/commit/push sur le dépôt configuré."""
    print("\n📦 Lancement du commit/push...")

    if not os.path.isdir(os.path.join(REPO_PATH, ".git")):
        print(f"❌ Aucun dépôt git trouvé dans : {REPO_PATH}")
        return

    message_commit = f"update {time.strftime('%Y-%m-%d %H:%M:%S')}"

    try:
        # git add .
        subprocess.run(["git", "add", "."], cwd=REPO_PATH, check=True)

        # git commit
        resultat_commit = subprocess.run(
            ["git", "commit", "-m", message_commit],
            cwd=REPO_PATH, capture_output=True, text=True
        )
        print(resultat_commit.stdout)
        if resultat_commit.returncode != 0:
            print(f"⚠️ {resultat_commit.stderr.strip()}")

        # git push
        resultat_push = subprocess.run(
            ["git", "push"], cwd=REPO_PATH, capture_output=True, text=True
        )
        print(resultat_push.stdout)
        if resultat_push.returncode == 0:
            print("✅ Push effectué avec succès !")
        else:
            print(f"❌ Erreur push : {resultat_push.stderr.strip()}")

    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur git : {e}")


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 55)
    print("🎧 Listener actif !")
    print(f"📁 Dépôt surveillé : {REPO_PATH}")
    print("Ctrl+→+0      → Git add / commit / push")
    print("Ctrl+Shift+Q  → Quitter")
    print("=" * 55)

    keyboard.add_hotkey('ctrl+right+0', push_github)

    keyboard.wait('ctrl+shift+q')
    print("👋 Arrêt du listener.")


if __name__ == "__main__":
    main()