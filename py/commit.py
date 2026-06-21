import os
import time
import subprocess
import keyboard

# ============================================================
# CONFIGURATION
# ============================================================

REPO_PATH = r"D:\evaluationLub"


# ============================================================
# ACTION 1 : GIT ADD / COMMIT / PUSH (Ctrl + → + 0)
# ============================================================

def push_github():
    """Fait un git add/commit/push sur le dépôt configuré."""
    print("\n📦 Lancement du commit/push...")

    if not os.path.isdir(os.path.join(REPO_PATH, ".git")):
        print(f"❌ Aucun dépôt git trouvé dans : {REPO_PATH}")
        return

    message_commit = f"update {time.strftime('%Y-%m-%d %H:%M:%S')}"

    try:
        subprocess.run(["git", "add", "."], cwd=REPO_PATH, check=True)

        resultat_commit = subprocess.run(
            ["git", "commit", "-m", message_commit],
            cwd=REPO_PATH, capture_output=True, text=True
        )
        print(resultat_commit.stdout)
        if resultat_commit.returncode != 0:
            print(f"⚠️ {resultat_commit.stderr.strip()}")

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
# ACTION 2 : GIT FETCH ORIGIN / PULL (Ctrl + → + 9)
# ============================================================

def pull_github():
    """Fait un git fetch origin puis git pull sur le dépôt configuré."""
    print("\n📥 Lancement du fetch/pull...")

    if not os.path.isdir(os.path.join(REPO_PATH, ".git")):
        print(f"❌ Aucun dépôt git trouvé dans : {REPO_PATH}")
        return

    try:
        # git fetch origin
        resultat_fetch = subprocess.run(
            ["git", "fetch", "origin"],
            cwd=REPO_PATH, capture_output=True, text=True
        )
        print(resultat_fetch.stdout)
        if resultat_fetch.returncode != 0:
            print(f"❌ Erreur fetch : {resultat_fetch.stderr.strip()}")
            return
        else:
            print("✅ Fetch origin terminé.")

        # git pull
        resultat_pull = subprocess.run(
            ["git", "pull"],
            cwd=REPO_PATH, capture_output=True, text=True
        )
        print(resultat_pull.stdout)
        if resultat_pull.returncode == 0:
            print("✅ Pull effectué avec succès !")
        else:
            print(f"❌ Erreur pull : {resultat_pull.stderr.strip()}")

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
    print("Ctrl+→+9      → Git fetch origin / pull")
    print("Ctrl+Shift+Q  → Quitter")
    print("=" * 55)

    keyboard.add_hotkey('ctrl+right+0', push_github)
    keyboard.add_hotkey('ctrl+right+9', pull_github)

    keyboard.wait('ctrl+shift+q')
    print("👋 Arrêt du listener.")


if __name__ == "__main__":
    main()