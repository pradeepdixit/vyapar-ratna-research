"""Publish an already-verified dist build without switching the source worktree."""
import os
import pathlib
import shutil
import subprocess
import tempfile

root = pathlib.Path(__file__).resolve().parents[1]
subprocess.run(['git', 'fetch', 'origin', 'gh-pages'], cwd=root, check=True)
parent = subprocess.check_output(['git', 'rev-parse', 'FETCH_HEAD'], cwd=root, text=True).strip()
site = pathlib.Path(tempfile.mkdtemp(prefix='vyapar-pages-'))
shutil.copytree(root / 'dist', site, dirs_exist_ok=True)
(site / '.nojekyll').touch()
env = os.environ.copy()
env['GIT_INDEX_FILE'] = str(site.parent / (site.name + '-index'))
env['GIT_WORK_TREE'] = str(site)

def git(*args):
    return subprocess.check_output(['git', *args], cwd=root, env=env, text=True).strip()

git('read-tree', '--empty')
git('add', '--all')
tree = git('write-tree')
sha = git('commit-tree', tree, '-p', parent, '-m', 'Publish high-contrast readable research website')
subprocess.run(['git', 'push', 'origin', sha + ':refs/heads/gh-pages'], cwd=root, check=True)
print('Pages version pushed:', sha, flush=True)
